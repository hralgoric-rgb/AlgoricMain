const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/100gaj', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User schema (simplified)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  emailVerified: { type: Boolean, default: true },
  isAgent: { type: Boolean, default: false },
  phone: String,
  bio: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const createDemoUser = async () => {
  try {
    await connectDB();
    
    // Demo user data
    const demoEmail = 'demo@100gaj.com';
    const demoPassword = 'demo123';
    
    // Check if demo user already exists
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(demoPassword, saltRounds);
    
    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: demoEmail,
      password: hashedPassword,
      role: 'user',
      emailVerified: true,
      isAgent: false,
      phone: '+91 9876543210',
      bio: 'This is a demo user account for testing purposes. Feel free to explore all the features!',
      address: {
        street: '123 Demo Street',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110001',
        country: 'India'
      }
    });
    
    await demoUser.save();
    console.log('Demo user created successfully!');
    console.log(`Email: ${demoEmail}`);
    console.log(`Password: ${demoPassword}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating demo user:', error);
    mongoose.connection.close();
  }
};

// Also create a demo agent user
const createDemoAgent = async () => {
  try {
    await connectDB();
    
    // Demo agent data
    const demoEmail = 'agent@100gaj.com';
    const demoPassword = 'agent123';
    
    // Check if demo agent already exists
    const existingAgent = await User.findOne({ email: demoEmail });
    if (existingAgent) {
      console.log('Demo agent already exists');
      return;
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(demoPassword, saltRounds);
    
    // Create demo agent
    const demoAgent = new User({
      name: 'Demo Agent',
      email: demoEmail,
      password: hashedPassword,
      role: 'user',
      emailVerified: true,
      isAgent: true,
      phone: '+91 9876543211',
      bio: 'Experienced real estate agent with 5+ years in the Delhi NCR market. Specialized in residential properties.',
      address: {
        street: '456 Agent Plaza',
        city: 'Gurgaon',
        state: 'Haryana',
        zipCode: '122001',
        country: 'India'
      },
      agentInfo: {
        licenseNumber: 'REA12345',
        agency: '100Gaj Realty',
        experience: 5,
        specializations: ['Residential', 'Commercial', 'Investment'],
        languages: ['English', 'Hindi'],
        rating: 4.5,
        reviewCount: 23,
        verified: true,
        listings: 15,
        sales: 45
      }
    });
    
    await demoAgent.save();
    console.log('Demo agent created successfully!');
    console.log(`Email: ${demoEmail}`);
    console.log(`Password: ${demoPassword}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating demo agent:', error);
    mongoose.connection.close();
  }
};

// Run both functions
const createDemoUsers = async () => {
  await createDemoUser();
  await createDemoAgent();
};

if (require.main === module) {
  createDemoUsers();
}

module.exports = { createDemoUser, createDemoAgent, createDemoUsers }; 