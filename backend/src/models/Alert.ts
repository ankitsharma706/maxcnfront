import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  commodity: string;
  metric: 'Price' | 'IV' | 'PCR' | 'Gamma' | 'MaxPain';
  condition: 'ABOVE' | 'BELOW';
  threshold: number;
  isActive: boolean;
  alertTypes: ('Dashboard' | 'Email' | 'Push')[];
  lastTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commodity: {
      type: String,
      required: true,
    },
    metric: {
      type: String,
      enum: ['Price', 'IV', 'PCR', 'Gamma', 'MaxPain'],
      required: true,
    },
    condition: {
      type: String,
      enum: ['ABOVE', 'BELOW'],
      required: true,
    },
    threshold: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    alertTypes: {
      type: [String],
      enum: ['Dashboard', 'Email', 'Push'],
      default: ['Dashboard'],
    },
    lastTriggeredAt: {
      type: Date,
    }
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

alertSchema.index({ userId: 1, isActive: 1 });
alertSchema.index({ commodity: 1, metric: 1, isActive: 1 });

export const Alert: Model<IAlert> = mongoose.model<IAlert>('Alert', alertSchema);
