import { Alert } from '../models/Alert';
import { MarketData } from '../models/MarketData';
import { logger } from '../utils/logger';

export class AlertEngine {
  public static async evaluateAlerts(commodity: string) {
    const marketData = await MarketData.findOne({ commodity }).sort({ timestamp: -1 });
    if (!marketData) return;

    const activeAlerts = await Alert.find({ commodity, isActive: true });

    for (const alert of activeAlerts) {
      let triggered = false;

      if (alert.metric === 'Price') {
        if (alert.condition === 'ABOVE' && marketData.spotPrice > alert.threshold) triggered = true;
        if (alert.condition === 'BELOW' && marketData.spotPrice < alert.threshold) triggered = true;
      }
      // Add similar logic for IV, PCR, Gamma

      if (triggered) {
        logger.info(`Alert triggered for User ${alert.userId}: ${alert.metric} ${alert.condition} ${alert.threshold}`);
        
        // Mark as triggered recently so we don't spam
        alert.lastTriggeredAt = new Date();
        await alert.save();
        
        // Here you would dispatch Email/Push via standard providers (SendGrid/FCM)
        // Dashboard alerts are inherently handled if the frontend polls or listens to a websocket event
      }
    }
  }
}
