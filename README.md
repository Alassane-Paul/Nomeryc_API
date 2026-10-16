# Nomeryc — Backend

API et serveur temps réel de Nomeryc, réalisés avec Node.js, Express, TypeScript, Sequelize et Socket.IO. Le backend fournit les données du site public ainsi que les services destinés aux espaces client et administration.

## Fonctionnalités

- API REST versionnée sous `/api/v1` : authentification, utilisateurs, projets, devis, factures, blog, portfolio, contacts, messages, équipe, témoignages, FAQ, tarifs, documents, notifications, tâches, statistiques, paiements, newsletter et téléversements.
- Authentification par jetons et routes protégées.
- Messagerie et notifications en temps réel avec Socket.IO; Redis peut être configuré pour le déploiement multi-instance.
- Envoi d'e-mails, génération de PDF et paiements Stripe et FedaPay.
- Stockage des fichiers sur disque local ou sur un stockage compatible S3.

## Prérequis

- Node.js 20 ou version ultérieure.
- npm.
- Une base MySQL si vous conservez la configuration MySQL fournie dans `.env.example`. SQLite est aussi disponible pour le développement local.

## Installation et démarrage

Depuis le dossier `Backend` :

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Pour créer `.env` dans un terminal Bash, utilisez `cp .env.example .env`. Avant le démarrage, configurez la base de données et les URL ci-dessous. Le serveur de développement démarre sur le port `5000` par défaut.

## Configuration

Le backend charge les variables depuis `.env`. Le fichier `.env.example` contient la liste des paramètres et des valeurs d'exemple; ne publiez jamais `.env` ni de vraies clés.

### Paramètres principaux

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Environnement d'exécution (`development`, `production` ou `test`). |
| `PORT` | Port HTTP du serveur (par défaut `5000`). |
| `DB_DIALECT` | Dialecte Sequelize. L'exemple fourni utilise `mysql`; `sqlite` est également pris en charge. |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Connexion MySQL. |
| `DB_STORAGE` | Chemin du fichier de base de données SQLite; utilisé avec `DB_DIALECT=sqlite`. |
| `JWT_SECRET`, `JWT_EXPIRATION` | Signature et durée de validité des jetons. Remplacez le secret d'exemple par une valeur forte en production. |
| `FRONTEND_URL`, `CORS_ORIGIN` | URL du frontend pour les redirections et l'accès CORS. En développement Vite, utilisez généralement `http://localhost:5173`. |
| `APP_URL` | URL publique du backend, utilisée notamment pour construire les liens de fichiers. |
| `UPLOAD_DIR`, `MAX_UPLOAD_SIZE_MB` | Dossier et taille maximale des fichiers téléversés. |

Pour utiliser SQLite en local, définissez par exemple dans `.env` :

```dotenv
DB_DIALECT=sqlite
DB_STORAGE=database.sqlite
```

### Services optionnels

- **E-mail** : renseignez `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` et `SMTP_FROM`.
- **Paiements** : configurez les clés et secrets de webhook Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) et/ou FedaPay (`FEDAPAY_SECRET_KEY`, `FEDAPAY_ENVIRONMENT`, `FEDAPAY_WEBHOOK_SECRET`).
- **Redis** : `REDIS_URL` est facultatif; sans cette valeur, Socket.IO utilise le stockage mémoire local.
- **Stockage S3** : passez `STORAGE_DRIVER` à `s3`, puis renseignez les paramètres `S3_*`. Le stockage local est le mode par défaut.

Les fonctions qui dépendent d'un service externe nécessitent ses identifiants correspondants. Les webhooks de paiement sont exposés sous `/api/v1/webhooks/stripe` et `/api/v1/webhooks/fedapay`.

## Commandes

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur TypeScript avec redémarrage automatique. |
| `npm run build` | Compile `src/` dans `dist/` avec TypeScript. |
| `npm start` | Démarre le serveur compilé (`dist/server.js`). |
| `npm run seed` | Réinitialise la base et crée les données initiales. |

**Attention :** `npm run seed` exécute une synchronisation Sequelize avec `force: true` et supprime les tables existantes avant de les recréer. Ne l'exécutez pas sur une base contenant des données à conserver. Le seed crée des comptes de démonstration dont les identifiants sont affichés dans le terminal; ils sont réservés au développement et doivent être changés ou supprimés avant toute mise en production.

## Vérification du serveur

- Vérification de santé : `GET http://localhost:5000/health`
- Point d'entrée API : `http://localhost:5000/api/v1`
- WebSocket : `http://localhost:5000`
- Fichiers locaux : `http://localhost:5000/uploads/`

L'origine autorisée par CORS doit correspondre à l'adresse exacte du frontend. En développement, Vite utilise généralement le port `5173`; en production, définissez les URL publiques de vos déploiements.

## Organisation du code

```text
src/
├── config/       # Environnement, base de données, Socket.IO et téléversements
├── database/     # Seed de développement
├── enums/        # Valeurs métier
├── middlewares/  # Authentification et gestion des erreurs
├── models/       # Modèles Sequelize et associations
├── modules/      # Contrôleurs, routes et services par domaine
├── routes/       # Assemblage des routes API
├── services/     # E-mail, notifications, PDF et paiements
├── utils/        # Réponses HTTP et utilitaires JWT
├── app.ts        # Configuration Express
└── server.ts     # Connexion à la base et démarrage HTTP/Socket.IO
```

En environnement `development`, le serveur synchronise les modèles avec `alter`. En production, prévoyez une stratégie de migration et une sauvegarde de la base avant toute mise à jour du schéma.
