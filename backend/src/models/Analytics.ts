import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAnalytics extends Document {
  commodity: string;
  expiry: Date;
  maxPain: number;
  pcr: number;
  gex: number;
  dex: number;
  ivSkew: {
    strikes: number[];
    callIVs: number[];
    putIVs: number[];
  };
  deltaExposure: {
    totalCallDelta: number;
    totalPutDelta: number;
    netDelta: number;
  };
  gammaExposure: {
    totalCallGamma: number;
    totalPutGamma: number;
    netGamma: number;
  };
  thetaDecay: {
    totalCallTheta: number;
    totalPutTheta: number;
    netTheta: number;
  };
  vegaExposure: {
    totalCallVega: number;
    totalPutVega: number;
    netVega: number;
  };
  calculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    commodity: {
      type: String,
      required: [true, 'Commodity is required'],
      trim: true,
    },
    expiry: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    maxPain: {
      type: Number,
      default: 0,
    },
    pcr: {
      type: Number,
      default: 0,
    },
    gex: {
      type: Number,
      default: 0,
    },
    dex: {
      type: Number,
      default: 0,
    },
    ivSkew: {
      strikes: [Number],
      callIVs: [Number],
      putIVs: [Number],
    },
    deltaExposure: {
      totalCallDelta: { type: Number, default: 0 },
      totalPutDelta: { type: Number, default: 0 },
      netDelta: { type: Number, default: 0 },
    },
    gammaExposure: {
      totalCallGamma: { type: Number, default: 0 },
      totalPutGamma: { type: Number, default: 0 },
      netGamma: { type: Number, default: 0 },
    },
    thetaDecay: {
      totalCallTheta: { type: Number, default: 0 },
      totalPutTheta: { type: Number, default: 0 },
      netTheta: { type: Number, default: 0 },
    },
    vegaExposure: {
      totalCallVega: { type: Number, default: 0 },
      totalPutVega: { type: Number, default: 0 },
      netVega: { type: Number, default: 0 },
    },
    calculatedAt: {
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

analyticsSchema.index({ commodity: 1, expiry: 1 });
analyticsSchema.index({ calculatedAt: -1 });

export const Analytics: Model<IAnalytics> = mongoose.model<IAnalytics>('Analytics', analyticsSchema);
