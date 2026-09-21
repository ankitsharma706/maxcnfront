import { Upload, IUpload } from '../models/Upload';
import { Types } from 'mongoose';

export class UploadRepository {
  /**
   * Create a new upload record.
   */
  async create(data: {
    fileName: string;
    filePath: string;
    fileType: string;
    uploadType: 'chart' | 'option-chain' | 'csv';
    uploadedBy: string;
  }): Promise<IUpload> {
    const upload = new Upload({
      ...data,
      uploadedBy: new Types.ObjectId(data.uploadedBy),
      processed: false,
    });
    return upload.save();
  }

  /**
   * Find upload by ID.
   */
  async findById(id: string): Promise<any | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Upload.findById(id).lean();
  }

  /**
   * Mark upload as processed with extracted data.
   */
  async markProcessed(
    id: string,
    extractedData: Record<string, any>
  ): Promise<IUpload | null> {
    return Upload.findByIdAndUpdate(
      id,
      {
        processed: true,
        extractedData,
      },
      { new: true }
    );
  }

  /**
   * Mark upload with error.
   */
  async markError(id: string, error: string): Promise<IUpload | null> {
    return Upload.findByIdAndUpdate(
      id,
      {
        processed: false,
        error,
      },
      { new: true }
    );
  }

  /**
   * Find unprocessed uploads.
   */
  async findUnprocessed(limit: number = 10): Promise<any[]> {
    return Upload.find({ processed: false, error: null })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();
  }

  /**
   * Get uploads by user with pagination.
   */
  async findByUser(
    userId: string,
    limit: number = 20,
    page: number = 1
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Upload.find({ uploadedBy: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Upload.countDocuments({ uploadedBy: new Types.ObjectId(userId) }),
    ]);

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
