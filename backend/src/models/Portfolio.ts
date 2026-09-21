import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPortfolioItem {
  commodity: string;
  strike: number;
  optionType: 'CALL' | 'PUT';
  premium: number;
  lots: number;
  entryDate: Date;
}

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  items: IPortfolioItem[];
  createdAt: Date;
  updatedAt: Date;
}

const portfolioItemSchema = new Schema<IPortfolioItem>({
  commodity: { type: String, required: true },
  strike: { type: Number, required: true },
  optionType: { type: String, enum: ['CALL', 'PUT'], required: true },
  premium: { type: Number, required: true },
  lots: { type: Number, required: true, default: 1 },
  entryDate: { type: Date, default: Date.now }
});

const portfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, default: 'My Portfolio' },
    items: [portfolioItemSchema],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: any) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Portfolio: Model<IPortfolio> = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
