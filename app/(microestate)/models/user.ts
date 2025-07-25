import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

// TypeScript interface for User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: "landlord" | "tenant";
  profileImage?: string;
  emailVerified?: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  qrCode?: string; // Changed from 'qr' to 'qrCode' for consistency
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// TypeScript interface for User model (static methods)
export interface IUserModel extends Model<IUser> {
  // Add any static methods here if needed
}

// User Schema
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
        validator: function (v: string) {
          return /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: "Please enter a valid phone number",
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    qrCode: {
      // Changed from 'qr' to 'qrCode'
      type: String,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
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

// Create and export the model
const User =
  mongoose.models.User || mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
