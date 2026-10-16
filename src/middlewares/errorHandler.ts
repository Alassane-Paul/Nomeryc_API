import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  responseCode?: string;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const responseCode = err.responseCode || '99';
  const message = err.message || 'Erreur serveur interne';

  if (env.NODE_ENV === 'development') {
    console.error('[ERROR]', {
      message: err.message,
      stack: err.stack,
      statusCode,
      responseCode,
    });
  }

  res.status(statusCode).json({
    responseCode,
    responseMessage: message,
    data: null,
    error: env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });
}

export function createError(message: string, statusCode = 500, responseCode = '99'): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.responseCode = responseCode;
  error.isOperational = true;
  return error;
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
