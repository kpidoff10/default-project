import { Img, Section, Text } from "@react-email/components";

interface HeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  tagline?: string;
}

export default function Header({
  logoUrl,
  logoAlt = "Cloaky.me",
}: HeaderProps) {
  // URL par défaut pour la prévisualisation React Email
  const defaultLogoUrl = "https://cloaky.me/logo.png";

  return (
    <Section className="mb-8 pb-6 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Img
            src={logoUrl || defaultLogoUrl}
            width="45"
            height="40"
            alt={logoAlt}
            className="mr-3"
          />
        </div>
        <div className="text-right">
          <Text className="text-xs text-muted-foreground">Email sécurisé</Text>
        </div>
      </div>
    </Section>
  );
}
