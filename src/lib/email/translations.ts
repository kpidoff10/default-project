import { getTranslations } from "next-intl/server";

// Types pour les traductions d'emails
export interface EmailTranslations {
  welcome: {
    title: string;
    subtitle: string;
    verificationRequired: string;
    verifyEmail: string;
    whatYouCanDo: string;
    features: Array<{
      text: string;
      icon: string;
      description: string;
    }>;
  };
  passwordReset: {
    title: string;
    greeting: string;
    description: string;
    resetPassword: string;
    security: string;
    securityDescription: string;
    notRequested: string;
    notRequestedDescription: string;
  };
}

// Service de traduction pour les emails
export class EmailTranslationService {
  static async getWelcomeTranslations(locale: string, userFirstName?: string): Promise<EmailTranslations['welcome']> {
    const t = await getTranslations({ locale, namespace: 'Emails.Welcome' });
    
    return {
      title: t('title', { userFirstName: userFirstName || 'Créateur' }),
      subtitle: t('subtitle'),
      verificationRequired: t('verificationRequired'),
      verifyEmail: t('verifyEmail'),
      whatYouCanDo: t('whatYouCanDo'),
      features: [
        {
            text: t('features.profile.text'),
            icon: "👤",
            description: t('features.profile.description'),
        },
        {
          text: t('features.publish.text'),
          icon: "📝",
          description: t('features.publish.description'),
        },

      ],
    };
  }

  static async getPasswordResetTranslations(locale: string, userFirstName?: string): Promise<EmailTranslations['passwordReset']> {
    const t = await getTranslations({ locale, namespace: 'Emails.PasswordReset' });
    
    return {
      title: t('title'),
      greeting: t('greeting', { userFirstName: userFirstName || 'utilisateur' }),
      description: t('description'),
      resetPassword: t('resetPassword'),
      security: t('security'),
      securityDescription: t('securityDescription'),
      notRequested: t('notRequested'),
      notRequestedDescription: t('notRequestedDescription'),
    };
  }
} 