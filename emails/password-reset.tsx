import { Heading, Section, Text } from "@react-email/components";

import Alert from "./components/Alert";
import Button from "./components/Button";
import EmailLayout from "./components/EmailLayout";

interface PasswordResetEmailProps {
  userFirstName?: string;
  resetUrl: string;
  logoUrl?: string;
  siteUrl?: string;
  supportUrl?: string;
  // Props de traduction
  translations?: {
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

export default function PasswordResetEmail({
  userFirstName = "utilisateur",
  resetUrl,
  logoUrl,
  siteUrl,
  supportUrl,
  translations,
}: PasswordResetEmailProps) {
  // Traductions par défaut (fallback)
  const defaultTranslations = {
    title: "🔐 Réinitialisation de mot de passe",
    greeting: `Bonjour ${userFirstName},`,
    description:
      "Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.",
    resetPassword: "Réinitialiser mon mot de passe",
    security: "Sécurité",
    securityDescription:
      "Ce lien expire dans 1 heure pour des raisons de sécurité.",
    notRequested: "Vous n'avez pas demandé cette réinitialisation ?",
    notRequestedDescription:
      "Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel reste inchangé.",
  };

  const t = translations || defaultTranslations;
  const previewText = `Réinitialisation de mot de passe - Cloaky.me`;

  return (
    <EmailLayout
      previewText={previewText}
      logoUrl={logoUrl}
      siteUrl={siteUrl}
      supportUrl={supportUrl}
    >
      <Heading className="text-3xl font-bold text-foreground mb-6 text-center">
        {t.title}
      </Heading>

      <Text className="text-muted-foreground mb-6 text-lg">{t.greeting}</Text>

      <Text className="text-muted-foreground mb-8 text-lg leading-relaxed">
        {t.description}
      </Text>

      <Section className="text-center mb-8">
        <Button href={resetUrl} variant="primary" size="lg">
          {t.resetPassword}
        </Button>
      </Section>

      <Alert variant="warning" title={t.security}>
        {t.securityDescription}
      </Alert>

      <Alert variant="info" title={t.notRequested}>
        {t.notRequestedDescription}
      </Alert>
    </EmailLayout>
  );
}
