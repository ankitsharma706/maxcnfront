import { Analytics, IAnalytics } from '../models/Analytics';
import { FilterQuery, Types } from 'mongoose';

export class AnalyticsRepository {
  /**
   * Create or update analytics for a commodity + expiry.
   */
  async upsert(data: Partial<IAnalytics>): Promise<IAnalytics> {
    const filter = {
      commodity: data.commodity,
      expiry: data.expiry,
    };

    const result = await Analytics.findOneAndUpdate(
      filter,
      { ...data, calculatedAt: new Date() },
      { upsert: true, new: true }
    );

    return result;
  }

  /**
   * Get latest analytics for a commodity.
   */
  async getLatest(commodity?: string): Promise<any> {
    if (commodity) {
      return Analytics.findOne({ commodity })
        .sort({ calculatedAt: -1 })
        .lean();
    }

    return Analytics.find()
      .sort({ calculatedAt: -1 })
      .limit(10)
      .lean();
  }

  /**
   * Get analytics history.
   */
  async getHistory(
    commodity: string,
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
      Analytics.find({ commodity })
        .sort({ calculatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Analytics.countDocuments({ commodity }),
    ]);

    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}
