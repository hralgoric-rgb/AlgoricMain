import mongoose, { Document, Schema, Model } from "mongoose";

// Define payment status type
export type PaymentStatus = "pending" | "paid" | "overdue" | "partial";

// Define payment method type
export type PaymentMethod = "credit_card" | "bank_transfer" | "check" | "cash";

// Main Rent Payment document interface
export interface IRentPayment extends Document {
  leaseId: mongoose.Schema.Types.ObjectId;
  tenantId: mongoose.Schema.Types.ObjectId;
  landlordId: mongoose.Schema.Types.ObjectId;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  lateFee: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  isOverdue(): boolean;
  getTotalAmount(): number;
  markAsPaid(paymentMethod: PaymentMethod, transactionId?: string): void;
  addLateFee(fee: number): void;
  getDaysOverdue(): number;
}

// Model interface for static methods
export interface IRentPaymentModel extends Model<IRentPayment> {
  findOverduePayments(): Promise<IRentPayment[]>;
  findPendingPayments(): Promise<IRentPayment[]>;
  findByTenant(tenantId: string): Promise<IRentPayment[]>;
  findByLandlord(landlordId: string): Promise<IRentPayment[]>;
  findByLease(leaseId: string): Promise<IRentPayment[]>;
  getMonthlyRevenue(landlordId: string, year: number, month: number): Promise<number>;
}

// Rent Payment Schema
const rentPaymentSchema = new Schema<IRentPayment>(
  {
    leaseId: {
      type: Schema.Types.ObjectId,
      ref: "Lease",
      required: [true, "Lease ID is required"],
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Tenant ID is required"],
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Landlord ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    paidDate: {
      type: Date,
      validate: {
        validator: function(this: IRentPayment, value: Date) {
          return !value || this.status === "paid";
        },
        message: "Paid date can only be set when status is paid",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "paid", "overdue", "partial"],
        message: "Status must be one of: pending, paid, overdue, partial",
      },
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["credit_card", "bank_transfer", "check", "cash"],
        message: "Payment method must be one of: credit_card, bank_transfer, check, cash",
      },
      required: function(this: IRentPayment) {
        return this.status === "paid";
      },
    },
    transactionId: {
      type: String,
      validate: {
        validator: function(this: IRentPayment, value: string) {
          return !value || this.status === "paid";
        },
        message: "Transaction ID can only be set when status is paid",
      },
    },
    lateFee: {
      type: Number,
      default: 0,
      min: [0, "Late fee cannot be negative"],
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Instance Methods
rentPaymentSchema.methods.isOverdue = function(this: IRentPayment): boolean {
  const today = new Date();
  return this.dueDate < today && this.status !== "paid";
};

rentPaymentSchema.methods.getTotalAmount = function(this: IRentPayment): number {
  return this.amount + this.lateFee;
};

rentPaymentSchema.methods.markAsPaid = function(
  this: IRentPayment,
  paymentMethod: PaymentMethod,
  transactionId?: string
): void {
  this.status = "paid";
  this.paidDate = new Date();
  this.paymentMethod = paymentMethod;
  if (transactionId) {
    this.transactionId = transactionId;
  }
};

rentPaymentSchema.methods.addLateFee = function(this: IRentPayment, fee: number): void {
  if (fee < 0) {
    throw new Error("Late fee cannot be negative");
  }
  this.lateFee += fee;
};

rentPaymentSchema.methods.getDaysOverdue = function(this: IRentPayment): number {
  if (this.status === "paid") return 0;
  
  const today = new Date();
  const timeDiff = today.getTime() - this.dueDate.getTime();
  return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
};

// Static Methods
rentPaymentSchema.statics.findOverduePayments = function(): Promise<IRentPayment[]> {
  return this.find({
    status: { $in: ["pending", "partial"] },
    dueDate: { $lt: new Date() }
  }).populate("leaseId tenantId landlordId");
};

rentPaymentSchema.statics.findPendingPayments = function(): Promise<IRentPayment[]> {
  return this.find({ status: "pending" }).populate("leaseId tenantId landlordId");
};

rentPaymentSchema.statics.findByTenant = function(tenantId: string): Promise<IRentPayment[]> {
  return this.find({ tenantId }).populate("leaseId landlordId").sort({ dueDate: -1 });
};

rentPaymentSchema.statics.findByLandlord = function(landlordId: string): Promise<IRentPayment[]> {
  return this.find({ landlordId }).populate("leaseId tenantId").sort({ dueDate: -1 });
};

rentPaymentSchema.statics.findByLease = function(leaseId: string): Promise<IRentPayment[]> {
  return this.find({ leaseId }).populate("tenantId landlordId").sort({ dueDate: -1 });
};

rentPaymentSchema.statics.getMonthlyRevenue = function(
  landlordId: string,
  year: number,
  month: number
): Promise<number> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return this.aggregate([
    {
      $match: {
        landlordId: new mongoose.Types.ObjectId(landlordId),
        status: "paid",
        paidDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $add: ["$amount", "$lateFee"] } }
      }
    }
  ]).then(result => result[0]?.totalRevenue || 0);
};

// Pre-save middleware for status updates
rentPaymentSchema.pre<IRentPayment>("save", function(next) {
  const now = new Date();
  
  // Auto-update status to overdue if past due date and not paid
  if (this.dueDate < now && this.status === "pending") {
    this.status = "overdue";  
  }
  
  // Set paid date if marking as paid
  if (this.status === "paid" && !this.paidDate) {
    this.paidDate = now;
  }
  
  next();
});

// Indexes for performance
rentPaymentSchema.index({ leaseId: 1, dueDate: 1 });
rentPaymentSchema.index({ tenantId: 1, status: 1 });  
rentPaymentSchema.index({ landlordId: 1, status: 1 });
rentPaymentSchema.index({ dueDate: 1, status: 1 });
rentPaymentSchema.index({ status: 1, dueDate: 1 });

// Create the model
const RentPayment: IRentPaymentModel = (mongoose.models.RentPayment as IRentPaymentModel) || 
  mongoose.model<IRentPayment, IRentPaymentModel>("RentPayment", rentPaymentSchema);

export default RentPayment;

// Additional TypeScript types for API usage
export interface CreateRentPaymentInput {
  leaseId: string;
  tenantId: string;
  landlordId: string;
  amount: number;
  dueDate: Date;
  notes?: string;
}

export interface UpdateRentPaymentInput {
  amount?: number;
  dueDate?: Date;
  status?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  lateFee?: number;
  notes?: string;
}

export interface ProcessPaymentInput {
  paymentMethod: PaymentMethod;
  transactionId?: string;
  amount?: number;
  notes?: string;
}

export interface RentPaymentResponse {
  _id: string;
  leaseId: string;
  tenantId: string;
  landlordId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  lateFee: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isOverdue: boolean;
  totalAmount: number;
  daysOverdue: number;
}

export interface PaymentStats {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalLateFees: number;
  paymentCount: number;
  overdueCount: number;
}

// Utility functions
export const calculateLateFee = (
  baseAmount: number,
  daysOverdue: number,
  feePercentage: number = 0.05
): number => {
  if (daysOverdue <= 0) return 0;
  return Math.round(baseAmount * feePercentage * Math.min(daysOverdue / 30, 1));
};

export const generatePaymentSchedule = (
  lease: {
    startDate: Date;
    endDate: Date;
    monthlyRent: number;
    rentDueDate: number;
  },
  tenantId: string,
  landlordId: string
): CreateRentPaymentInput[] => {
  const payments: CreateRentPaymentInput[] = [];
  const currentDate = new Date(lease.startDate);
  const endDate = new Date(lease.endDate);
  
  while (currentDate <= endDate) {
    const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), lease.rentDueDate);
    
    // If due date is before start date, move to next month
    if (dueDate < lease.startDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    
    // Don't create payment if due date is after lease end
    if (dueDate > endDate) break;
    
    payments.push({
      leaseId: '', // Will be set when creating
      tenantId,
      landlordId,
      amount: lease.monthlyRent,
      dueDate,
    });
    
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return payments;
};