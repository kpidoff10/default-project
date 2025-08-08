import { env } from "../env";

export const serverConfig = {
  // Configuration de l'application (côté serveur)
  app: {
    url: env.NEXTAUTH_URL,
  },

  // Configuration de la base de données
  database: {
    url: env.DATABASE_URL,
  },

  // Configuration NextAuth
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
    providers: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      facebook: env.FACEBOOK_CLIENT_ID ? {
        clientId: env.FACEBOOK_CLIENT_ID,
        clientSecret: env.FACEBOOK_CLIENT_SECRET!,
      } : undefined,
      apple: env.APPLE_ID ? {
        id: env.APPLE_ID,
        teamId: env.APPLE_TEAM_ID!,
        privateKey: env.APPLE_PRIVATE_KEY!,
      } : undefined,
    },
  },

  // Configuration Cloudflare R2
  storage: {
    r2: env.R2_ACCOUNT_ID ? {
      accountId: env.R2_ACCOUNT_ID,
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      bucketName: env.R2_BUCKET_NAME!,
      publicUrl: env.R2_PUBLIC_URL!,
    } : undefined,
  },

  // Configuration du logging
  logging: {
    level: env.LOG_LEVEL,
  },

  // Configuration Ably
  ably: {
        apiKey: env.ABLY_API_KEY,
      },
} as const;

// Types pour la configuration côté serveur
export type ServerConfig = typeof serverConfig;

// Validation de la configuration côté serveur
export function validateServerConfig() {
  // Vérifier que les variables obligatoires sont présentes
  if (!serverConfig.database.url) {
    throw new Error("DATABASE_URL is required");
  }

  if (!serverConfig.auth.secret) {
    throw new Error("NEXTAUTH_SECRET is required");
  }

  // Vérifier que Google OAuth est configuré
  if (!serverConfig.auth.providers.google?.clientId || !serverConfig.auth.providers.google?.clientSecret) {
    console.warn("Google OAuth not configured");
  }

  return true;
} 