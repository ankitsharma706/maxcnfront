import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from './utils/logger';
import { env } from './config/env';

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    // Allow clients to subscribe to specific commodities
    socket.on('subscribe', (commodity: string) => {
      socket.join(commodity);
      logger.info(`Client ${socket.id} subscribed to ${commodity}`);
    });

    socket.on('unsubscribe', (commodity: string) => {
      socket.leave(commodity);
      logger.info(`Client ${socket.id} unsubscribed from ${commodity}`);
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

export const broadcastMarketData = (commodity: string, data: any) => {
  if (io) io.to(commodity).emit('priceUpdate', data);
};

export const broadcastGreeksUpdate = (commodity: string, data: any) => {
  if (io) io.to(commodity).emit('greeksUpdate', data);
};

export const broadcastAnalyticsUpdate = (commodity: string, data: any) => {
  if (io) io.to(commodity).emit('analyticsUpdate', data);
};
