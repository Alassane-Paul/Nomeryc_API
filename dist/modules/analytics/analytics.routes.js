"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard/dashboard.controller");
const public_stats_controller_1 = require("./public-stats/public-stats.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const user_enum_1 = require("../../enums/user.enum");
const analyticsRouter = (0, express_1.Router)();
// Public : chiffres clés réels affichés sur la page "À propos" du site vitrine.
analyticsRouter.get('/public-stats', public_stats_controller_1.getPublicStats);
analyticsRouter.use(auth_middleware_1.authMiddleware, (0, auth_middleware_1.authorizationMiddleware)([user_enum_1.UserRole.ADMIN]));
analyticsRouter.get('/dashboard', dashboard_controller_1.getDashboardAnalytics);
exports.default = analyticsRouter;
