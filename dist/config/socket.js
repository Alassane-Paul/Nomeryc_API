"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_ROOM = exports.userRoom = void 0;
exports.initSocket = initSocket;
exports.getIO = getIO;
exports.emitToUser = emitToUser;
exports.emitToAdmins = emitToAdmins;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const jwt_utils_1 = require("../utils/jwt.utils");
const user_enum_1 = require("../enums/user.enum");
const env_1 = require("./env");
let io = null;
/** Room personnelle d'un utilisateur. */
const userRoom = (userId) => `user:${userId}`;
exports.userRoom = userRoom;
/** Room commune à tous les admins connectés. */
exports.ADMIN_ROOM = 'admins';
/**
 * Branche l'adaptateur Redis si REDIS_URL est défini : indispensable dès que
 * l'API tourne en plusieurs instances (sinon un utilisateur connecté sur
 * l'instance A ne reçoit jamais les événements émis depuis l'instance B).
 * Sans REDIS_URL, Socket.IO reste en mémoire — parfait pour une seule instance.
 */
async function attachRedisAdapter(server) {
    if (!env_1.env.REDIS_URL) {
        console.log('ℹ️  REDIS_URL non défini : Socket.IO fonctionne en mémoire (une seule instance).');
        return;
    }
    try {
        const pubClient = (0, redis_1.createClient)({ url: env_1.env.REDIS_URL });
        const subClient = pubClient.duplicate();
        pubClient.on('error', (err) => console.error('[redis pub]', err.message));
        subClient.on('error', (err) => console.error('[redis sub]', err.message));
        await Promise.all([pubClient.connect(), subClient.connect()]);
        server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        console.log('✅ Adaptateur Redis Socket.IO connecté — prêt pour le multi-instance.');
    }
    catch (err) {
        console.error('⚠️  Connexion Redis échouée, Socket.IO reste en mémoire :', err?.message);
    }
}
async function initSocket(httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: env_1.env.CORS_ORIGIN,
            credentials: true,
            methods: ['GET', 'POST'],
        },
    });
    await attachRedisAdapter(io);
    // ===== AUTHENTIFICATION (handshake) =====
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token ||
            (socket.handshake.headers.authorization || '').replace('Bearer ', '');
        if (!token)
            return next(new Error('Authentification requise'));
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        if (!decoded || decoded.type !== 'access_token') {
            return next(new Error('Token invalide ou expiré'));
        }
        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
        next();
    });
    // ===== CONNEXION =====
    io.on('connection', (socket) => {
        socket.join((0, exports.userRoom)(socket.userId));
        if (socket.userRole === user_enum_1.UserRole.ADMIN) {
            socket.join(exports.ADMIN_ROOM);
        }
        if (env_1.env.NODE_ENV === 'development') {
            console.log(`🔌 Socket connecté : ${socket.userId} (${socket.userRole})`);
        }
        // Indicateur "en train d'écrire"
        socket.on('typing', (payload) => {
            if (socket.userRole === user_enum_1.UserRole.ADMIN && payload?.clientId) {
                socket.to((0, exports.userRoom)(payload.clientId)).emit('typing', { isTyping: payload.isTyping, from: 'admin' });
            }
            else {
                socket.to(exports.ADMIN_ROOM).emit('typing', { isTyping: payload?.isTyping, clientId: socket.userId });
            }
        });
        socket.on('disconnect', () => {
            if (env_1.env.NODE_ENV === 'development') {
                console.log(`🔌 Socket déconnecté : ${socket.userId}`);
            }
        });
    });
    return io;
}
function getIO() {
    return io;
}
/** Émet un événement vers un utilisateur précis. */
function emitToUser(userId, event, payload) {
    io?.to((0, exports.userRoom)(userId)).emit(event, payload);
}
/** Émet un événement vers tous les admins connectés. */
function emitToAdmins(event, payload) {
    io?.to(exports.ADMIN_ROOM).emit(event, payload);
}
