import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';
import { initSocket } from './socket';
import { startMarketSimulator, stopMarketSimulator } from './services/marketSimulator';

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║     🏛️  Commodity Greeks Pro API                  ║
║                                                  ║
║     Server:  http://localhost:${env.PORT}             ║
║     Mode:    ${env.NODE_ENV.padEnd(33)}║
║     MongoDB: Connected                           ║
║                                                  ║
╚══════════════════════════════════════════════════╝
      `);
    });

    // Initialize WebSockets and Simulator
    initSocket(server);
    startMarketSimulator();

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        stopMarketSimulator();
        await disconnectDB();
        logger.info('All connections closed. Exiting.');

        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection:', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
