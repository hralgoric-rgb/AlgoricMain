/**
 * Migration script to merge duplicate builder records
 * This script will:
 * 1. Find all users with duplicate emails (one from normal signup, one from Google)
 * 2. Merge them into a single user record
 * 3. Clean up the separate Builder collection records
 * 4. Ensure builder verification status is preserved
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Define schemas (simplified versions)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  emailVerified: Date,
  googleId: String,
  role: String,
  isAgent: Boolean,
  isBuilder: Boolean,
  builderInfo: {
    companyName: String,
    licenseNumber: String,
    reraId: String,
    established: Date,
    experience: Number,
    specializations: [String],
    completedProjects: Number,
    ongoingProjects: Number,
    rating: Number,
    reviewCount: Number,
    verified: Boolean,
  },
  agentInfo: {
    licenseNumber: String,
    agency: String,
    experience: Number,
    specializations: [String],
    languages: [String],
    rating: Number,
    reviewCount: Number,
    verified: Boolean,
  },
  createdAt: { type: Date, default: Date.now },
  lastActive: Date,
}, { collection: 'users' });

const builderSchema = new mongoose.Schema({
  title: String,
  image: String,
  logo: String,
  projects: Number,
  description: String,
  established: String,
  headquarters: String,
  specialization: String,
  rating: Number,
  completed: Number,
  ongoing: Number,
  contact: {
    email: String,
    phone: String,
  }
}, { collection: 'builders' });

let User, Builder;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    User = mongoose.model('User', userSchema);
    Builder = mongoose.model('Builder', builderSchema);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function findDuplicateUsers() {
  console.log('Finding duplicate users by email...');
  
  const duplicates = await User.aggregate([
    {
      $group: {
        _id: '$email',
        count: { $sum: 1 },
        users: { $push: '$$ROOT' }
      }
    },
    {
      $match: {
        count: { $gt: 1 }
      }
    }
  ]);
  
  console.log(`Found ${duplicates.length} emails with duplicate users`);
  return duplicates;
}

async function mergeDuplicateUsers(duplicateGroup) {
  const { _id: email, users } = duplicateGroup;
  console.log(`\nMerging ${users.length} users for email: ${email}`);
  
  // Sort users - prefer the one with more complete data
  users.sort((a, b) => {
    // Prefer verified users
    if (a.emailVerified && !b.emailVerified) return -1;
    if (!a.emailVerified && b.emailVerified) return 1;
    
    // Prefer users with builder status
    if (a.isBuilder && !b.isBuilder) return -1;
    if (!a.isBuilder && b.isBuilder) return 1;
    
    // Prefer users with agent status
    if (a.isAgent && !b.isAgent) return -1;
    if (!a.isAgent && b.isAgent) return 1;
    
    // Prefer older accounts
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  
  const primaryUser = users[0];
  const duplicateUsers = users.slice(1);
  
  console.log(`Primary user: ${primaryUser._id} (created: ${primaryUser.createdAt})`);
  console.log(`Duplicate users: ${duplicateUsers.map(u => u._id).join(', ')}`);
  
  // Merge data from duplicates into primary user
  let hasChanges = false;
  
  for (const duplicate of duplicateUsers) {
    // Merge basic fields
    if (!primaryUser.image && duplicate.image) {
      primaryUser.image = duplicate.image;
      hasChanges = true;
    }
    
    if (!primaryUser.emailVerified && duplicate.emailVerified) {
      primaryUser.emailVerified = duplicate.emailVerified;
      hasChanges = true;
    }
    
    if (!primaryUser.googleId && duplicate.googleId) {
      primaryUser.googleId = duplicate.googleId;
      hasChanges = true;
    }
    
    // Merge builder status
    if (duplicate.isBuilder && !primaryUser.isBuilder) {
      primaryUser.isBuilder = true;
      primaryUser.role = 'builder';
      hasChanges = true;
    }
    
    // Merge builder info
    if (duplicate.builderInfo && (!primaryUser.builderInfo || !primaryUser.builderInfo.verified)) {
      primaryUser.builderInfo = {
        ...primaryUser.builderInfo,
        ...duplicate.builderInfo
      };
      hasChanges = true;
    }
    
    // Merge agent status
    if (duplicate.isAgent && !primaryUser.isAgent) {
      primaryUser.isAgent = true;
      if (primaryUser.role === 'user') {
        primaryUser.role = 'agent';
      }
      hasChanges = true;
    }
    
    // Merge agent info
    if (duplicate.agentInfo && (!primaryUser.agentInfo || !primaryUser.agentInfo.verified)) {
      primaryUser.agentInfo = {
        ...primaryUser.agentInfo,
        ...duplicate.agentInfo
      };
      hasChanges = true;
    }
    
    // Update last active to the most recent
    if (duplicate.lastActive && (!primaryUser.lastActive || duplicate.lastActive > primaryUser.lastActive)) {
      primaryUser.lastActive = duplicate.lastActive;
      hasChanges = true;
    }
  }
  
  // Save merged user if there were changes
  if (hasChanges) {
    await User.findByIdAndUpdate(primaryUser._id, primaryUser);
    console.log(`Updated primary user with merged data`);
  }
  
  // Delete duplicate users
  const duplicateIds = duplicateUsers.map(u => u._id);
  await User.deleteMany({ _id: { $in: duplicateIds } });
  console.log(`Deleted ${duplicateIds.length} duplicate users`);
  
  return primaryUser;
}

async function migrateBuilderCollection() {
  console.log('\nMigrating separate Builder collection...');
  
  const builders = await Builder.find({});
  console.log(`Found ${builders.length} builders in separate collection`);
  
  let migratedCount = 0;
  let notFoundCount = 0;
  
  for (const builder of builders) {
    if (!builder.contact?.email) {
      console.log(`Builder ${builder._id} has no email, skipping...`);
      continue;
    }
    
    const user = await User.findOne({ email: builder.contact.email });
    
    if (!user) {
      console.log(`No user found for builder email: ${builder.contact.email}`);
      notFoundCount++;
      continue;
    }
    
    // Update user with builder info from Builder collection
    const builderInfo = {
      ...user.builderInfo,
      verified: true,
      companyName: builder.title,
      experience: builder.established ? new Date().getFullYear() - new Date(builder.established).getFullYear() : undefined,
      specializations: builder.specialization ? [builder.specialization] : [],
      completedProjects: builder.completed || 0,
      ongoingProjects: builder.ongoing || 0,
      rating: builder.rating || 0,
      reviewCount: 0,
    };
    
    await User.findByIdAndUpdate(user._id, {
      isBuilder: true,
      role: 'builder',
      builderInfo: builderInfo,
      image: user.image || builder.image,
      bio: user.bio || builder.description
    });
    
    console.log(`Migrated builder ${builder.title} to user ${user.email}`);
    migratedCount++;
  }
  
  console.log(`Migration complete: ${migratedCount} migrated, ${notFoundCount} not found`);
  
  // Optionally delete the Builder collection documents
  // Uncomment the line below if you want to clean up the Builder collection
  // await Builder.deleteMany({});
  // console.log('Cleaned up Builder collection');
}

async function runMigration() {
  try {
    await connectDB();
    
    console.log('Starting user deduplication and builder migration...\n');
    
    // Step 1: Find and merge duplicate users
    const duplicates = await findDuplicateUsers();
    
    for (const duplicateGroup of duplicates) {
      await mergeDuplicateUsers(duplicateGroup);
    }
    
    console.log('\n=== User deduplication complete ===');
    
    // Step 2: Migrate Builder collection data to User collection
    await migrateBuilderCollection();
    
    console.log('\n=== Migration complete ===');
    console.log('All duplicate users have been merged and builder data migrated to User collection');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
runMigration();
