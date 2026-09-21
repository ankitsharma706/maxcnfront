import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IGreeksLadderRow {
  strike: number;
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface IGreeksLadder extends Document {
  commodity: string;
  currentSpotPrice: number;
  ladder: IGreeksLadderRow[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const greeksLadderRowSchema = new Schema<IGreeksLadderRow>(
  {
    strike: { type: Number, required: true },
    price: { type: Number, required: true },
    delta: { type: Number, required: true },
    gamma: { type: Number, required: true },
    theta: { type: Number, required: true },
    vega: { type: Number, required: true },
  },
  { _id: false }
);

const greeksLadderSchema = new Schema<IGreeksLadder>(
  {
    commodity: {
      type: String,
      required: true,
      trim: true,
    },
    currentSpotPrice: {
      type: Number,
      required: true,
    },
    ladder: {
      type: [greeksLadderRowSchema],
      default: [],
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

greeksLadderSchema.index({ commodity: 1, timestamp: -1 });

export const GreeksLadder: Model<IGreeksLadder> = mongoose.model<IGreeksLadder>('GreeksLadder', greeksLadderSchema);
