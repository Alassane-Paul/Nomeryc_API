"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.createError = createError;
exports.asyncHandler = asyncHandler;
const env_1 = require("../config/env");
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode || 500;
    const responseCode = err.responseCode || '99';
    const message = err.message || 'Erreur serveur interne';
    if (env_1.env.NODE_ENV === 'development') {
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
        error: env_1.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString(),
    });
}
function createError(message, statusCode = 500, responseCode = '99') {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.responseCode = responseCode;
    error.isOperational = true;
    return error;
}
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
