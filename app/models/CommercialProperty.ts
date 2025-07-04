import mongoose, { Schema, Document, Types } from "mongoose";
import { CommercialProperty as CommercialPropertyType } from "../data/commercialProperties";

export interface ICommercialProperty
  extends Omit<CommercialPropertyType, "_id">,
    Document {}

const CommercialPropertySchema = new Schema<ICommercialProperty>(
  {
    title: String,
    description: String,
    location: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: [Number],
    },
    images: [String],
    propertyType: {
      type: String,
      enum: ["Office", "Retail", "Warehouse", "Mixed Use", "Industrial"],
    },
    totalArea: Number,
    builtYear: Number,
    developer: {
      name: String,
      rating: Number,
      projectsCompleted: Number,
    },
    totalPropertyValue: Number,
    totalShares: Number,
    availableShares: Number,
    pricePerShare: Number,
    minInvestment: Number,
    currentROI: Number,
    rentalYield: Number,
    appreciationRate: Number,
    currentOccupancy: Number,
    monthlyRental: Number,
    spvId: String,
    spvName: String,
    status: {
      type: String,
      enum: ["active", "sold_out", "coming_soon"],
    },
    featured: Boolean,
    amenities: [String],
    nearbyLandmarks: [String],
    documents: [
      {
        name: String,
        url: String,
        type: {
          type: String,
          enum: ["legal", "financial", "technical"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CommercialProperty ||
  mongoose.model<ICommercialProperty>(
    "CommercialProperty",
    CommercialPropertySchema
  );
