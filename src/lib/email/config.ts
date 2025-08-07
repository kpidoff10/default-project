import { Resend } from "resend";
import { env } from "@/lib/env";

// Configuration Resend
export const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration des emails
export const emailConfig = {
  from: process.env.EMAIL_FROM || "noreply@cloaky.me",
  replyTo: process.env.EMAIL_REPLY_TO || "support@cloaky.me",
  defaultSubject: "Cloaky.me - Notification",
  siteUrl: env.SITE_URL,
};

// Types pour les emails
export interface EmailData {
  to: string;
  subject?: string;
  template: string;
  data?: Record<string, any>;
}

// Templates disponibles
export const EMAIL_TEMPLATES = {
  WELCOME: "welcome",
  PASSWORD_RESET: "password-reset",
} as const;

export type EmailTemplate = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES]; 