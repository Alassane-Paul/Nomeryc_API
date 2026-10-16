import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { verifyAuthHeader } from '../utils/jwt.utils';
import { UserRole } from '../enums/user.enum';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: UserRole;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendError(res, '20', 'Authentification requise (token manquant)');
    }

    const decoded = verifyAuthHeader(authHeader);
    if (!decoded) {
      return sendError(res, '22', 'Token expiré ou invalide');
    }

    if (decoded.type !== 'access_token') {
      return sendError(res, '22', 'Type de token invalide');
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role as UserRole,
    };

    next();
  } catch (error: any) {
    return sendError(res, '99', 'Erreur lors de la vérification du token', { details: error?.message });
  }
}

export function authorizationMiddleware(roles: UserRole[] = []) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, '20', 'Authentification requise');
    }

    if (roles.length > 0 && (!req.user.role || !roles.includes(req.user.role))) {
      return sendError(res, '23', 'Accès refusé (autorisation insuffisante)');
    }

    next();
  };
}
