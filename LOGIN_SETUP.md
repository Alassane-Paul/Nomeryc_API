# Système de Connexion Sécurisé - Documentation

## 🎯 Vue d'ensemble

Ce système implémente une connexion (login) complète et sécurisée avec :
- ✅ Validation des données robuste
- ✅ Vérification des identifiants
- ✅ Comparaison sécurisée des mots de passe (bcrypt)
- ✅ Génération des tokens JWT
- ✅ Middleware d'authentification
- ✅ Messages d'erreur génériques (pas de fuite d'info)

---

## 📦 Fichiers modifiés

| Fichier | Description |
|---------|-------------|
| `src/utils/validator.js` | Ajout de `validateLoginData()` |
| `src/modules/authentication/login/login.service.js` | Service de login complet |
| `src/modules/authentication/login/login.controller.js` | Contrôleur avec validation |
| `src/middlewares/auth.middleware.js` | Middleware d'authentification JWT |

---

## 🔐 Flux de connexion

```
1. Client envoie email + password
   ↓
2. Contrôleur reçoit la requête
   ↓
3. Validateur vérifie les données
   ↓
4. Service recherche l'utilisateur
   ↓
5. Comparaison des mots de passe (bcrypt)
   ↓
6. Génération des tokens JWT
   ↓
7. Réponse avec tokens
```

---

## 📡 Requête de connexion

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### ✅ Réponse réussie (200)

```json
{
  "responseCode": "00",
  "responseMessage": "Opération réussie",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+33612345678",
      "role": "CLIENT",
      "avatar": "https://example.com/avatar.jpg",
      "company": "MyCompany"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "timestamp": "2026-08-20T10:30:00.000Z"
}
```

### ❌ Erreur - Données invalides (400)

```json
{
  "responseCode": "10",
  "responseMessage": "Erreurs de validation détectées",
  "data": null,
  "error": {
    "validationErrors": [
      {
        "field": "email",
        "message": "Email invalide"
      }
    ]
  },
  "timestamp": "2026-08-20T10:30:00.000Z"
}
```

### ❌ Erreur - Identifiants invalides (401)

```json
{
  "responseCode": "21",
  "responseMessage": "Email ou mot de passe incorrect",
  "data": null,
  "error": null,
  "timestamp": "2026-08-20T10:30:00.000Z"
}
```

### ❌ Erreur - Compte désactivé (422)

```json
{
  "responseCode": "50",
  "responseMessage": "Ce compte est désactivé. Contactez le support.",
  "data": null,
  "error": null,
  "timestamp": "2026-08-20T10:30:00.000Z"
}
```

---

## 🔒 Validations implémentées

### Email
- Format valide (regex)
- Converti en minuscules

### Mot de passe
- Obligatoire
- Minimum 8 caractères
- 1 majuscule requis
- 1 minuscule requis
- 1 chiffre requis
- 1 caractère spécial (@$!%*?&)

### Sécurité
- Détection injections SQL/XSS
- Comparaison bcrypt du mot de passe
- Messages d'erreur génériques (pas de révélation si email existe ou pas)
- Vérification du statut du compte

---

## 🛡️ Middleware d'authentification

### Utilisation dans les routes

```javascript
const { authMiddleware, authorizationMiddleware } = require('../middlewares/auth.middleware');

// Route protégée - Authentification requise
router.get('/api/profile', authMiddleware, profileController);

// Route protégée - Admin seulement
router.delete('/api/users/:id', 
    authMiddleware, 
    authorizationMiddleware(['ADMIN']), 
    deleteUserController
);
```

### Header d'authentification

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Accès à l'utilisateur dans le contrôleur

```javascript
async function profileController(req, res) {
    const userId = req.user.id;        // ID de l'utilisateur
    const userEmail = req.user.email;  // Email
    const userRole = req.user.role;    // Rôle (ADMIN, CLIENT, etc.)
    
    // ... logique ...
}
```

---

## 🔄 Tokens JWT

### Access Token
- **Durée** : 7 jours
- **Utilisation** : Accès aux ressources protégées
- **Type** : `access_token`
- **Payload** : `{ userId, email, role, type, iat, exp }`

### Refresh Token
- **Durée** : 30 jours
- **Utilisation** : Renouvellement de l'access token
- **Type** : `refresh_token`
- **Payload** : `{ userId, type, iat, exp }`

### Exemple d'utilisation du refresh token

```javascript
// Créer une route POST /api/auth/refresh
async function refreshController(req, res) {
    const { refreshToken } = req.body;
    const decoded = verifyToken(refreshToken);
    
    if (!decoded || decoded.type !== 'refresh_token') {
        return sendError(res, '22', 'Token invalide');
    }
    
    const newAccessToken = generateAccessToken(userId, email, role);
    return sendResponse(res, {
        responseCode: '00',
        data: { accessToken: newAccessToken }
    });
}
```

---

## 📋 Codes de réponse

| Code | Message | Statut |
|------|---------|--------|
| `00` | Opération réussie | 200 |
| `10` | Données invalides | 400 |
| `20` | Authentification requise | 401 |
| `21` | Identifiants invalides | 401 |
| `22` | Token expiré ou invalide | 401 |
| `23` | Accès refusé | 403 |
| `31` | Utilisateur non trouvé | 404 |
| `50` | Statut non autorisé | 422 |
| `99` | Erreur serveur | 500 |

---

## 🧪 Tests avec Postman

### 1. Test de connexion réussie

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Réponse** : Tokens JWT dans `data.tokens`

### 2. Test d'authentification avec token

```
GET http://localhost:5000/api/profile
Authorization: Bearer [accessToken]
```

**Réponse** : Profil utilisateur ou erreur 401

### 3. Test avec token expiré

```
GET http://localhost:5000/api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzM0MDAwMDB9...
```

**Réponse** : Code 22 - Token expiré

---

## 🔧 Configuration nécessaire

### Variables .env

```env
JWT_SECRET=votre-clé-secrète-très-sécurisée
NODE_ENV=development
PORT=5000
```

### Modèle User (champs optionnels)

Si vous voulez tracker la dernière connexion, ajouter au modèle :

```javascript
lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
}
```

---

## ⚠️ Sécurité - Bonnes pratiques

✅ **Fait :**
- Mots de passe hashés avec bcrypt
- Validation robuste des données
- Messages d'erreur génériques
- Tokens JWT avec expiration
- Middleware d'authentification
- Gestion des rôles/permissions

🔄 **À ajouter :**
- Rate limiting sur `/login`
- Blacklist de tokens révoqués
- Logs des tentatives de connexion
- 2FA (authentification à deux facteurs)
- Refresh token rotation
- CORS approprié

---

## 🐛 Troubleshooting

### Erreur "JWT_SECRET not defined"
- Vérifier que `.env` contient `JWT_SECRET`
- Redémarrer le serveur

### Token rejeté avec "invalid token"
- Vérifier que le header est `Authorization: Bearer <token>`
- Vérifier l'expiration du token
- Vérifier que `JWT_SECRET` est identique partout

### Erreur "email ou password incorrect" même avec bons identifiants
- Vérifier que le mot de passe respecte les critères
- Vérifier que l'email existe en base de données
- Vérifier que le compte n'est pas désactivé

### Middleware d'auth non appliqué
- Importer correctement le middleware
- L'appliquer AVANT le contrôleur dans la route
- Vérifier le chemin du middleware

---

## 📚 Ressources

- JWT : https://jwt.io
- Bcrypt : https://github.com/kelektiv/node.bcrypt.js
- HTTP Status Codes : https://httpwg.org/specs/rfc7231.html
- OWASP Authentication : https://owasp.org/www-project-authentication-cheat-sheet/
