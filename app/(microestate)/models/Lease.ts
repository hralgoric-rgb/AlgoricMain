import mongoose, { Document, Schema, Model } from "mongoose";

// Define signature interface
export interface ISignature {
  signed: boolean;
  signedAt?: Date;
  signature?: string;
}

// Define lease status type
export type LeaseStatus = "draft" | "active" | "expired" | "terminated";

// Main Lease document interface
export interface ILease extends Document {
  propertyId: mongoose.Schema.Types.ObjectId;
  landlordId: mongoose.Schema.Types.ObjectId;
  tenantId: mongoose.Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate: number; // Day of the month when rent is due (1-31)
  status: LeaseStatus;
  terms: string;
  signatures: {
    landlord: ISignature;
    tenant: ISignature;
  };
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  isExpired(): boolean;
  isFullySigned(): boolean;
  getRemainingDays(): number;
  calculateTotalValue(): number;
}

// Model interface for static methods
export interface ILeaseModel extends Model<ILease> {
  findActiveLeases(): Promise<ILease[]>;
  findExpiredLeases(): Promise<ILease[]>;
  findByTenant(tenantId: string): Promise<ILease[]>;
  findByLandlord(landlordId: string): Promise<ILease[]>;
  findByProperty(propertyId: string): Promise<ILease[]>;
}

// Lease Agreement Schema
const leaseSchema = new Schema<ILease>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "MicroProperty",
      required: [true, "Property ID is required"],
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "MicroestateUser",
      required: [true, "Landlord ID is required"],
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "MicroestateUser",
      required: [true, "Tenant ID is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function(this: ILease, value: Date) {
          return value <= this.endDate;
        },
        message: "Start date must be before end date",
      },
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function(this: ILease, value: Date) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    monthlyRent: {
      type: Number,
      required: [true, "Monthly rent is required"],
      min: [0, "Monthly rent cannot be negative"],
    },
    securityDeposit: {
      type: Number,
      required: [true, "Security deposit is required"],
      min: [0, "Security deposit cannot be negative"],
    },
    rentDueDate: {
      type: Number,
      default: 1,
      min: [1, "Rent due date must be between 1 and 31"],
      max: [31, "Rent due date must be between 1 and 31"],
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "active", "expired", "terminated"],
        message: "Status must be one of: draft, active, expired, terminated",
      },
      default: "draft",
    },
    terms: {
      type: String,
      required: [true, "Lease terms are required"],
      minlength: [10, "Terms must be at least 10 characters long"],
    },
    signatures: {
      landlord: {
        signed: { 
          type: Boolean, 
          default: false 
        },
        signedAt: { 
          type: Date,
          validate: {
            validator: function(this: ILease, value: Date) {
              return !value || this.signatures.landlord.signed;
            },
            message: "Signed date can only be set when signed is true",
          },
        },
        signature: { 
          type: String,
          validate: {
            validator: function(this: ILease, value: string) {
              return !value || this.signatures.landlord.signed;
            },
            message: "Signature can only be set when signed is true",
          },
        },
      },
      tenant: {
        signed: { 
          type: Boolean, 
          default: false 
        },
        signedAt: { 
          type: Date,
          validate: {
            validator: function(this: ILease, value: Date) {
              return !value || this.signatures.tenant.signed;
            },
            message: "Signed date can only be set when signed is true",
          },
        },
        signature: { 
          type: String,
          validate: {
            validator: function(this: ILease, value: string) {
              return !value || this.signatures.tenant.signed;
            },
            message: "Signature can only be set when signed is true",
          },
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Instance Methods
leaseSchema.methods.isExpired = function(this: ILease): boolean {
  return new Date() > this.endDate;
};

leaseSchema.methods.isFullySigned = function(this: ILease): boolean {
  return this.signatures.landlord.signed && this.signatures.tenant.signed;
};

leaseSchema.methods.getRemainingDays = function(this: ILease): number {
  const today = new Date();
  const timeDiff = this.endDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

leaseSchema.methods.calculateTotalValue = function(this: ILease): number {
  const months = Math.ceil(
    (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24 * 30)
  );
  return (this.monthlyRent * months) + this.securityDeposit;
};

// Static Methods
leaseSchema.statics.findActiveLeases = function(): Promise<ILease[]> {
  return this.find({ status: "active" }).populate("propertyId landlordId tenantId");
};

leaseSchema.statics.findExpiredLeases = function(): Promise<ILease[]> {
  return this.find({ 
    $or: [
      { status: "expired" },
      { endDate: { $lt: new Date() } }
    ]
  }).populate("propertyId landlordId tenantId");
};

leaseSchema.statics.findByTenant = function(tenantId: string): Promise<ILease[]> {
  return this.find({ tenantId }).populate("propertyId landlordId");
};

leaseSchema.statics.findByLandlord = function(landlordId: string): Promise<ILease[]> {
  return this.find({ landlordId }).populate("propertyId tenantId");
};

leaseSchema.statics.findByProperty = function(propertyId: string): Promise<ILease[]> {
  return this.find({ propertyId }).populate("landlordId tenantId");
};

// Pre-save middleware for status updates
leaseSchema.pre<ILease>("save", function(next) {
  const now = new Date();
  
  // Auto-update status based on dates
  if (this.endDate < now && this.status === "active") {
    this.status = "expired";
  } else if (
    this.startDate <= now && 
    this.endDate > now && 
    this.status === "draft" && 
    this.isFullySigned()
  ) {
    this.status = "active";
  }
  
  next();
});

// Indexes for performance
leaseSchema.index({ propertyId: 1, status: 1 });
leaseSchema.index({ landlordId: 1, status: 1 });
leaseSchema.index({ tenantId: 1, status: 1 });
leaseSchema.index({ startDate: 1, endDate: 1 });
leaseSchema.index({ status: 1, endDate: 1 });

// Create the model
const Lease: ILeaseModel = (mongoose.models.Lease as ILeaseModel) || mongoose.model<ILease, ILeaseModel>("Lease", leaseSchema);

export default Lease;

// Additional TypeScript types for API usage
export interface CreateLeaseInput {
  propertyId: string;
  landlordId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate?: number;
  terms: string;
}

export interface UpdateLeaseInput {
  startDate?: Date;
  endDate?: Date;
  monthlyRent?: number;
  securityDeposit?: number;
  rentDueDate?: number;
  terms?: string;
  status?: LeaseStatus;
}

export interface SignLeaseInput {
  signature: string;
  userType: "landlord" | "tenant";
}

export interface LeaseResponse {
  _id: string;
  propertyId: string;
  landlordId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate: number;
  status: LeaseStatus;
  terms: string;
  signatures: {
    landlord: ISignature;
    tenant: ISignature;
  };
  createdAt: Date;
  updatedAt: Date;
  isExpired: boolean;
  isFullySigned: boolean;
  remainingDays: number;
  totalValue: number;
}