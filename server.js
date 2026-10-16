require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = Number(process.env.PORT || 3000);

function startListening(port) {
  const server = app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} déjà utilisé, tentative sur le port ${port + 1}...`);
      server.close(() => startListening(port + 1));
    } else {
      console.error("Erreur d'écoute du serveur :", error);
    };
  });

  return server;
}

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de donnée réussie.');

    await sequelize.sync({ alter: false });
    console.log('Modèles synchronisés.');

    startListening(PORT);
  } catch (err) {
    console.error('Erreur au démarrage :', err);
  }
}

startServer();