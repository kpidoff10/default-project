# Variables d'environnement requises

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

## Base de données
```env
DATABASE_URL="postgresql://username:password@localhost:5432/cloaky_db"
```

## NextAuth
```env
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Google OAuth
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Facebook OAuth
```env
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

## Apple OAuth
```env
APPLE_ID="your-apple-id"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_PRIVATE_KEY="your-apple-private-key"
```

## Stripe
```env
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
```

## Cloudflare R2
```env
R2_ACCOUNT_ID="your-r2-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="your-r2-bucket-name"
R2_PUBLIC_URL="https://your-bucket.your-subdomain.r2.cloudflarestorage.com"
```

## Ably (Realtime)
```env
ABLY_API_KEY="your-ably-api-key"
```

## Resend (Emails)
```env
RESEND_API_KEY="your-resend-api-key"
```

## Logging
```env
LOG_LEVEL="info"
```

## Environment
```env
NODE_ENV="development"
```

## Instructions

1. Copiez ce contenu dans un fichier `.env` à la racine du projet
2. Remplacez les valeurs par vos vraies clés API
3. Ne committez jamais le fichier `.env` (il est déjà dans `.gitignore`)

## Variables optionnelles pour le développement

Pour résoudre le problème de cache Ably/keyv, vous pouvez ajouter :

```env
# Désactiver le cache Ably (optionnel)
ABLY_DISABLE_CACHE="true"
```
