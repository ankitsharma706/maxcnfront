import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMarketData extends Document {
  commodity: string;
  spotPrice: number;
  impliedVolatility: number;
  totalCallOI: number;
  totalPutOI: number;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const marketDataSchema = new Schema<IMarketData>(
  {
    commodity: {
      type: String,
      required: true,
      trim: true,
    },
    spotPrice: {
      type: Number,
      required: true,
    },
    impliedVolatility: {
      type: Number,
      required: true,
    },
    totalCallOI: {
      type: Number,
      default: 0,
    },
    totalPutOI: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

marketDataSchema.index({ commodity: 1, timestamp: -1 });

export const MarketData: Model<IMarketData> = mongoose.model<IMarketData>('MarketData', marketDataSchema);
