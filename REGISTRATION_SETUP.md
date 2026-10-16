# Système d'Enregistrement Sécurisé - Documentation

## 🎯 Vue d'ensemble

Ce système implémente un processus d'enregistrement complet et sécurisé avec :
- ✅ Validation des données robuste
- ✅ Détection des injections malveillantes
- ✅ Hash sécurisé des mots de passe
- ✅ Tokens JWT pour l'authentification
- ✅ Envoi d'emails de vérification
- ✅ Messages d'erreur dynamiques

---

## 📦 Dépendances requises

```bash
npm install bcryptjs jsonwebtoken nodemailer
```

**Versions recommandées :**
- `bcryptjs@^2.4.3` - Hash sécurisé des mots de passe
- `jsonwebtoken@^9.0.0` - Tokens JWT
- `nodemailer@^6.9.0` - Envoi d'emails
- `dotenv@^16.0.0` - Variables d'environnement

---

## 🔧 Configuration

### 1. Variables d'environnement (.env)

Copier `.env.example` vers `.env` et compléter :

```env
# JWT
JWT_SECRET=votre-clé-secrète-très-sécurisée

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=mot-de-passe-app-google

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 2. Configuration Gmail (recommandé)

1. Activer l'authentification 2FA
2. Générer un "App Password" : https://myaccount.google.com/apppasswords
3. Utiliser ce mot de passe dans `SMTP_PASSWORD`

### 3. Ajouter les champs au modèle User (si nécessaire)

Si votre modèle User n'a pas ces champs, les ajouter :

```javascript
emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
},
isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
}
```

---

## 📋 Fichiers créés/modifiés
--
| Fichier | Description |
|---------|-------------|
| `src/utils/response.js` | Gestion des réponses dynamiques par code |
| `src/utils/validator.js` | Validation sécurisée des données |
| `src/utils/jwt.utils.js` | Génération et vérification des tokens JWT |
| `src/utils/email.utils.js` | Envoi d'emails avec templates HTML |
| `src/modules/authentication/registration/regist.controller.js` | Contrôleur d'enregistrement |
| `src/modules/authentication/registration/regist.service.js` | Logique métier d'enregistrement |
| `.env.example` | Modèle de variables d'environnement |

---

## 🔐 Codes de réponse

### ✅ Succès
- `00` - Opération réussie (200)
- `01` - Ressource créée (201)

### ⚠️ Validation (400)
- `10` - Données invalides
- `11` - Champs manquants
- `12` - Format invalide

### 🔒 Authentification (401-403)
- `20` - Authentification requise
- `23` - Accès refusé

### ❌ Erreurs (4xx-5xx)
- `41` - Email déjà utilisé (409)
- `40` - Ressource existante (409)
- `99` - Erreur serveur (500)

---

## 📡 Flux d'utilisation

### Requête d'enregistrement

```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+33612345678",
  "company": "MyCompany",
  "avatar": "https://example.com/avatar.jpg",
  "role": "CLIENT"
}
```

### Réponse réussie (201)

```json
{
  "responseCode": "01",
  "responseMessage": "Ressource créée avec succès",
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
    },
    "message": "Utilisateur créé avec succès. Email de vérification envoyé."
  },
  "timestamp": "2026-08-20T10:30:00.000Z"
}
```

### Réponse erreur - Validation échouée (400)

```json
{
  "responseCode": "10",
  "responseMessage": "Erreurs de validation détectées",
  "data": null,
  "error": {
    "validationErrors": [
      {
        "field": "password",
        "message": "Mot de passe faible. Minimum 8 caractères: 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial (@$!%*?&)"
      },
      {
        "field": "email",
        "message": "Email invalide"
      }
    ]
  },
  "timestamp": "2026-08-20T10:30:00.000Z"
}
```

### Réponse erreur - Email déjà utilisé (409)

```json
{
  "responseCode": "41",
  "responseMessage": "Cet email est déjà utilisé",
  "data": null,
  "error": null,
  "timestamp": "2026-08-20T10:30:00.000Z"
}
```

---

## 🔍 Validations implémentées

### Email
- Format valide (regex)
- Unique en base de données
- Converti en minuscules

### Mot de passe
- Minimum 8 caractères
- 1 majuscule requis
- 1 minuscule requis
- 1 chiffre requis
- 1 caractère spécial (@$!%*?&)

### Nom (firstName, lastName)
- 2-50 caractères
- Lettres, accents, tirets et apostrophes uniquement

### Téléphone
- Format international accepté
- Validation avec regex

### Sécurité
- Détection injections SQL
- Détection injections XSS
- Détection du code malveillant
- Trim des espaces
- Email lowercase

---

## 🚀 Points d'extension

### Ajouter un nouveau code de réponse

Dans `src/utils/response.js` :

```javascript
'60': {
    message: 'Mon message personnalisé',
    httpStatus: 422,
    category: 'error'
}
```

### Ajouter une validation personnalisée

Dans `src/utils/validator.js` :

```javascript
function validateCustomField(value) {
    if (!value) return null;
    
    if (/* votre condition */) {
        return {
            isValid: false,
            error: {
                field: 'fieldName',
                message: 'Erreur personnalisée'
            }
        };
    }
    
    return { isValid: true, value };
}
```

### Intégrer un autre service d'email

Dans `src/utils/email.utils.js`, remplacer le transporteur Nodemailer :

```javascript
// Exemple avec SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

---

## 🧪 Test avec Postman

1. Créer une nouvelle requête POST
2. URL : `http://localhost:5000/api/auth/register`
3. Body (JSON) :
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "TestPass123!",
  "phone": "+33612345678"
}
```

---

## 📝 Checklist avant production

- [ ] Changer `JWT_SECRET` par une clé forte
- [ ] Configurer `SMTP_USER` et `SMTP_PASSWORD` (Gmail, SendGrid, etc.)
- [ ] Définir `FRONTEND_URL` correctement
- [ ] Configurer `NODE_ENV=production`
- [ ] Ajouter HTTPS en production
- [ ] Implémenter le rate limiting
- [ ] Ajouter logging complet
- [ ] Tester tous les cas d'erreur
- [ ] Configurer CORS correctement
- [ ] Ajouter un middleware d'authentification

---

## 🐛 Troubleshooting

### Erreur "SMTP" au démarrage
- Vérifier les variables `SMTP_*`
- Tester la connexion avec `testConnection()` dans `email.utils.js`

### Tokens non reconnus
- Vérifier `JWT_SECRET` identique partout
- Vérifier l'expiration du token

### Emails non reçus
- Vérifier le dossier spam
- Tester avec `sendEmail()` directement

---

## 📚 Ressources

- JWT : https://jwt.io
- Bcrypt : https://github.com/kelektiv/node.bcrypt.js
- Nodemailer : https://nodemailer.com
- Sequelize : https://sequelize.org
