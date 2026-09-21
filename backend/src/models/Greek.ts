import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IGreek extends Document {
  commodity: string;
  strike: number;
  expiry: Date;
  optionType: 'CALL' | 'PUT';
  spotPrice: number;
  iv: number;
  riskFreeRate: number;
  daysToExpiry: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  premium: number;
  lots?: number;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const greekSchema = new Schema<IGreek>(
  {
    commodity: {
      type: String,
      required: [true, 'Commodity is required'],
      trim: true,
    },
    strike: {
      type: Number,
      required: [true, 'Strike price is required'],
      min: [0, 'Strike must be positive'],
    },
    expiry: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    optionType: {
      type: String,
      required: [true, 'Option type is required'],
      enum: ['CALL', 'PUT'],
    },
    spotPrice: {
      type: Number,
      required: [true, 'Spot price is required'],
      min: [0, 'Spot price must be positive'],
    },
    iv: {
      type: Number,
      required: [true, 'Implied volatility is required'],
      min: [0, 'IV must be positive'],
    },
    riskFreeRate: {
      type: Number,
      required: true,
      default: 0.07,
    },
    daysToExpiry: {
      type: Number,
      required: true,
      min: [0, 'Days to expiry must be non-negative'],
    },
    delta: {
      type: Number,
      required: true,
    },
    gamma: {
      type: Number,
      required: true,
    },
    theta: {
      type: Number,
      required: true,
    },
    vega: {
      type: Number,
      required: true,
    },
    rho: {
      type: Number,
      required: true,
    },
    premium: {
      type: Number,
      required: true,
    },
    lots: {
      type: Number,
      default: 1,
      min: [1, 'Lots must be at least 1'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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

// Compound indexes for efficient queries
greekSchema.index({ commodity: 1, expiry: 1 });
greekSchema.index({ userId: 1, createdAt: -1 });
greekSchema.index({ commodity: 1, strike: 1, optionType: 1 });

export const Greek: Model<IGreek> = mongoose.model<IGreek>('Greek', greekSchema);
