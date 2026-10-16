import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import router from './routes/index';
import { errorHandler } from './middlewares/errorHandler';
import { UPLOAD_DIR } from './config/upload';
import { stripeWebhook, fedapayWebhook } from './modules/webhooks/webhooks.controller';

const app: Application = express();

// ========== SÉCURITÉ ==========
// crossOriginResourcePolicy assoupli : le front (autre origine) doit pouvoir
// afficher les fichiers servis depuis /uploads.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { responseCode: '98', responseMessage: 'Trop de requêtes, réessayez plus tard.' },
});
app.use(globalLimiter);

// ========== CORS ==========
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
  })
);

// ========== WEBHOOKS (corps brut requis AVANT le parseur JSON global pour la vérification de signature) ==========
app.post('/api/v1/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
app.post('/api/v1/webhooks/fedapay', express.raw({ type: 'application/json' }), fedapayWebhook);

// ========== PARSING ==========
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== FICHIERS STATIQUES (uploads) ==========
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', index: false }));

// ========== LOGGING ==========
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ========== HEALTH CHECK ==========
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'Nomeryc API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ========== ROUTES API ==========
app.use('/api/v1', router);

// ========== 404 HANDLER ==========
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    responseCode: '30',
    responseMessage: 'Route non trouvée',
    data: null,
    timestamp: new Date().toISOString(),
  });
});

// ========== ERROR HANDLER ==========
app.use(errorHandler);

export default app;
