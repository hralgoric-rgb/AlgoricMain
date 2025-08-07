import mongoose, { Schema, Document } from "mongoose";

export interface ICommercialProperty extends Document {
  _id: string;
  title: string;
  description: string;
  location: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: [number, number];
  };
  images: string[];

  // Property Details
  propertyType:
    | "Office"
    | "Retail"
    | "Warehouse"
    | "Co-working"
    | "Industrial"
    | "Data Center";
  totalArea: number; // in sqft
  builtYear?: number;

  // Basic Property Details from Form
  projectName: string;
  fullAddress: string;
  pinCode: string;
  locality: string;
  googleMapsPin?: string;
  possessionStatus: "Ready to Move" | "Under Construction" | "Leased Asset";
  totalValuation: number; // Total valuation in crores
  minimumInvestmentTicket: string;
  customTicketAmount?: number;

  // Developer Info
  developer?: {
    name: string;
    rating: number;
    projectsCompleted: number;
  };

  // Investment Details
  totalPropertyValue: number; // Total value of the property
  totalShares: number; // Total shares available
  availableShares: number; // Remaining shares for purchase
  pricePerShare: number;
  minInvestment: number;

  // Fractional Investment Parameters
  targetRaiseAmount?: number;
  ownershipSplit?: string;
  sharePercentage?: number;
  minimumHoldingPeriod?: string;
  exitOptions: string[];

  // Returns
  currentROI: number; // Annual ROI percentage
  currentYield: number; // Annual current yield percentage (rentalYield from form)
  appreciationRate: number; // Expected annual appreciation (annualROIProjection from form)

  // Occupancy & Revenue
  currentOccupancy: number; // Percentage
  monthlyRental: number; // Total monthly rental income

  // SPV Details
  spvId?: string;
  spvName?: string;

  // Status
  status: "active" | "sold_out" | "coming_soon" | "pending_approval";
  featured: boolean;

  // Additional Info
  amenities: string[];
  nearbyLandmarks: string[];
  features: string[];
  highlights: string[]; // Property highlights/USP from form
  customHighlights?: string;
  tenantName?: string;

  // Documents
  documents: {
    name: string;
    url: string;
    type: "legal" | "financial" | "technical";
  }[];
  documentsUploaded: boolean;

  // Media & Marketing
  virtualTourLink?: string;
  requestVirtualTour: boolean;

  // Contact Information
  ownerDetails: {
    name: string;
    phone: string;
    email: string;
    companyName?: string;
  };

  // Legal
  termsAccepted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CommercialPropertySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
        trim: true,
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (v: number[]) {
            return !v || v.length === 2;
          },
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
    images: {
      type: [String],
      default: [],
    },

    // Basic Property Details from Form
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    fullAddress: {
      type: String,
      required: [true, "Full address is required"],
      trim: true,
    },
    pinCode: {
      type: String,
      required: [true, "Pin code is required"],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, "Locality is required"],
      trim: true,
    },
    googleMapsPin: {
      type: String,
      trim: true,
    },
    possessionStatus: {
      type: String,
      required: [true, "Possession status is required"],
      enum: {
        values: ["Ready to Move", "Under Construction", "Leased Asset"],
        message: "Possession status must be one of: Ready to Move, Under Construction, Leased Asset",
      },
    },
    totalValuation: {
      type: Number,
      required: [true, "Total valuation is required"],
      min: [0, "Total valuation cannot be negative"],
    },
    minimumInvestmentTicket: {
      type: String,
      required: [true, "Minimum investment ticket is required"],
    },
    customTicketAmount: {
      type: Number,
      min: [0, "Custom ticket amount cannot be negative"],
    },

    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: {
        values: [
          "Office",
          "Retail",
          "Warehouse",
          "Data Center",
          "Co-working",
          "Industrial",
        ],
        message:
          "Property type must be one of: Office, Retail, Warehouse, Data Center, Co-working, Industrial",
      },
    },
    totalArea: {
      type: Number,
      min: [1, "Total area must be greater than 0"],
    },
    builtYear: {
      type: Number,
      min: [1900, "Built year must be after 1900"],
      max: [
        new Date().getFullYear() + 5,
        "Built year cannot be more than 5 years in the future",
      ],
    },
    developer: {
      name: {
        type: String,
        trim: true,
      },
      rating: {
        type: Number,
        min: [1, "Rating must be between 1 and 5"],
        max: [5, "Rating must be between 1 and 5"],
      },
      projectsCompleted: {
        type: Number,
        min: [0, "Projects completed cannot be negative"],
      },
    },
    totalPropertyValue: {
      type: Number,
      required: [true, "Total property value is required"],
      min: [1, "Total property value must be greater than 0"],
    },
    totalShares: {
      type: Number,
      required: [true, "Total shares is required"],
      min: [1, "Total shares must be greater than 0"],
    },
    availableShares: {
      type: Number,
      required: [true, "Available shares is required"],
      min: [0, "Available shares cannot be negative"],
      validate: {
        validator: function (this: ICommercialProperty, v: number) {
          return v <= this.totalShares;
        },
        message: "Available shares cannot exceed total shares",
      },
    },
    pricePerShare: {
      type: Number,
      required: [true, "Price per share is required"],
      min: [1, "Price per share must be greater than 0"],
    },
    minInvestment: {
      type: Number,
      required: [true, "Minimum investment is required"],
      min: [1, "Minimum investment must be greater than 0"],
    },

    // Fractional Investment Parameters
    targetRaiseAmount: {
      type: Number,
      min: [0, "Target raise amount cannot be negative"],
    },
    ownershipSplit: {
      type: String,
      trim: true,
    },
    sharePercentage: {
      type: Number,
      min: [0, "Share percentage cannot be negative"],
      max: [100, "Share percentage cannot exceed 100%"],
    },
    minimumHoldingPeriod: {
      type: String,
      trim: true,
    },
    exitOptions: {
      type: [String],
      default: [],
    },

    currentROI: {
      type: Number,
      required: [true, "Current ROI is required"],
      min: [0, "ROI cannot be negative"],
      max: [100, "ROI cannot exceed 100%"],
    },
    currentYield: {
      type: Number,
      required: [true, "Current yield is required"],
      min: [0, "Current yield cannot be negative"],
      max: [100, "Current yield cannot exceed 100%"],
    },
    appreciationRate: {
      type: Number,
      required: [true, "Appreciation rate is required"],
      min: [0, "Appreciation rate cannot be negative"],
      max: [100, "Appreciation rate cannot exceed 100%"],
    },
    currentOccupancy: {
      type: Number,
      required: [true, "Current occupancy is required"],
      min: [0, "Occupancy cannot be negative"],
      max: [100, "Occupancy cannot exceed 100%"],
    },
    monthlyRental: {
      type: Number,
      required: [true, "Monthly rental is required"],
      min: [0, "Monthly rental cannot be negative"],
    },
    spvId: {
      type: String,
      trim: true,
    },
    spvName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "sold_out", "coming_soon", "pending_approval"],
        message: "Status must be one of: active, sold_out, coming_soon, pending_approval",
      },
      default: "pending_approval",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    amenities: {
      type: [String],
      default: [],
    },
    nearbyLandmarks: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    customHighlights: {
      type: String,
      trim: true,
    },
    tenantName: {
      type: String,
      trim: true,
    },
    documents: [
      {
        name: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
        type: {
          type: String,
          enum: {
            values: ["legal", "financial", "technical"],
            message:
              "Document type must be one of: legal, financial, technical",
          },
        },
      },
    ],
    documentsUploaded: {
      type: Boolean,
      default: false,
    },

    // Media & Marketing
    virtualTourLink: {
      type: String,
      trim: true,
    },
    requestVirtualTour: {
      type: Boolean,
      default: false,
    },

    // Contact Information
    ownerDetails: {
      name: {
        type: String,
        required: [true, "Owner name is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Owner phone is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Owner email is required"],
        trim: true,
      },
      companyName: {
        type: String,
        trim: true,
      },
    },

    // Legal
    termsAccepted: {
      type: Boolean,
      required: [true, "Terms must be accepted"],
      validate: {
        validator: function (v: boolean) {
          return v === true;
        },
        message: "Terms and conditions must be accepted",
      },
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
    collection: "commercialProperties", // Explicitly set collection name
  }
);

// Add indexes for better query performance
CommercialPropertySchema.index({ location: 1 });
CommercialPropertySchema.index({ propertyType: 1 });
CommercialPropertySchema.index({ status: 1 });
CommercialPropertySchema.index({ featured: 1 });
CommercialPropertySchema.index({ currentROI: -1 });
CommercialPropertySchema.index({ rentalYield: -1 });
CommercialPropertySchema.index({ pricePerShare: 1 });
CommercialPropertySchema.index({ "address.city": 1 });

// Ensure the model is not redefined during hot reloads in development
const CommercialProperty =
  mongoose.models.CommercialProperty ||
  mongoose.model<ICommercialProperty>(
    "CommercialProperty",
    CommercialPropertySchema
  );

export default CommercialProperty;
