import { Heading, Section, Text } from "@react-email/components";

import Alert from "./components/Alert";
import Button from "./components/Button";
import EmailLayout from "./components/EmailLayout";
import FeatureList from "./components/FeatureList";

interface WelcomeEmailProps {
  userFirstName?: string;
  verificationUrl?: string;
  logoUrl?: string;
  siteUrl?: string;
  supportUrl?: string;
  // Props de traduction
  translations?: {
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
}

export default function WelcomeEmail({
  userFirstName = "Créateur",
  verificationUrl,
  logoUrl,
  siteUrl,
  supportUrl,
  translations,
}: WelcomeEmailProps) {
  // Traductions par défaut (fallback)
  const defaultTranslations = {
    title: `Bienvenue sur Cloaky.me, ${userFirstName} ! 🎉`,
    subtitle:
      "Nous sommes ravis de vous accueillir sur la plateforme anonyme de contenus digitaux. Vous pouvez maintenant commencer à partager vos créations en toute confidentialité.",
    verificationRequired:
      "Pour commencer à utiliser Cloaky.me, veuillez vérifier votre adresse email.",
    verifyEmail: "Vérifier mon email",
    whatYouCanDo: "Voici ce que vous pouvez faire maintenant :",
    features: [
      {
        text: "Configurer votre profil créateur",
        icon: "👤",
        description: "Personnalisez votre espace créateur",
      },
      {
        text: "Publier vos premiers contenus",
        icon: "📝",
        description: "Partagez vos créations en toute confidentialité",
      },
    ],
  };

  const t = translations || defaultTranslations;
  const previewText = `Bienvenue sur Cloaky.me, ${userFirstName} !`;

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

      <Text className="text-muted-foreground mb-8 text-lg leading-relaxed">
        {t.subtitle}
      </Text>

      {verificationUrl && (
        <Alert variant="info" title="Vérification requise">
          {t.verificationRequired}
        </Alert>
      )}

      {verificationUrl && (
        <Section className="text-center mb-8">
          <Button href={verificationUrl} variant="primary" size="lg">
            {t.verifyEmail}
          </Button>
        </Section>
      )}

      <Text className="text-foreground mb-6 font-semibold text-lg">
        {t.whatYouCanDo}
      </Text>

      <FeatureList features={t.features} variant="success" />
    </EmailLayout>
  );
}
