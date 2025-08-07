# 📧 Service d'Email - Cloaky.me

Ce service utilise **Resend** et **React Email** pour envoyer des emails avec des templates React modernes.

## 🚀 Installation

Les dépendances sont déjà installées :
- `resend` : Service d'envoi d'emails
- `@react-email/components` : Composants React pour les emails
- `@react-email/render` : Rendu des templates React en HTML

## ⚙️ Configuration

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Resend API Key (obtenu depuis https://resend.com)
RESEND_API_KEY="re_123456789"

# Configuration des emails
EMAIL_FROM="noreply@cloaky.me"
EMAIL_REPLY_TO="support@cloaky.me"
```

### Obtenir une clé API Resend

1. Créez un compte sur [resend.com](https://resend.com)
2. Vérifiez votre domaine ou utilisez le domaine de test
3. Copiez votre clé API dans `RESEND_API_KEY`

## 📝 Templates disponibles

### 1. Email de bienvenue (`welcome`)
```typescript
await EmailService.sendWelcomeEmail({
  to: "user@example.com",
  userFirstName: "John",
  verificationUrl: "https://cloaky.me/verify?token=abc123",
});
```

### 2. Email de réinitialisation de mot de passe (`password-reset`)
```typescript
await EmailService.sendPasswordResetEmail({
  to: "user@example.com",
  userFirstName: "John",
  resetUrl: "https://cloaky.me/reset-password?token=xyz789",
});
```

## 🔧 Utilisation

### Méthodes directes

```typescript
import { EmailService } from "@/lib/email/service";

// Email de bienvenue
await EmailService.sendWelcomeEmail({
  to: "user@example.com",
  userFirstName: "John",
  verificationUrl: "https://cloaky.me/verify?token=abc123",
});

// Email de réinitialisation
await EmailService.sendPasswordResetEmail({
  to: "user@example.com",
  userFirstName: "John",
  resetUrl: "https://cloaky.me/reset-password?token=xyz789",
});
```

### Méthode générique

```typescript
await EmailService.sendEmail({
  to: "user@example.com",
  subject: "Bienvenue sur Cloaky.me !",
  template: "welcome",
  data: {
    userFirstName: "John",
    verificationUrl: "https://cloaky.me/verify?token=abc123",
  },
});
```

## 🎨 Personnalisation des templates

Les templates sont dans `src/lib/email/templates/` :

- `welcome.tsx` : Email de bienvenue
- `password-reset.tsx` : Email de réinitialisation

### Ajouter un nouveau template

1. Créez un nouveau fichier dans `templates/`
2. Utilisez les composants `@react-email/components`
3. Ajoutez la méthode dans `EmailService`
4. Ajoutez le template dans `EMAIL_TEMPLATES`

## 🧪 Test en développement

Pour tester les emails en développement :

1. Utilisez le domaine de test de Resend
2. Les emails seront envoyés à votre adresse de test
3. Vérifiez les logs pour les erreurs

## 📊 Monitoring

Resend fournit :
- **Analytics** : Taux de livraison, ouverture, clics
- **Logs** : Historique des envois
- **Webhooks** : Notifications en temps réel

## 🔒 Sécurité

- **Validation** : Tous les emails sont validés côté serveur
- **Rate limiting** : Resend limite automatiquement les envois
- **Spam protection** : Configuration automatique des en-têtes

## 💰 Coûts

- **Gratuit** : 3 000 emails/mois
- **Payant** : 0,80$ pour 1 000 emails supplémentaires
- **Pas de frais cachés** : Pas de coût par domaine

## 🚨 Gestion d'erreurs

```typescript
try {
  await EmailService.sendWelcomeEmail({
    to: "user@example.com",
    userFirstName: "John",
  });
} catch (error) {
  console.error("Erreur d'envoi d'email:", error);
  // Gérer l'erreur (retry, fallback, etc.)
}
```

## 📚 Ressources

- [Documentation Resend](https://resend.com/docs)
- [React Email Components](https://react.email/docs/components)
- [Templates React Email](https://react.email/templates) 