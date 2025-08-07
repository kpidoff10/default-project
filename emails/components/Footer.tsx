import { Link, Section, Text } from "@react-email/components";

interface FooterProps {
  supportUrl?: string;
  siteUrl?: string;
}

export default function Footer({ supportUrl, siteUrl }: FooterProps) {
  // Construction des liens dynamiques
  const websiteUrl = siteUrl || "https://cloaky.me";
  const supportUrlFinal = supportUrl || "support@cloaky.me";

  // Déterminer quels liens afficher
  const links = [];

  // Lien site web (toujours affiché)
  links.push({
    href: websiteUrl,
    label: "Site web",
  });

  // Lien support (toujours affiché)
  links.push({
    href: supportUrlFinal,
    label: "Support",
  });

  return (
    <>
      {/* Informations techniques */}
      <Section className="text-center">
        <Text className="text-xs text-muted-foreground">
          All rights reserved
        </Text>
      </Section>
      <Section className="text-center">
        {/* Liens utiles */}
        <Text className="text-xs">
          <Link
            href={links[0].href}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {links[0].label}
          </Link>
          <span className="mx-3">|</span>
          <Link
            href={links[1].href}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            {links[1].label}
          </Link>
        </Text>
      </Section>
    </>
  );
}
