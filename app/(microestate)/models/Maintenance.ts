import mongoose, { Document, Schema, Model } from "mongoose";

// Define maintenance category type
export type MaintenanceCategory = 
  | "plumbing" 
  | "electrical" 
  | "heating" 
  | "cooling" 
  | "appliances" 
  | "structural" 
  | "other";

// Define maintenance priority type
export type MaintenancePriority = "low" | "medium" | "high" | "emergency";

// Define maintenance status type
export type MaintenanceStatus = 
  | "submitted" 
  | "acknowledged" 
  | "in_progress" 
  | "completed" 
  | "cancelled";

// Main Maintenance Request document interface
export interface IMaintenanceRequest extends Document {
  propertyId: mongoose.Schema.Types.ObjectId;
  tenantId: mongoose.Schema.Types.ObjectId;
  landlordId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  images: string[];
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: Date;
  completedDate?: Date;
  assignedContractor?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  isOverdue(): boolean;
  getDaysOpen(): number;
  markAsCompleted(actualCost?: number, notes?: string): void;
  assignContractor(contractorName: string, scheduledDate?: Date): void;
  updateStatus(status: MaintenanceStatus, notes?: string): void;
  calculateResponseTime(): number;
  isEmergency(): boolean;
}

// Model interface for static methods
export interface IMaintenanceRequestModel extends Model<IMaintenanceRequest> {
  findByStatus(status: MaintenanceStatus): Promise<IMaintenanceRequest[]>;
  findByPriority(priority: MaintenancePriority): Promise<IMaintenanceRequest[]>;
  findByCategory(category: MaintenanceCategory): Promise<IMaintenanceRequest[]>;
  findByProperty(propertyId: string): Promise<IMaintenanceRequest[]>;
  findByTenant(tenantId: string): Promise<IMaintenanceRequest[]>;
  findByLandlord(landlordId: string): Promise<IMaintenanceRequest[]>;
  findOverdueRequests(): Promise<IMaintenanceRequest[]>;
  findEmergencyRequests(): Promise<IMaintenanceRequest[]>;
  getMaintenanceStats(propertyId?: string): Promise<{
    totalRequests: number;
    completedRequests: number;
    pendingRequests: number;
    averageResponseTime: number;
    totalCost: number;
    byCategory: Record<MaintenanceCategory, number>;
    byPriority: Record<MaintenancePriority, number>;
  }>;
}

// Maintenance Request Schema
const maintenanceRequestSchema = new Schema<IMaintenanceRequest>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property ID is required"],
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
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      enum: {
        values: ["plumbing", "electrical", "heating", "cooling", "appliances", "structural", "other"],
        message: "Category must be one of: plumbing, electrical, heating, cooling, appliances, structural, other",
      },
      required: [true, "Category is required"],
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "emergency"],
        message: "Priority must be one of: low, medium, high, emergency",
      },
      default: "medium",
    },
    status: {
      type: String,
      enum: {
        values: ["submitted", "acknowledged", "in_progress", "completed", "cancelled"],
        message: "Status must be one of: submitted, acknowledged, in_progress, completed, cancelled",
      },
      default: "submitted",
    },
    images: {
      type: [String],
    },
    estimatedCost: {
      type: Number,
      min: [0, "Estimated cost cannot be negative"],
    },
    actualCost: {
      type: Number,
      min: [0, "Actual cost cannot be negative"],
      validate: {
        validator: function(this: IMaintenanceRequest, value: number) {
          return !value || this.status === "completed";
        },
        message: "Actual cost can only be set when status is completed",
      },
    },
    scheduledDate: {
      type: Date,
      validate: {
        validator: function(this: IMaintenanceRequest, value: Date) {
          return !value || value >= new Date();
        },
        message: "Scheduled date must be in the future",
      },
    },
    completedDate: {
      type: Date,
      validate: {
        validator: function(this: IMaintenanceRequest, value: Date) {
          return !value || this.status === "completed";
        },
        message: "Completed date can only be set when status is completed",
      },
    },
    assignedContractor: {
      type: String,
      trim: true,
      maxlength: [100, "Contractor name cannot exceed 100 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Instance Methods
maintenanceRequestSchema.methods.isOverdue = function(this: IMaintenanceRequest): boolean {
  if (this.status === "completed" || this.status === "cancelled") return false;
  
  const now = new Date();
  const createdDate = new Date(this.createdAt);
  const daysDiff = Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
  
  // Define overdue thresholds based on priority
  const thresholds = {
    emergency: 1,
    high: 3,
    medium: 7,
    low: 14
  };
  
  return daysDiff > thresholds[this.priority];
};

maintenanceRequestSchema.methods.getDaysOpen = function(this: IMaintenanceRequest): number {
  const endDate = this.completedDate || new Date();
  const startDate = new Date(this.createdAt);
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

maintenanceRequestSchema.methods.markAsCompleted = function(
  this: IMaintenanceRequest,
  actualCost?: number,
  notes?: string
): void {
  this.status = "completed";
  this.completedDate = new Date();
  if (actualCost !== undefined) this.actualCost = actualCost;
  if (notes) this.notes = notes;
};

maintenanceRequestSchema.methods.assignContractor = function(
  this: IMaintenanceRequest,
  contractorName: string,
  scheduledDate?: Date
): void {
  this.assignedContractor = contractorName;
  if (scheduledDate) this.scheduledDate = scheduledDate;
  if (this.status === "submitted") this.status = "acknowledged";
};

maintenanceRequestSchema.methods.updateStatus = function(
  this: IMaintenanceRequest,
  status: MaintenanceStatus,
  notes?: string
): void {
  this.status = status;
  if (notes) this.notes = notes;
  if (status === "completed" && !this.completedDate) {
    this.completedDate = new Date();
  }
};

maintenanceRequestSchema.methods.calculateResponseTime = function(this: IMaintenanceRequest): number {
  if (this.status === "submitted") return 0;
  
  const responseDate = this.scheduledDate || this.updatedAt;
  const createdDate = new Date(this.createdAt);
  const timeDiff = responseDate.getTime() - createdDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600));
};

maintenanceRequestSchema.methods.isEmergency = function(this: IMaintenanceRequest): boolean {
  return this.priority === "emergency";
};

// Static Methods
maintenanceRequestSchema.statics.findByStatus = function(status: MaintenanceStatus): Promise<IMaintenanceRequest[]> {
  return this.find({ status }).populate("propertyId tenantId landlordId").sort({ createdAt: -1 });
};

maintenanceRequestSchema.statics.findByPriority = function(priority: MaintenancePriority): Promise<IMaintenanceRequest[]> {
  return this.find({ priority }).populate("propertyId tenantId landlordId").sort({ createdAt: -1 });
};

maintenanceRequestSchema.statics.findByCategory = function(category: MaintenanceCategory): Promise<IMaintenanceRequest[]> {
  return this.find({ category }).populate("propertyId tenantId landlordId").sort({ createdAt: -1 });
};

maintenanceRequestSchema.statics.findByProperty = function(propertyId: string): Promise<IMaintenanceRequest[]> {
  return this.find({ propertyId }).populate("tenantId landlordId").sort({ createdAt: -1 });
};

maintenanceRequestSchema.statics.findByTenant = function(tenantId: string): Promise<IMaintenanceRequest[]> {
  return this.find({ tenantId }).populate("propertyId landlordId").sort({ createdAt: -1 });
};

maintenanceRequestSchema.statics.findByLandlord = function(landlordId: string): Promise<IMaintenanceRequest[]> {
  return this.find({ landlordId }).populate("propertyId tenantId").sort({ createdAt: -1 });
};

maintenanceRequestSchema.statics.findOverdueRequests = function(): Promise<IMaintenanceRequest[]> {
  return this.find({
    status: { $in: ["submitted", "acknowledged", "in_progress"] }
  }).populate("propertyId tenantId landlordId").then((requests: IMaintenanceRequest[]) => {
    return requests.filter((request: IMaintenanceRequest) => request.isOverdue());
  });
};

maintenanceRequestSchema.statics.findEmergencyRequests = function(): Promise<IMaintenanceRequest[]> {
  return this.find({ priority: "emergency", status: { $ne: "completed" } })
    .populate("propertyId tenantId landlordId")
    .sort({ createdAt: -1 });
};

maintenanceRequestSchema.statics.getMaintenanceStats = function(propertyId?: string) {
  const matchQuery = propertyId ? { propertyId: new mongoose.Types.ObjectId(propertyId) } : {};
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        completedRequests: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
        },
        pendingRequests: {
          $sum: { $cond: [{ $in: ["$status", ["submitted", "acknowledged", "in_progress"]] }, 1, 0] }
        },
        totalCost: { $sum: { $ifNull: ["$actualCost", 0] } },
        categories: { $push: "$category" },
        priorities: { $push: "$priority" },
        responseTimes: {
          $push: {
            $cond: [
              { $ne: ["$status", "submitted"] },
              { $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 3600000] },
              null
            ]
          }
        }
      }
    }
  ]).then(results => {
    const result = results[0] || {
      totalRequests: 0,
      completedRequests: 0,
      pendingRequests: 0,
      totalCost: 0,
      categories: [],
      priorities: [],
      responseTimes: []
    };
    
    // Calculate averages and breakdowns
    const stats = {
      totalRequests: result.totalRequests,
      completedRequests: result.completedRequests,
      pendingRequests: result.pendingRequests,
      averageResponseTime: result.responseTimes.filter((t: number) => t !== null).reduce((a: number, b: number) => a + b, 0) / result.responseTimes.filter((t: number) => t !== null).length || 0,
      totalCost: result.totalCost,
      byCategory: {} as Record<MaintenanceCategory, number>,
      byPriority: {} as Record<MaintenancePriority, number>
    };
    
    // Count by category
    result.categories.forEach((category: MaintenanceCategory) => {
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    });
    
    // Count by priority
    result.priorities.forEach((priority: MaintenancePriority) => {
      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
    });
    
    return stats;
  });
};

// Pre-save middleware
maintenanceRequestSchema.pre<IMaintenanceRequest>("save", function(next) {
  // Auto-set completed date if marking as completed
  if (this.status === "completed" && !this.completedDate) {
    this.completedDate = new Date();
  }
  
  next();
});

// Indexes for performance
maintenanceRequestSchema.index({ propertyId: 1, status: 1 });
maintenanceRequestSchema.index({ tenantId: 1, status: 1 });
maintenanceRequestSchema.index({ landlordId: 1, status: 1 });
maintenanceRequestSchema.index({ priority: 1, status: 1 });
maintenanceRequestSchema.index({ category: 1, status: 1 });
maintenanceRequestSchema.index({ createdAt: 1, status: 1 });

// Create the model
const MaintenanceRequest: IMaintenanceRequestModel = (mongoose.models.MaintenanceRequest as IMaintenanceRequestModel) ||
  mongoose.model<IMaintenanceRequest, IMaintenanceRequestModel>("MaintenanceRequest", maintenanceRequestSchema);

export default MaintenanceRequest;

// Additional TypeScript types for API usage
export interface CreateMaintenanceRequestInput {
  propertyId: string;
  tenantId: string;
  landlordId: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority?: MaintenancePriority;
  images?: string[];
  estimatedCost?: number;
  scheduledDate?: Date;
  notes?: string;
}

export interface UpdateMaintenanceRequestInput {
  title?: string;
  description?: string;
  category?: MaintenanceCategory;
  priority?: MaintenancePriority;
  status?: MaintenanceStatus;
  images?: string[];
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: Date;
  assignedContractor?: string;
  notes?: string;
}

export interface MaintenanceRequestResponse {
  _id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  images: string[];
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: Date;
  completedDate?: Date;
  assignedContractor?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isOverdue: boolean;
  daysOpen: number;
  isEmergency: boolean;
  responseTime: number;
}

export interface MaintenanceStats {
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  averageResponseTime: number;
  totalCost: number;
  byCategory: Record<MaintenanceCategory, number>;
  byPriority: Record<MaintenancePriority, number>;
}

// Utility functions
export const getPriorityColor = (priority: MaintenancePriority): string => {
  const colors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    emergency: "#dc2626"
  };
  return colors[priority];
};

export const getStatusColor = (status: MaintenanceStatus): string => {
  const colors = {
    submitted: "#6b7280",
    acknowledged: "#3b82f6",
    in_progress: "#f59e0b",
    completed: "#10b981",
    cancelled: "#ef4444"
  };
  return colors[status];
};

export const calculateMaintenanceCost = (requests: IMaintenanceRequest[]): {
  estimated: number;
  actual: number;
  variance: number;
} => {
  const estimated = requests.reduce((sum, req) => sum + (req.estimatedCost || 0), 0);
  const actual = requests.reduce((sum, req) => sum + (req.actualCost || 0), 0);
  const variance = actual - estimated;
  
  return { estimated, actual, variance };
};

export const generateMaintenanceReport = (requests: IMaintenanceRequest[]) => {
  const report = {
    totalRequests: requests.length,
    completedRequests: requests.filter(r => r.status === "completed").length,
    pendingRequests: requests.filter(r => r.status !== "completed" && r.status !== "cancelled").length,
    emergencyRequests: requests.filter(r => r.priority === "emergency").length,
    overdueRequests: requests.filter(r => r.isOverdue()).length,
    averageResponseTime: 0,
    costs: calculateMaintenanceCost(requests),
    byCategory: {} as Record<MaintenanceCategory, number>,
    byPriority: {} as Record<MaintenancePriority, number>,
    byStatus: {} as Record<MaintenanceStatus, number>
  };
  
  // Calculate averages and breakdowns
  requests.forEach(request => {
    // By category
    report.byCategory[request.category] = (report.byCategory[request.category] || 0) + 1;
    
    // By priority
    report.byPriority[request.priority] = (report.byPriority[request.priority] || 0) + 1;
    
    // By status
    report.byStatus[request.status] = (report.byStatus[request.status] || 0) + 1;
  });
  
  // Calculate average response time
  const responseTimes = requests
    .filter(r => r.status !== "submitted")
    .map(r => r.calculateResponseTime());
  
  if (responseTimes.length > 0) {
    report.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  }
  
  return report;
};