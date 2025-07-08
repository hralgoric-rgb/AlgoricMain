import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICommercialProperties extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: string;
  location: {
    city: string;
    state: string;
    addressLine?: string;
    pincode?: string;
  };
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  currentYield: number;
  predictedAppreciation: number;
  riskLevel: "Low" | "Medium" | "High";
  image: string;
  description: string;
  rentalIncome: number;
  occupancyRate: number;
  totalValue: number;
  features: string[];
  detailedDescription: string;
  keyTenants: string[];
  propertyManager: string;
  yearBuilt: number;
  totalArea: number;
  parkingSpaces: number;
  amenities: string[];
  financials: {
    grossIncome: number;
    operatingExpenses: number;
    netIncome: number;
    capRate: number;
    cashOnCashReturn: number;
  };
  marketAnalysis: {
    comparableProperties: number;
    marketGrowth: number;
    demandSupply: string;
    futureProjects: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const CommercialPropertySchema: Schema = new Schema<ICommercialProperties>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      addressLine: { type: String },
      pincode: { type: String },
    },
    totalShares: { type: Number, required: true },
    availableShares: { type: Number, required: true },
    pricePerShare: { type: Number, required: true },
    currentYield: { type: Number, required: true },
    predictedAppreciation: { type: Number, required: true },
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rentalIncome: { type: Number, required: true },
    occupancyRate: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    features: [{ type: String, required: true }],
    detailedDescription: { type: String, required: true },
    keyTenants: [{ type: String, required: true }],
    propertyManager: { type: String, required: true },
    yearBuilt: { type: Number, required: true },
    totalArea: { type: Number, required: true },
    parkingSpaces: { type: Number, required: true },
    amenities: [{ type: String, required: true }],
    financials: {
      grossIncome: { type: Number, required: true },
      operatingExpenses: { type: Number, required: true },
      netIncome: { type: Number, required: true },
      capRate: { type: Number, required: true },
      cashOnCashReturn: { type: Number, required: true },
    },
    marketAnalysis: {
      comparableProperties: { type: Number, required: true },
      marketGrowth: { type: Number, required: true },
      demandSupply: { type: String, required: true },
      futureProjects: [{ type: String, required: true }],
    },
  },
  { timestamps: true }
);

const CommercialProperties =
  models.CommercialProperty ||
  model<ICommercialProperties>("CommercialProperty", CommercialPropertySchema);

export default CommercialProperties;
