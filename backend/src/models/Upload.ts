import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUpload extends Document {
  fileName: string;
  filePath: string;
  fileType: string;
  uploadType: 'chart' | 'option-chain' | 'csv';
  uploadedBy: mongoose.Types.ObjectId;
  processed: boolean;
  extractedData?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const uploadSchema = new Schema<IUpload>(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileType: {
      type: String,
      required: [true, 'File type is required'],
      enum: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    },
    uploadType: {
      type: String,
      required: [true, 'Upload type is required'],
      enum: ['chart', 'option-chain', 'csv'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader reference is required'],
    },
    processed: {
      type: Boolean,
      default: false,
    },
    extractedData: {
      type: Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: null,
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

// Index for finding unprocessed uploads
uploadSchema.index({ processed: 1, createdAt: -1 });
uploadSchema.index({ uploadedBy: 1, createdAt: -1 });

export const Upload: Model<IUpload> = mongoose.model<IUpload>('Upload', uploadSchema);
