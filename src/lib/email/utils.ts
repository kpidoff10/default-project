import { env } from "@/lib/env";

/**
 * Génère une URL complète en utilisant SITE_URL
 */
export function getSiteUrl(path: string = ""): string {
  return `${env.SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Génère l'URL du logo
 */
export function getLogoUrl(): string {
  return getSiteUrl("/logo.png");
}

/**
 * Génère l'URL de vérification d'email
 */
export function getVerificationUrl(token: string): string {
  return getSiteUrl(`/verify?token=${token}`);
}

/**
 * Génère l'URL de réinitialisation de mot de passe
 */
export function getPasswordResetUrl(token: string): string {
  return getSiteUrl(`/reset-password?token=${token}`);
}

/**
 * Récupère l'URL du site depuis les variables d'environnement
 */
export function getSiteUrlFromEnv(): string {
  return env.SITE_URL;
}

/**
 * Récupère l'URL de support depuis les variables d'environnement
 */
export function getSupportUrlFromEnv(): string {
  return env.SUPPORT_URL || "support@cloaky.me";
} 