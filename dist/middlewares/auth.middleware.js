"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.authorizationMiddleware = authorizationMiddleware;
const response_1 = require("../utils/response");
const jwt_utils_1 = require("../utils/jwt.utils");
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return (0, response_1.sendError)(res, '20', 'Authentification requise (token manquant)');
        }
        const decoded = (0, jwt_utils_1.verifyAuthHeader)(authHeader);
        if (!decoded) {
            return (0, response_1.sendError)(res, '22', 'Token expiré ou invalide');
        }
        if (decoded.type !== 'access_token') {
            return (0, response_1.sendError)(res, '22', 'Type de token invalide');
        }
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        return (0, response_1.sendError)(res, '99', 'Erreur lors de la vérification du token', { details: error?.message });
    }
}
function authorizationMiddleware(roles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, response_1.sendError)(res, '20', 'Authentification requise');
        }
        if (roles.length > 0 && (!req.user.role || !roles.includes(req.user.role))) {
            return (0, response_1.sendError)(res, '23', 'Accès refusé (autorisation insuffisante)');
        }
        next();
    };
}
