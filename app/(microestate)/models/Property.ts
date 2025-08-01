import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// Define property types - Updated to include all property types from the UI dropdown
export type PropertyType = 'apartment' | 'house' | 'villa' | 'studio' | 'penthouse' | 'duplex' | 'townhouse' | 'condo';
export type PropertyStatus = 'available' | 'rented' | 'maintenance' | 'inactive';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

// Address interface
export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Rent details interface
export interface IRentDetails {
  amount: number;
  currency: Currency;
  period: 'monthly' | 'weekly' | 'daily';
}

// Lease terms interface
export interface ILeaseTerms {
  minimumTerm: number;
  maximumTerm: number;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  maxOccupants?: number;
  depositRequired: boolean;
}

// Utilities interface
export interface IUtilities {
  includedInRent: string[];
  tenantResponsible: string[];
}

// Property features interface
export interface IPropertyFeatures {
  parking: boolean;
  gym: boolean;
  pool: boolean;
  laundry: boolean;
  airConditioning: boolean;
  heating: boolean;
  internet: boolean;
  furnished: boolean;
  balcony: boolean;
  garden: boolean;
}

// Main Property document interface
export interface IProperty extends Document {
  landlordId: Types.ObjectId;
  title: string;
  description: string;
  address: IAddress;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  rent: IRentDetails;
  securityDeposit: number;
  amenities: string[];
  features: IPropertyFeatures;
  images: string[];
  status: PropertyStatus;
  leaseTerms: ILeaseTerms;
  utilities: IUtilities;
  availableFrom?: Date;
  lastUpdated: Date
  favoriteCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  isAvailable(): boolean;
  calculateMonthlyTotal(): number;
  incrementViewCount(): void;
  toggleAvailability(): void;
  getFullAddress(): string;
  generateListingUrl(): string;
  isRecentlyUpdated(): boolean;
  getPropertyAge(): number;
}

// Model interface for static methods
export interface IPropertyModel extends Model<IProperty> {
  findAvailable(): Promise<IProperty[]>;
  findByLandlord(landlordId: string): Promise<IProperty[]>;
  findByLocation(city: string, state?: string): Promise<IProperty[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<IProperty[]>;
  findByPropertyType(propertyType: PropertyType): Promise<IProperty[]>;
  searchProperties(query: {
    city?: string;
    propertyType?: PropertyType;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    features?: string[];
  }): Promise<IProperty[]>;
  getPropertyStats(landlordId?: string): Promise<{
    totalProperties: number;
    availableProperties: number;
    rentedProperties: number;
    averageRent: number;
    totalRevenue: number;
    byType: Record<PropertyType, number>;
    byLocation: Record<string, number>;
  }>;
}

// Property Schema
const propertySchema = new Schema<IProperty>(
  {
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: 'MicroestateUser',
      required: [true, 'Landlord ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        index: true,
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        default: 'India',
      }
    },
    propertyType: {
      type: String,
      enum: {
        values: ['apartment', 'house', 'villa', 'studio', 'penthouse', 'duplex', 'townhouse', 'condo'],
        message: 'Property type must be one of: apartment, house, villa, studio, penthouse, duplex, townhouse, condo',
      },
      required: [true, 'Property type is required'],
      index: true,
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative'],
      max: [20, 'Bedrooms cannot exceed 20'],
      index: true,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative'],
      max: [20, 'Bathrooms cannot exceed 20'],
      index: true,
    },
    squareFootage: {
      type: Number,
      min: [1, 'Square footage must be positive'],
      max: [200000, 'Square footage cannot exceed 200,000'],
    },
    rent: {
      amount: {
        type: Number,
        required: [true, 'Rent amount is required'],
        min: [0, 'Rent amount cannot be negative'],
        index: true,
      },
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'INR'],
        default: 'USD',
      },
      period: {
        type: String,
        enum: ['monthly', 'weekly', 'daily'],
        default: 'monthly',
      },
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative'],
    },
    amenities: {
      type: [String],
      validate: {
        validator: function(amenities: string[]) {
          return amenities.length <= 20;
        },
        message: 'Cannot have more than 20 amenities',
      },
    },
    features: {
      parking: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
      heating: { type: Boolean, default: false },
      internet: { type: Boolean, default: false },
      furnished: { type: Boolean, default: false },
      balcony: { type: Boolean, default: false },
      garden: { type: Boolean, default: false },
    },
    images: {
      type: [String],
      validate: {
        validator: function(images: string[]) {
          return images.every(image => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(image));
        },
        message: 'All images must be valid URLs',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'rented', 'maintenance', 'inactive'],
        message: 'Status must be one of: available, rented, maintenance, inactive',
      },
      default: 'available',
      index: true,
    },
    leaseTerms: {
      minimumTerm: {
        type: Number,
        default: 12,
        min: [1, 'Minimum term must be at least 1 month'],
      },
      maximumTerm: {
        type: Number,
        default: 12,
        min: [1, 'Maximum term must be at least 1 month'],
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
      maxOccupants: {
        type: Number,
        min: [1, 'Maximum occupants must be at least 1'],
      },
      depositRequired: {
        type: Boolean,
        default: true,
      },
    },
    utilities: {
      includedInRent: {
        type: [String],
        default: [],
      },
      tenantResponsible: {
        type: [String],
        default: [],
      },
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Instance Methods
propertySchema.methods.isAvailable = function(this: IProperty): boolean {
  return this.status === 'available' && (!this.availableFrom || this.availableFrom <= new Date());
};

propertySchema.methods.calculateMonthlyTotal = function(this: IProperty): number {
  let total = this.rent.amount;
  
  // Convert to monthly if needed
  if (this.rent.period === 'weekly') {
    total = total * 4.33; // Average weeks per month
  } else if (this.rent.period === 'daily') {
    total = total * 30; // Average days per month
  }
  
  return total;
};



propertySchema.methods.generateListingUrl = function(this: IProperty): string {
  const slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `/properties/${this._id}/${slug}`;
};

propertySchema.methods.isRecentlyUpdated = function(this: IProperty): boolean {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.lastUpdated > oneDayAgo;
};

// Indexes for performance
propertySchema.index({ landlordId: 1, status: 1 });

// Create the model - **THIS IS THE CRITICAL FIX**
// It ensures you are always using the same model definition and avoids OverwriteModelError.
// The model name in mongoose is 'MicroProperty', so we must check for it by that name.
const Property: IPropertyModel = 
  (mongoose.models.MicroProperty as IPropertyModel) || 
  mongoose.model<IProperty, IPropertyModel>('MicroProperty', propertySchema);

export default Property;

// Additional TypeScript types for API usage
// export interface CreatePropertyInput {
//   landlordId: string;
//   title: string;
//   description: string;
//   address: IAddress;
//   propertyType: PropertyType;
//   bedrooms: number;
//   bathrooms: number;
//   squareFootage?: number;
//   rent: IRentDetails;
//   securityDeposit: number;
//   amenities?: string[];
//   features?: Partial<IPropertyFeatures>;
//   images?: string[];
//   virtualTourUrl?: string;
//   leaseTerms?: Partial<ILeaseTerms>;
//   utilities?: Partial<IUtilities>;
//   availableFrom?: Date;
// }

// export interface UpdatePropertyInput {
//   title?: string;
//   description?: string;
//   address?: Partial<IAddress>;
//   propertyType?: PropertyType;
//   bedrooms?: number;
//   bathrooms?: number;
//   squareFootage?: number;
//   rent?: Partial<IRentDetails>;
//   securityDeposit?: number;
//   amenities?: string[];
//   features?: Partial<IPropertyFeatures>;
//   images?: string[];
//   virtualTourUrl?: string;
//   status?: PropertyStatus;
//   leaseTerms?: Partial<ILeaseTerms>;
//   utilities?: Partial<IUtilities>;
//   availableFrom?: Date;
// }

// export interface PropertySearchQuery {
//   city?: string;
//   state?: string;
//   propertyType?: PropertyType;
//   minPrice?: number;
//   maxPrice?: number;
//   bedrooms?: number;
//   bathrooms?: number;
//   minSquareFootage?: number;
//   maxSquareFootage?: number;
//   amenities?: string[];
//   features?: string[];
//   availableFrom?: Date;
//   sortBy?: 'price' | 'date' | 'size' | 'bedrooms';
//   sortOrder?: 'asc' | 'desc';
//   page?: number;
//   limit?: number;
// }

// export interface PropertyResponse {
//   _id: string;
//   landlordId: string;
//   title: string;
//   description: string;
//   address: IAddress;
//   propertyType: PropertyType;
//   bedrooms: number;
//   bathrooms: number;
//   squareFootage?: number;
//   rent: IRentDetails;
//   securityDeposit: number;
//   amenities: string[];
//   features: IPropertyFeatures;
//   images: string[];
//   virtualTourUrl?: string;
//   status: PropertyStatus;
//   leaseTerms: ILeaseTerms;
//   utilities: IUtilities;
//   availableFrom?: Date;
//   lastUpdated: Date;
//   viewCount: number;
//   favoriteCount: number;
//   createdAt: Date;
//   updatedAt: Date;
//   isAvailable: boolean;
//   monthlyTotal: number;
//   fullAddress: string;
//   listingUrl: string;
//   isRecentlyUpdated: boolean;
//   propertyAge: number;
// }

// export interface PropertyStats {
//   totalProperties: number;
//   availableProperties: number;
//   rentedProperties: number;
//   averageRent: number;
//   totalRevenue: number;
//   byType: Record<PropertyType, number>;
//   byLocation: Record<string, number>;
// }