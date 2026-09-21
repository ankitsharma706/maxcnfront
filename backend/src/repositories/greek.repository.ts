import { Greek, IGreek } from '../models/Greek';
import { FilterQuery, Types } from 'mongoose';

export class GreekRepository {
  /**
   * Create a new Greek calculation record.
   */
  async create(data: Partial<IGreek>): Promise<IGreek> {
    const greek = new Greek(data);
    return greek.save();
  }

  /**
   * Find Greek by ID.
   */
  async findById(id: string): Promise<any | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Greek.findById(id).lean();
  }

  /**
   * Find Greeks by filters with pagination.
   */
  async findByFilters(
    filters: FilterQuery<IGreek>,
    options: { limit?: number; page?: number; sort?: Record<string, 1 | -1> } = {}
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const limit = options.limit || 20;
    const page = options.page || 1;
    const skip = (page - 1) * limit;
    const sort = options.sort || { createdAt: -1 };

    const [data, total] = await Promise.all([
      Greek.find(filters).sort(sort).skip(skip).limit(limit).lean(),
      Greek.countDocuments(filters),
    ]);

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get history for a specific user.
   */
  async getHistory(
    userId: string,
    limit: number = 20,
    page: number = 1
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    return this.findByFilters({ userId }, { limit, page, sort: { createdAt: -1 } });
  }

  /**
   * Delete a Greek record by ID.
   */
  async deleteById(id: string): Promise<IGreek | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Greek.findByIdAndDelete(id);
  }

  /**
   * Get Greeks by commodity and expiry.
   */
  async findByCommodityAndExpiry(
    commodity: string,
    expiry?: Date
  ): Promise<any[]> {
    const filter: FilterQuery<IGreek> = { commodity };
    if (expiry) {
      filter.expiry = expiry;
    }
    return Greek.find(filter).sort({ strike: 1 }).lean();
  }

  /**
   * Get the most recent Greeks calculations.
   */
  async getRecent(limit: number = 10): Promise<any[]> {
    return Greek.find().sort({ createdAt: -1 }).limit(limit).lean();
  }

  /**
   * Delete all Greeks for a user.
   */
  async deleteByUserId(userId: string): Promise<number> {
    const result = await Greek.deleteMany({ userId });
    return result.deletedCount;
  }
}
