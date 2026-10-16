# Activity Logs - Documentation

## 🎯 Vue d'ensemble

Un système **complet et automatisé** pour enregistrer toutes les activités des utilisateurs dans votre application.

### ✅ Fonctionnalités

- ✅ **Logging automatique** - Chaque action importante est enregistrée
- ✅ **IP & User-Agent** - Capture des infos de connexion
- ✅ **Métadonnées** - Contexte détaillé de chaque action
- ✅ **Historique** - Suivre tous les changements d'une entité
- ✅ **Statistiques** - Analyser les activités par période
- ✅ **API REST** - Consulter les logs via des routes protégées
- ✅ **Cleanup** - Supprimer les logs anciens automatiquement

---

## 📦 Fichiers implémentés

| Fichier | Description |
|---------|-------------|
| `src/utils/activityLog.utils.js` | Service de logging des activités |
| `src/modules/activities/activity.controller.js` | Contrôleurs pour consulter les logs |
| `src/modules/activities/activity.routes.js` | Routes API pour les logs |
| `src/modules/authentication/login/login.service.js` | **Logs intégrés** (login success/fail) |
| `src/modules/authentication/registration/regist.service.js` | **Logs intégrés** (registration) |

---

## 🔐 Actions enregistrées automatiquement

### Authentification
```
LOGIN           - Connexion réussie
LOGIN_FAILED    - Tentative de connexion échouée
LOGOUT          - Déconnexion
REGISTRATION    - Nouvel enregistrement
EMAIL_VERIFICATION - Email vérifié
PASSWORD_RESET  - Réinitialisation du mot de passe
PASSWORD_CHANGED - Mot de passe modifié
```

### Utilisateur
```
USER_UPDATED    - Profil modifié
USER_DELETED    - Compte supprimé
USER_ACTIVATED  - Compte activé
USER_DEACTIVATED - Compte désactivé
```

### Projets, Factures, Tickets, etc.
```
PROJECT_CREATED / UPDATED / DELETED
QUOTE_CREATED / UPDATED / SENT / ACCEPTED / REJECTED
INVOICE_CREATED / UPDATED / SENT / PAID
TICKET_CREATED / UPDATED / CLOSED
SERVICE_CREATED / UPDATED / DELETED
```

---

## 📝 Données enregistrées

Chaque log contient :

```json
{
  "id": "uuid",
  "userId": "uuid",                    // Qui a fait l'action
  "action": "LOGIN",                   // Quel type d'action
  "entityType": "USER",                // Type d'entité modifiée
  "entityId": "uuid",                  // ID de l'entité
  "description": "Connexion réussie",  // Description lisible
  "metadata": {                        // Contexte détaillé
    "email": "john@example.com",
    "role": "CLIENT",
    "reason": "invalid_password"
  },
  "ipAddress": "192.168.1.1",         // IP du client
  "userAgent": "Mozilla/5.0...",      // Navigateur/App
  "createdAt": "2026-08-20T10:30:00Z" // Timestamp
}
```

---

## 🚀 Intégration dans un service

### 1️⃣ Importer les utilitaires

```javascript
const { logActivity, ACTIVITY_ACTIONS, ENTITY_TYPES } = require('../utils/activityLog.utils');
```

### 2️⃣ Enregistrer une activité dans votre service

```javascript
async function monService(data, req) {
    try {
        // Votre logique métier
        const result = await DB.create(data);

        // Log l'activité
        await logActivity({
            userId: req.user?.id,
            action: ACTIVITY_ACTIONS.PROJECT_CREATED,
            entityType: ENTITY_TYPES.PROJECT,
            entityId: result.id,
            description: `Projet créé: ${result.name}`,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req),
            metadata: {
                projectName: result.name,
                clientId: result.clientId
            }
        });

        return { success: true, data: result };
    } catch (error) {
        // Log l'erreur
        await logActivity({
            userId: req.user?.id,
            action: ACTIVITY_ACTIONS.INVALID_ACTION,
            entityType: ENTITY_TYPES.PROJECT,
            description: `Erreur création projet: ${error.message}`,
            ipAddress: getClientIp(req),
            userAgent: getUserAgent(req)
        });
        
        throw error;
    }
}
```

### 3️⃣ Passer le `req` au service

```javascript
// Dans le contrôleur
const result = await monService(data, req);  // ← Passer req
```

---

## 📡 API REST

### 1️⃣ Récupérer l'historique d'un utilisateur

```bash
GET /api/activities/user/550e8400-e29b-41d4-a716-446655440000?page=1&limit=20
Authorization: Bearer eyJhbGc...
```

**Réponse :**
```json
{
  "responseCode": "04",
  "responseMessage": "Données récupérées avec succès",
  "data": {
    "activities": [
      {
        "id": "uuid",
        "action": "LOGIN",
        "description": "Connexion réussie - John Doe",
        "ipAddress": "192.168.1.1",
        "createdAt": "2026-08-20T10:30:00Z",
        "metadata": { "role": "CLIENT" }
      }
    ],
    "pagination": {
      "page": 1,
      "pages": 5,
      "total": 100,
      "limit": 20
    }
  }
}
```

### 2️⃣ Récupérer l'historique d'une entité

```bash
GET /api/activities/entity/PROJECT/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer eyJhbGc...
```

Voir tout ce qui s'est passé pour un projet spécifique.

### 3️⃣ Récupérer les activités récentes (Admin)

```bash
GET /api/activities/recent?limit=100
Authorization: Bearer eyJhbGc...
```

Toutes les activités récentes de l'application.

### 4️⃣ Récupérer les statistiques (Admin)

```bash
GET /api/activities/stats?startDate=2026-08-01&endDate=2026-08-31
Authorization: Bearer eyJhbGc...
```

**Réponse :**
```json
{
  "responseCode": "04",
  "data": {
    "stats": {
      "LOGIN": 45,
      "LOGIN_FAILED": 3,
      "REGISTRATION": 12,
      "PROJECT_CREATED": 8,
      "INVOICE_SENT": 15
    },
    "total": 83,
    "period": {
      "startDate": "2026-08-01",
      "endDate": "2026-08-31"
    }
  }
}
```

### 5️⃣ Nettoyer les anciens logs (Admin)

```bash
DELETE /api/activities/cleanup?daysOld=90
Authorization: Bearer eyJhbGc...
```

Supprime les logs plus anciens que 90 jours.

---

## 🔧 Utilisation avancée

### Logging personnalisé

```javascript
const { logActivity, getClientIp, getUserAgent } = require('../utils/activityLog.utils');

// Log custom pour une action quelconque
await logActivity({
    userId: 'user-123',
    action: 'CUSTOM_ACTION',
    entityType: 'CUSTOM_ENTITY',
    entityId: 'entity-456',
    description: 'Une action personnalisée',
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
    metadata: { customField: 'value' }
});
```

### Récupérer l'historique programmativement

```javascript
const { getUserActivityHistory } = require('../utils/activityLog.utils');

const result = await getUserActivityHistory(userId, limit = 20, offset = 0);
console.log(result.logs);     // Les logs
console.log(result.total);    // Nombre total
console.log(result.page);     // Page actuelle
```

### Ajouter une action personnalisée

Dans `src/utils/activityLog.utils.js`, ajouter à `ACTIVITY_ACTIONS` :

```javascript
const ACTIVITY_ACTIONS = {
    // ... existant ...
    MY_CUSTOM_ACTION: 'MY_CUSTOM_ACTION'
};
```

---

## 📊 Exemples de requêtes SQL

### Top 10 utilisateurs les plus actifs

```sql
SELECT user_id, COUNT(*) as count
FROM activity_logs
GROUP BY user_id
ORDER BY count DESC
LIMIT 10;
```

### Tentatives de connexion échouées

```sql
SELECT * FROM activity_logs
WHERE action = 'LOGIN_FAILED'
AND created_at > NOW() - INTERVAL 24 HOUR
ORDER BY created_at DESC;
```

### Historique d'un projet

```sql
SELECT * FROM activity_logs
WHERE entity_type = 'PROJECT'
AND entity_id = '550e8400-e29b-41d4-a716-446655440001'
ORDER BY created_at DESC;
```

---

## 🔐 Permissions

| Route | Permissions | Description |
|-------|-------------|-------------|
| `/user/:userId` | Authentifié | Voir son propre historique |
| `/entity/:type/:id` | Authentifié | Voir l'historique d'une entité |
| `/recent` | ADMIN | Toutes les activités récentes |
| `/stats` | ADMIN | Statistiques globales |
| `/cleanup` | ADMIN | Nettoyer les anciens logs |

---

## ⚙️ Configuration

### Rétention des logs

Par défaut : 90 jours (customisable via `cleanOldLogs(daysOld)`)

```javascript
// Garder 180 jours
await cleanOldLogs(180);
```

### Désactiver les logs pour un service

Simplement ne pas appeler `logActivity()` :

```javascript
// Sans logs
await monService(data);

// Avec logs
await monService(data, req);
```

---

## 🚨 Sécurité

✅ **Données sensibles** - Les mots de passe ne sont JAMAIS loggés  
✅ **IP Addresses** - Enregistrées pour les audits  
✅ **Métadonnées** - Contexte complet mais pas les secrets  
✅ **Timestamps** - Chaque action est horodatée  
✅ **User tracking** - Qui a fait quoi et quand  

---

## 🐛 Troubleshooting

### Les logs ne s'enregistrent pas

Vérifier que:
1. L'objet `req` est passé au service
2. Les utilitaires sont importés
3. La table `activity_logs` existe en BD

### Performance lente

La table a des index sur:
- `user_id`
- `entity_type` + `entity_id`
- `created_at`

Ajouter d'autres index si nécessaire.

---

## 📈 Cas d'usage

- 🔍 **Audit** - Tracer toutes les actions critiques
- 📊 **Analytics** - Analyser l'usage de l'app
- 🔐 **Security** - Détecter les activités suspectes
- 📱 **Notifications** - Alerter les admins de certaines actions
- 📝 **Compliance** - Respecter les normes de conformité (RGPD, etc.)

---

## 📚 Voir aussi

- [Authentication Setup](../authentication/LOGIN_SETUP.md)
- [Response Messages](../../utils/response.js)
- [Validation Data](../../utils/validateData.js)
