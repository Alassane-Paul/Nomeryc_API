import { Response } from 'express';
import { IApiResponse } from '../types';

export const RESPONSE_CODES: Record<string, { message: string; httpStatus: number; category: 'success' | 'error' }> = {
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

export function getResponseConfig(responseCode: string, customMessage?: string | null) {
  const config = RESPONSE_CODES[responseCode];
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

export function sendResponse<T = any>(
  res: Response,
  options: {
    responseCode?: string;
    responseMessage?: string | null;
    data?: T;
    httpStatus?: number | null;
  } = {}
) {
  const { responseCode = '00', responseMessage = null, data = [] as any, httpStatus = null } = options;
  const config = getResponseConfig(responseCode, responseMessage);
  const status = httpStatus || config.httpStatus;
  const message = responseMessage || config.message;

  const payload: IApiResponse<T> = {
    responseCode,
    responseMessage: message,
    data,
    timestamp: new Date().toISOString(),
  };

  return res.status(status).json(payload);
}

export function sendError(
  res: Response,
  responseCode = '99',
  customMessage?: string | null,
  errorDetails?: any
) {
  const config = getResponseConfig(responseCode, customMessage);
  const message = customMessage || config.message;

  const payload: IApiResponse = {
    responseCode,
    responseMessage: message,
    data: null,
    error: errorDetails || null,
    timestamp: new Date().toISOString(),
  };

  return res.status(config.httpStatus).json(payload);
}
