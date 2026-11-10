"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESPONSE_CODES = void 0;
exports.getResponseConfig = getResponseConfig;
exports.sendResponse = sendResponse;
exports.sendError = sendError;
exports.RESPONSE_CODES = {
    // Succès (2xx)
    '00': { message: 'Opération réussie', httpStatus: 200, category: 'success' },
    '01': { message: 'Ressource créée avec succès', httpStatus: 201, category: 'success' },
    '02': { message: 'Ressource modifiée avec succès', httpStatus: 200, category: 'success' },
    '03': { message: 'Ressource supprimée avec succès', httpStatus: 200, category: 'success' },
    '04': { message: 'Données récupérées avec succès', httpStatus: 200, category: 'success' },
    // Erreurs de validation (4xx)
    '10': { message: 'Données invalides', httpStatus: 400, category: 'error' },
    '11': { message: 'Champ requis manquant', httpStatus: 400, category: 'error' },
    '12': { message: 'Format de données invalide', httpStatus: 400, category: 'error' },
    // Erreurs d'authentification/Autorisation
    '20': { message: 'Authentification requise', httpStatus: 401, category: 'error' },
    '21': { message: 'Identifiants invalides', httpStatus: 401, category: 'error' },
    '22': { message: 'Token expiré ou invalide', httpStatus: 401, category: 'error' },
    '23': { message: 'Accès refusé (autorisation insuffisante)', httpStatus: 403, category: 'error' },
    // Ressource non trouvée
    '30': { message: 'Ressource non trouvée', httpStatus: 404, category: 'error' },
    '31': { message: 'Utilisateur non trouvé', httpStatus: 404, category: 'error' },
    '32': { message: 'Projet non trouvé', httpStatus: 404, category: 'error' },
    '33': { message: 'Service non trouvé', httpStatus: 404, category: 'error' },
    // Conflits
    '40': { message: 'Ressource déjà existante', httpStatus: 409, category: 'error' },
    '41': { message: 'Email déjà utilisé', httpStatus: 409, category: 'error' },
    // Erreurs métier
    '50': { message: 'Statut non autorisé pour cette action', httpStatus: 422, category: 'error' },
    // Erreurs serveur
    '98': { message: 'Service temporairement indisponible', httpStatus: 503, category: 'error' },
    '99': { message: 'Erreur serveur interne', httpStatus: 500, category: 'error' },
};
function getResponseConfig(responseCode, customMessage) {
    const config = exports.RESPONSE_CODES[responseCode];
    if (!config) {
        return {
            message: customMessage || 'Réponse inconnue',
            httpStatus: 500,
        };
    }
    return {
        message: customMessage || config.message,
        httpStatus: config.httpStatus,
    };
}
function sendResponse(res, options = {}) {
    const { responseCode = '00', responseMessage = null, data = [], httpStatus = null } = options;
    const config = getResponseConfig(responseCode, responseMessage);
    const status = httpStatus || config.httpStatus;
    const message = responseMessage || config.message;
    const payload = {
        responseCode,
        responseMessage: message,
        data,
        timestamp: new Date().toISOString(),
    };
    return res.status(status).json(payload);
}
function sendError(res, responseCode = '99', customMessage, errorDetails) {
    const config = getResponseConfig(responseCode, customMessage);
    const message = customMessage || config.message;
    const payload = {
        responseCode,
        responseMessage: message,
        data: null,
        error: errorDetails || null,
        timestamp: new Date().toISOString(),
    };
    return res.status(config.httpStatus).json(payload);
}
