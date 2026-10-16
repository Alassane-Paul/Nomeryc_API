import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { initSocket } from './config/socket';
import { sequelize } from './config/database';
import { initModels } from './models/index';
import { env } from './config/env';

const PORT = env.PORT;

async function startServer() {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie.');

    // Initialisation des modèles et associations
    initModels(sequelize);
    console.log('✅ Modèles Sequelize initialisés.');

    // Synchronisation (en dev seulement, sans force en prod)
    if (env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Base de données synchronisée (alter mode).');
    } else {
      await sequelize.sync();
    }

    // Serveur HTTP + Socket.IO (temps réel)
    const httpServer = http.createServer(app);
    await initSocket(httpServer);
    console.log('✅ Socket.IO initialisé (temps réel actif).');

    // Démarrage du serveur
    httpServer.listen(PORT, () => {
      console.log(`\n🚀 Nomeryc API démarrée sur le port ${PORT}`);
      console.log(`   Environment : ${env.NODE_ENV}`);
      console.log(`   URL         : http://localhost:${PORT}`);
      console.log(`   Health      : http://localhost:${PORT}/health`);
      console.log(`   API v1      : http://localhost:${PORT}/api/v1`);
      console.log(`   WebSocket   : ws://localhost:${PORT}\n`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur :', error);
    process.exit(1);
  }
}

startServer();

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  console.log('🔴 Arrêt du serveur (SIGTERM)...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔴 Arrêt du serveur (SIGINT)...');
  await sequelize.close();
  process.exit(0);
});
