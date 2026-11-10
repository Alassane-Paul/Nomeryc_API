"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
exports.verifyAuthHeader = verifyAuthHeader;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'nomeryc-super-secure-jwt-secret-key-2026';
function generateToken(payload, expiresIn = '7d') {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: expiresIn, algorithm: 'HS256' });
}
function generateAccessToken(userId, email, role) {
    return generateToken({
        type: 'access_token',
        userId,
        email,
        role,
    }, '7d');
}
function generateRefreshToken(userId) {
    return generateToken({
        type: 'refresh_token',
        userId,
    }, '30d');
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
        return decoded;
    }
    catch (error) {
        return null;
    }
}
function verifyAuthHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7);
    return verifyToken(token);
}
