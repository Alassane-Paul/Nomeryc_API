"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./config/socket");
const database_1 = require("./config/database");
const index_1 = require("./models/index");
const env_1 = require("./config/env");
const PORT = env_1.env.PORT;
async function startServer() {
    try {
        // Connexion à la base de données
        await database_1.sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie.');
        // Initialisation des modèles et associations
        (0, index_1.initModels)(database_1.sequelize);
        console.log('✅ Modèles Sequelize initialisés.');
        // Synchronisation (en dev seulement, sans force en prod)
        if (env_1.env.NODE_ENV === 'development') {
            await database_1.sequelize.sync({ alter: true });
            console.log('✅ Base de données synchronisée (alter mode).');
        }
        else {
            await database_1.sequelize.sync();
        }
        // Serveur HTTP + Socket.IO (temps réel)
        const httpServer = http_1.default.createServer(app_1.default);
        await (0, socket_1.initSocket)(httpServer);
        console.log('✅ Socket.IO initialisé (temps réel actif).');
        // Démarrage du serveur
        httpServer.listen(PORT, () => {
            console.log(`\n🚀 Nomeryc API démarrée sur le port ${PORT}`);
            console.log(`   Environment : ${env_1.env.NODE_ENV}`);
            console.log(`   URL         : http://localhost:${PORT}`);
            console.log(`   Health      : http://localhost:${PORT}/health`);
            console.log(`   API v1      : http://localhost:${PORT}/api/v1`);
            console.log(`   WebSocket   : ws://localhost:${PORT}\n`);
        });
    }
    catch (error) {
        console.error('❌ Erreur au démarrage du serveur :', error);
        process.exit(1);
    }
}
startServer();
// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
    console.log('🔴 Arrêt du serveur (SIGTERM)...');
    await database_1.sequelize.close();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('🔴 Arrêt du serveur (SIGINT)...');
    await database_1.sequelize.close();
    process.exit(0);
});
