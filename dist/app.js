"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const index_1 = __importDefault(require("./routes/index"));
const errorHandler_1 = require("./middlewares/errorHandler");
const upload_1 = require("./config/upload");
const webhooks_controller_1 = require("./modules/webhooks/webhooks.controller");
const app = (0, express_1.default)();
// ========== SÉCURITÉ ==========
// crossOriginResourcePolicy assoupli : le front (autre origine) doit pouvoir
// afficher les fichiers servis depuis /uploads.
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// Rate limiting global
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { responseCode: '98', responseMessage: 'Trop de requêtes, réessayez plus tard.' },
});
app.use(globalLimiter);
// ========== CORS ==========
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-refresh-token'],
}));
// ========== WEBHOOKS (corps brut requis AVANT le parseur JSON global pour la vérification de signature) ==========
app.post('/api/v1/webhooks/stripe', express_1.default.raw({ type: 'application/json' }), webhooks_controller_1.stripeWebhook);
app.post('/api/v1/webhooks/fedapay', express_1.default.raw({ type: 'application/json' }), webhooks_controller_1.fedapayWebhook);
// ========== PARSING ==========
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// ========== FICHIERS STATIQUES (uploads) ==========
app.use('/uploads', express_1.default.static(upload_1.UPLOAD_DIR, { maxAge: '7d', index: false }));
// ========== LOGGING ==========
if (env_1.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('dev'));
}
// ========== HEALTH CHECK ==========
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        service: 'Nomeryc API',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
// ========== ROUTES API ==========
app.use('/api/v1', index_1.default);
// ========== 404 HANDLER ==========
app.use((_req, res) => {
    res.status(404).json({
        responseCode: '30',
        responseMessage: 'Route non trouvée',
        data: null,
        timestamp: new Date().toISOString(),
    });
});
// ========== ERROR HANDLER ==========
app.use(errorHandler_1.errorHandler);
exports.default = app;
