import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPrice extends Document {
  commodity: string;
  currentPrice: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  source: 'manual' | 'ocr' | 'api';
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const priceSchema = new Schema<IPrice>(
  {
    commodity: {
      type: String,
      required: [true, 'Commodity name is required'],
      trim: true,
      index: true,
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
      min: [0, 'Price cannot be negative'],
    },
    open: {
      type: Number,
      min: 0,
    },
    high: {
      type: Number,
      min: 0,
    },
    low: {
      type: Number,
      min: 0,
    },
    close: {
      type: Number,
      min: 0,
    },
    source: {
      type: String,
      enum: ['manual', 'ocr', 'api'],
      default: 'manual',
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

// Compound index for efficient commodity + time queries
priceSchema.index({ commodity: 1, timestamp: -1 });

export const Price: Model<IPrice> = mongoose.model<IPrice>('Price', priceSchema);
