import { env } from "../env";

export const clientConfig = {
  // Configuration de l'application (côté client uniquement)
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
  },

  // Configuration des locales
  i18n: {
    locales: ["fr", "en"] as const,
    defaultLocale: "fr" as const,
    localePrefix: "always" as const,
  },

  // Configuration des limites (côté client)
  limits: {
    upload: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"],
    },
    pagination: {
      defaultPageSize: 12,
      maxPageSize: 50,
    },
  },

  // Configuration de la sécurité (côté client)
  security: {
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 jours
    passwordMinLength: 8,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requêtes par fenêtre
    },
  },
} as const;

// Types pour la configuration côté client
export type ClientConfig = typeof clientConfig;
export type Locale = ClientConfig["i18n"]["locales"][number];

// Utilitaires de configuration côté client
export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development"; 