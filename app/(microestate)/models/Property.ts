import mongoose, { Schema, models, Document, Types } from 'mongoose';


export interface IProperty extends Document {
  landlordId: Types.ObjectId;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio';
  bedrooms: number;
  bathrooms: number;
  squareFootage?: number;
  rent: {
    amount: number;
    currency?: string;
  };
  securityDeposit: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  leaseTerms: {
    minimumTerm: number;
    maximumTerm: number;
    petsAllowed: boolean;
    smokingAllowed: boolean;
  };
  utilities: {
    includedInRent: string[];
    tenantResponsible: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}


const propertySchema = new Schema<IProperty>({
  landlordId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'townhouse', 'studio'],
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  squareFootage: Number,
  rent: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  amenities: [String],
  images: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  leaseTerms: {
    minimumTerm: { type: Number, default: 12 },
    maximumTerm: { type: Number, default: 12 },
    petsAllowed: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false }
  },
  utilities: {
    includedInRent: [String],
    tenantResponsible: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


const Property = models.Property || mongoose.model<IProperty>('Property', propertySchema);

export default Property;
