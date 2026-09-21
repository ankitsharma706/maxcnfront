import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInsight extends Document {
  commodity: string;
  type: 'Highest Gamma Strike' | 'Highest Vega Strike' | 'ATM Strike' | 'ITM Strikes' | 'OTM Strikes' | 'Support Zone' | 'Resistance Zone' | 'Max Pain' | 'PCR Signal';
  value: string;
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
}

const insightSchema = new Schema<IInsight>(
  {
    commodity: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Highest Gamma Strike', 'Highest Vega Strike', 'ATM Strike', 'ITM Strikes', 'OTM Strikes', 'Support Zone', 'Resistance Zone', 'Max Pain', 'PCR Signal'],
    },
    value: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
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

insightSchema.index({ commodity: 1, createdAt: -1 });

export const Insight: Model<IInsight> = mongoose.model<IInsight>('Insight', insightSchema);
