import { EmailData, emailConfig, resend } from "./config";
import { getLogoUrl, getPasswordResetUrl, getSiteUrlFromEnv, getSupportUrlFromEnv, getVerificationUrl } from "./utils";

import { EmailTranslationService } from "./translations";
import PasswordResetEmail from "../../../emails/password-reset";
import TestConnectionEmail from "../../../emails/test-connection";
import WelcomeEmail from "../../../emails/welcome";
import { getLocale } from "next-intl/server";
import { render } from "@react-email/render";

// Service d'envoi d'emails
export class EmailService {
  /**
   * Envoie un email de bienvenue
   */
  static async sendWelcomeEmail(data: {
    to: string;
    userFirstName?: string;
    verificationToken?: string;
  }) {
    const { to, userFirstName, verificationToken } = data;
    
    const verificationUrl = verificationToken ? getVerificationUrl(verificationToken) : undefined;
    
    // Récupère le locale automatiquement
    const locale = await getLocale();
    
    // Récupère les traductions
    const translations = await EmailTranslationService.getWelcomeTranslations(locale, userFirstName);
    
    const emailHtml = await render(
      WelcomeEmail({
        userFirstName,
        verificationUrl,
        logoUrl: getLogoUrl(),
        siteUrl: getSiteUrlFromEnv(),
        supportUrl: getSupportUrlFromEnv(),
        translations,
      })
    );

    return await resend.emails.send({
      from: emailConfig.from,
      to: [to],
      subject: "Bienvenue sur Cloaky.me ! 🎉",
      html: emailHtml,
      replyTo: emailConfig.replyTo,
    });
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   */
  static async sendPasswordResetEmail(data: {
    to: string;
    resetToken: string;
    userFirstName?: string;
  }) {
    const { to, resetToken, userFirstName } = data;
    
    const resetUrl = getPasswordResetUrl(resetToken);
    
    // Récupère le locale automatiquement
    const locale = await getLocale();
    
    // Récupère les traductions
    const translations = await EmailTranslationService.getPasswordResetTranslations(locale, userFirstName);
    
    const emailHtml = await render(
      PasswordResetEmail({
        userFirstName,
        resetUrl,
        logoUrl: getLogoUrl(),
        siteUrl: getSiteUrlFromEnv(),
        supportUrl: getSupportUrlFromEnv(),
        translations,
      })
    );

    return await resend.emails.send({
      from: emailConfig.from,
      to: [to],
      subject: "Réinitialisation de mot de passe - Cloaky.me",
      html: emailHtml,
      replyTo: emailConfig.replyTo,
    });
  }

  /**
   * Envoie un email de test de connexion
   */
  static async sendTestConnectionEmail(data: {
    to: string;
  }) {
    const { to } = data;
    
    const emailHtml = await render(
      TestConnectionEmail({
        userEmail: to,
        logoUrl: getLogoUrl(),
        siteUrl: getSiteUrlFromEnv(),
        supportUrl: getSupportUrlFromEnv(),
      })
    );

    return await resend.emails.send({
      from: emailConfig.from,
      to: [to],
      subject: "Test de connexion - Cloaky.me",
      html: emailHtml,
      replyTo: emailConfig.replyTo,
    });
  }

  /**
   * Méthode générique pour envoyer un email avec un template personnalisé
   */
  static async sendEmail(data: EmailData) {
    const { to, subject, template, data: templateData } = data;
    
    let emailHtml = "";
    
    switch (template) {
      case "welcome":
        emailHtml = await render(
          WelcomeEmail({
            userFirstName: templateData?.userFirstName,
            verificationUrl: templateData?.verificationUrl,
            logoUrl: getLogoUrl(),
          })
        );
        break;
      case "password-reset":
        emailHtml = await render(
          PasswordResetEmail({
            userFirstName: templateData?.userFirstName,
            resetUrl: templateData?.resetUrl,
            logoUrl: getLogoUrl(),
          })
        );
        break;
      case "test-connection":
        emailHtml = await render(
          TestConnectionEmail({
            userEmail: to,
            logoUrl: getLogoUrl(),
          })
        );
        break;
      default:
        throw new Error(`Template ${template} non trouvé`);
    }

    return await resend.emails.send({
      from: emailConfig.from,
      to: [to],
      subject: subject || emailConfig.defaultSubject,
      html: emailHtml,
      replyTo: emailConfig.replyTo,
    });
  }
} 