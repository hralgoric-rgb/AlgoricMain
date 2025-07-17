import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// TypeScript interface for User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role: "landlord" | "tenant";
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// TypeScript interface for User model (static methods)
export interface IUserModel extends Model<IUser> {
  // Add any static methods here if needed
}

// User Schema (Base for both Landlord and Tenant)
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function(v: string) {
          return /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    role: {
      type: String,
      enum: {
        values: ["landlord", "tenant"],
        message: "Role must be either landlord or tenant",
      },
      required: [true, "Role is required"],
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// JWT token generation
userSchema.methods.generateAuthToken = function (): string {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  
  return jwt.sign(
    { 
      _id: this._id, 
      email: this.email, 
      role: this.role 
    },
    jwtSecret,
    { expiresIn: "3d" }
  );
};

// // Create virtual for full name
// userSchema.virtual("fullName").get(function (this: IUser) {
//   return `${this.firstName} ${this.lastName}`;
// });

// // Ensure virtual fields are serialized
// userSchema.set("toJSON", {
//   virtuals: true,
//   transform: function(_doc, ret) {
//     delete ret.password;
//     delete ret.__v;
//     return ret;
//   },
// });

// Create and export the model
const User: IUserModel = mongoose.models.User || mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;

// // Additional TypeScript types for API usage
// export type UserRole = "landlord" | "tenant";

// export interface CreateUserInput {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phone: string;
//   role: UserRole;
//   address?: {
//     street?: string;
//     city?: string;
//     state?: string;
//     zipCode?: string;
//     country?: string;
//   };
//   profileImage?: string;
// }

// export interface UpdateUserInput {
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   address?: {
//     street?: string;
//     city?: string;
//     state?: string;
//     zipCode?: string;
//     country?: string;
//   };
//   profileImage?: string;
// }

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface UserResponse {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   address: {
//     street?: string;
//     city?: string;
//     state?: string;
//     zipCode?: string;
//     country?: string;
//   };
//   role: UserRole;
//   profileImage?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }