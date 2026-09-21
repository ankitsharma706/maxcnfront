import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const xssClean = require('xss-clean');
import path from 'path';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/auth.routes';
import greeksRoutes from './routes/greeks.routes';
import uploadRoutes from './routes/upload.routes';
import analyticsRoutes from './routes/analytics.routes';
import priceRoutes from './routes/price.routes';
import ladderRoutes from './routes/ladder.routes';
import insightsRoutes from './routes/insights.routes';
import alertsRoutes from './routes/alerts.routes';
import portfolioRoutes from './routes/portfolio.routes';

const app = express();

// ===========================================
// SECURITY MIDDLEWARE
// ===========================================

// Helmet: set various HTTP security headers
app.use(helmet());

// CORS: allow requests from the client origin
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Mongo Sanitize: prevent NoSQL injection
app.use(mongoSanitize());

// XSS Clean: sanitize user input
app.use(xssClean());

// ===========================================
// BODY PARSING & COMPRESSION
// ===========================================

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression: gzip responses
app.use(compression());

// ===========================================
// LOGGING
// ===========================================

// HTTP request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ===========================================
// STATIC FILES
// ===========================================

// Serve uploaded files (only in development)
if (env.NODE_ENV === 'development') {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
}

// ===========================================
// ROUTES
// ===========================================

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Commodity Greeks Pro API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/greeks', greeksRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/ladder', ladderRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/portfolio', portfolioRoutes);

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
