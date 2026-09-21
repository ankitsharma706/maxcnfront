import { Alert, IAlert } from '../models/Alert';
import { getIO } from '../socket';
import { logger } from '../utils/logger';

export const createAlert = async (data: Partial<IAlert>) => {
  const alert = new Alert(data);
  return alert.save();
};

export const getUserAlerts = async (userId: string) => {
  return Alert.find({ userId }).sort({ createdAt: -1 }).lean();
};

export const deleteAlert = async (id: string, userId: string) => {
  return Alert.findOneAndDelete({ _id: id, userId });
};

/**
 * Check metrics against active alerts and trigger if conditions are met.
 * This should ideally be called by the market simulator or whenever data updates.
 */
export const checkAlerts = async (
  commodity: string,
  metrics: { price?: number; iv?: number; pcr?: number; gamma?: number; maxPain?: number }
) => {
  try {
    const activeAlerts = await Alert.find({ commodity, isActive: true });

    for (const alert of activeAlerts) {
      let triggered = false;
      const value = metrics[alert.metric.toLowerCase() as keyof typeof metrics];

      if (value !== undefined) {
        if (alert.condition === 'ABOVE' && value > alert.threshold) {
          triggered = true;
        } else if (alert.condition === 'BELOW' && value < alert.threshold) {
          triggered = true;
        }
      }

      if (triggered) {
        // Debounce alert (e.g., don't trigger more than once per hour)
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (!alert.lastTriggeredAt || alert.lastTriggeredAt < hourAgo) {
          
          logger.info(`Alert Triggered: ${commodity} ${alert.metric} is ${alert.condition} ${alert.threshold}`);
          
          if (alert.alertTypes.includes('Dashboard')) {
            const io = getIO();
            // Emit to a room specific to the user
            io.to(`user_${alert.userId.toString()}`).emit('alertTriggered', {
              id: alert._id,
              message: `${commodity} ${alert.metric} crossed threshold of ${alert.threshold}. Current value: ${value}`
            });
          }

          if (alert.alertTypes.includes('Email')) {
            // TODO: Implement Email sending logic
            logger.info(`Sending Email Alert to user ${alert.userId}`);
          }

          alert.lastTriggeredAt = new Date();
          await alert.save();
        }
      }
    }
  } catch (error) {
    logger.error('Error checking alerts:', error);
  }
};
