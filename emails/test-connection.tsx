import { Heading, Section, Text } from "@react-email/components";

import EmailLayout from "./components/EmailLayout";

interface TestConnectionEmailProps {
  userEmail: string;
  logoUrl?: string;
  siteUrl?: string;
  supportUrl?: string;
}

export default function TestConnectionEmail({
  userEmail,
  logoUrl,
  siteUrl,
  supportUrl,
}: TestConnectionEmailProps) {
  const previewText = `Test de connexion - Email reçu sur ${userEmail}`;

  return (
    <EmailLayout
      previewText={previewText}
      logoUrl={logoUrl}
      siteUrl={siteUrl}
      supportUrl={supportUrl}
    >
      <Heading className="text-3xl font-bold text-foreground mb-6 text-center">
        ✅ Test de Connexion Réussi !
      </Heading>

      <Text className="text-muted-foreground mb-8 text-lg leading-relaxed">
        Cet email confirme que la connexion à votre boîte mail fonctionne
        correctement.
      </Text>

      <Section className="bg-muted p-6 rounded-lg mb-6">
        <Text className="text-foreground font-semibold text-lg mb-2">
          📧 Adresse de destination :
        </Text>
        <Text className="text-primary font-mono text-xl break-all">
          {userEmail}
        </Text>
      </Section>

      <Text className="text-muted-foreground text-sm">
        Cet email a été envoyé automatiquement pour tester la configuration de
        votre service d'emails.
      </Text>
    </EmailLayout>
  );
}
