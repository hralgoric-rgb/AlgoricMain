import mongoose, { Document, Schema, Model } from "mongoose";

// Define notification types
export type NotificationType =
  | "rent_due"
  | "rent_paid"
  | "maintenance_request"
  | "lease_expiring"
  | "bill_due"
  | "general";

// Define notification priority
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

// Main Notification document interface
export interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  relatedId?: mongoose.Schema.Types.ObjectId;
  relatedModel?: string;
  metadata?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  markAsRead(): void;
  markAsUnread(): void;
  isExpired(): boolean;
  canBeDeleted(): boolean;
  getRelatedDocument(): Promise<any>;
}

// Model interface for static methods
export interface INotificationModel extends Model<INotification> {
  findByUser(userId: string): Promise<INotification[]>;
  findUnreadByUser(userId: string): Promise<INotification[]>;
  findByType(type: NotificationType): Promise<INotification[]>;
  findByPriority(priority: NotificationPriority): Promise<INotification[]>;
  markAllAsRead(userId: string): Promise<void>;
  deleteExpiredNotifications(): Promise<void>;
  createRentDueNotification(
    userId: string,
    rentPayment: any
  ): Promise<INotification>;
  createMaintenanceNotification(
    userId: string,
    maintenanceRequest: any
  ): Promise<INotification>;
  createLeaseExpiringNotification(
    userId: string,
    lease: any
  ): Promise<INotification>;
  createBillDueNotification(userId: string, bill: any): Promise<INotification>;
  getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    byPriority: Record<NotificationPriority, number>;
  }>;
}

// Notification Schema
const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "MicroestateUserr",
      required: [true, "User ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: {
        values: [
          "rent_due",
          "rent_paid",
          "maintenance_request",
          "lease_expiring",
          "bill_due",
          "general",
        ],
        message:
          "Type must be one of: rent_due, rent_paid, maintenance_request, lease_expiring, bill_due, general",
      },
      required: [true, "Type is required"],
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "Priority must be one of: low, medium, high, urgent",
      },
      default: "medium",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      validate: {
        validator: function (
          this: INotification,
          value: mongoose.Schema.Types.ObjectId
        ) {
          return !value || !!this.relatedModel;
        },
        message: "Related model must be specified when relatedId is provided",
      },
    },
    relatedModel: {
      type: String,
      enum: [
        "RentPayment",
        "MaintenanceRequest",
        "Lease",
        "UtilityBill",
        "Property",
      ],
      validate: {
        validator: function (this: INotification, value: string) {
          return !this.relatedId || !!value;
        },
        message: "Related model is required when relatedId is provided",
      },
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    scheduledFor: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return !value || value >= new Date();
        },
        message: "Scheduled date must be in the future",
      },
    },
    expiresAt: {
      type: Date,
      validate: {
        validator: function (this: INotification, value: Date) {
          return !value || value > new Date();
        },
        message: "Expiration date must be in the future",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Instance Methods
notificationSchema.methods.markAsRead = function (this: INotification): void {
  this.isRead = true;
};

notificationSchema.methods.markAsUnread = function (this: INotification): void {
  this.isRead = false;
};

notificationSchema.methods.isExpired = function (this: INotification): boolean {
  return !!this.expiresAt && this.expiresAt < new Date();
};

notificationSchema.methods.canBeDeleted = function (
  this: INotification
): boolean {
  const now = new Date();
  const createdDate = new Date(this.createdAt);
  const daysDiff = Math.ceil(
    (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24)
  );

  // Allow deletion if read and older than 7 days, or if expired
  return (this.isRead && daysDiff > 7) || this.isExpired();
};

notificationSchema.methods.getRelatedDocument = async function (
  this: INotification
): Promise<any> {
  if (!this.relatedId || !this.relatedModel) return null;

  try {
    const model = mongoose.model(this.relatedModel);
    return await model.findById(this.relatedId);
  } catch (error) {
    console.error("Error fetching related document:", error);
    return null;
  }
};

// Static Methods
notificationSchema.statics.findByUser = function (
  userId: string
): Promise<INotification[]> {
  return this.find({ userId }).sort({ createdAt: -1 });
};

notificationSchema.statics.findUnreadByUser = function (
  userId: string
): Promise<INotification[]> {
  return this.find({ userId, isRead: false }).sort({ createdAt: -1 });
};

notificationSchema.statics.findByType = function (
  type: NotificationType
): Promise<INotification[]> {
  return this.find({ type }).populate("userId").sort({ createdAt: -1 });
};

notificationSchema.statics.findByPriority = function (
  priority: NotificationPriority
): Promise<INotification[]> {
  return this.find({ priority }).populate("userId").sort({ createdAt: -1 });
};

notificationSchema.statics.markAllAsRead = function (
  userId: string
): Promise<void> {
  return this.updateMany({ userId, isRead: false }, { isRead: true });
};

notificationSchema.statics.deleteExpiredNotifications =
  function (): Promise<void> {
    return this.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        {
          isRead: true,
          createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 days old
        },
      ],
    });
  };

notificationSchema.statics.createRentDueNotification = function (
  userId: string,
  rentPayment: any
): Promise<INotification> {
  return this.create({
    userId,
    title: "Rent Payment Due",
    message: `Your rent payment of $${
      rentPayment.amount
    } is due on ${rentPayment.dueDate.toLocaleDateString()}`,
    type: "rent_due",
    priority: "high",
    relatedId: rentPayment._id,
    relatedModel: "RentPayment",
    metadata: {
      amount: rentPayment.amount,
      dueDate: rentPayment.dueDate,
      propertyId: rentPayment.propertyId,
    },
  });
};

notificationSchema.statics.createMaintenanceNotification = function (
  userId: string,
  maintenanceRequest: any
): Promise<INotification> {
  const priority =
    maintenanceRequest.priority === "emergency" ? "urgent" : "medium";

  return this.create({
    userId,
    title: "Maintenance Request Update",
    message: `Maintenance request "${maintenanceRequest.title}" has been ${maintenanceRequest.status}`,
    type: "maintenance_request",
    priority,
    relatedId: maintenanceRequest._id,
    relatedModel: "MaintenanceRequest",
    metadata: {
      requestTitle: maintenanceRequest.title,
      category: maintenanceRequest.category,
      priority: maintenanceRequest.priority,
      status: maintenanceRequest.status,
    },
  });
};

notificationSchema.statics.createLeaseExpiringNotification = function (
  userId: string,
  lease: any
): Promise<INotification> {
  const daysUntilExpiry = Math.ceil(
    (lease.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return this.create({
    userId,
    title: "Lease Expiring Soon",
    message: `Your lease expires in ${daysUntilExpiry} days on ${lease.endDate.toLocaleDateString()}`,
    type: "lease_expiring",
    priority: daysUntilExpiry <= 30 ? "high" : "medium",
    relatedId: lease._id,
    relatedModel: "Lease",
    metadata: {
      endDate: lease.endDate,
      daysUntilExpiry,
      propertyId: lease.propertyId,
    },
  });
};

notificationSchema.statics.createBillDueNotification = function (
  userId: string,
  bill: any
): Promise<INotification> {
  return this.create({
    userId,
    title: "Utility Bill Due",
    message: `Your ${bill.utilityType} bill of $${
      bill.amount
    } is due on ${bill.dueDate.toLocaleDateString()}`,
    type: "bill_due",
    priority: "medium",
    relatedId: bill._id,
    relatedModel: "UtilityBill",
    metadata: {
      utilityType: bill.utilityType,
      amount: bill.amount,
      dueDate: bill.dueDate,
      propertyId: bill.propertyId,
    },
  });
};

notificationSchema.statics.getNotificationStats = function (userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] } },
        types: { $push: "$type" },
        priorities: { $push: "$priority" },
      },
    },
  ]).then((results) => {
    const result = results[0] || {
      total: 0,
      unread: 0,
      types: [],
      priorities: [],
    };

    const stats = {
      total: result.total,
      unread: result.unread,
      byType: {} as Record<NotificationType, number>,
      byPriority: {} as Record<NotificationPriority, number>,
    };

    // Count by type
    result.types.forEach((type: NotificationType) => {
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    // Count by priority
    result.priorities.forEach((priority: NotificationPriority) => {
      stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
    });

    return stats;
  });
};

// Pre-save middleware
notificationSchema.pre<INotification>("save", function (next) {
  // Set default expiration for certain types
  if (!this.expiresAt && this.type !== "general") {
    const expirationDays = {
      rent_due: 30,
      rent_paid: 7,
      maintenance_request: 14,
      lease_expiring: 60,
      bill_due: 30,
    };

    const days = expirationDays[this.type] || 30;
    this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  next();
});

// Indexes for performance
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ priority: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ scheduledFor: 1 });

// Create the model
const Notification: INotificationModel =
  (mongoose.models.Notification as INotificationModel) ||
  mongoose.model<INotification, INotificationModel>(
    "Notification",
    notificationSchema
  );

export default Notification;

// Additional TypeScript types for API usage
export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  relatedId?: string;
  relatedModel?: string;
  metadata?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export interface UpdateNotificationInput {
  title?: string;
  message?: string;
  priority?: NotificationPriority;
  isRead?: boolean;
  metadata?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export interface NotificationResponse {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  relatedId?: string;
  relatedModel?: string;
  metadata?: Record<string, any>;
  scheduledFor?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isExpired: boolean;
  canBeDeleted: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

// Utility functions
export const getNotificationIcon = (type: NotificationType): string => {
  const icons = {
    rent_due: "💰",
    rent_paid: "✅",
    maintenance_request: "🔧",
    lease_expiring: "📅",
    bill_due: "💡",
    general: "ℹ️",
  };
  return icons[type];
};

export const getNotificationColor = (
  priority: NotificationPriority
): string => {
  const colors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
    urgent: "#dc2626",
  };
  return colors[priority];
};

export const formatNotificationTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
};

// Notification service helper
export class NotificationService {
  static async sendRentDueReminder(
    userId: string,
    rentPayment: any
  ): Promise<INotification> {
    return await Notification.createRentDueNotification(userId, rentPayment);
  }

  static async sendMaintenanceUpdate(
    userId: string,
    maintenanceRequest: any
  ): Promise<INotification> {
    return await Notification.createMaintenanceNotification(
      userId,
      maintenanceRequest
    );
  }

  static async sendLeaseExpiringAlert(
    userId: string,
    lease: any
  ): Promise<INotification> {
    return await Notification.createLeaseExpiringNotification(userId, lease);
  }

  static async sendBillDueAlert(
    userId: string,
    bill: any
  ): Promise<INotification> {
    return await Notification.createBillDueNotification(userId, bill);
  }

  static async sendCustomNotification(
    data: CreateNotificationInput
  ): Promise<INotification> {
    return await Notification.create(data);
  }

  static async getUserNotifications(userId: string): Promise<INotification[]> {
    return await Notification.findByUser(userId);
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const unreadNotifications = await Notification.findUnreadByUser(userId);
    return unreadNotifications.length;
  }

  static async markAllAsRead(userId: string): Promise<void> {
    await Notification.markAllAsRead(userId);
  }

  static async cleanupExpiredNotifications(): Promise<void> {
    await Notification.deleteExpiredNotifications();
  }
}
