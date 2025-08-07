import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";

import Footer from "./Footer";
import Header from "./Header";
import { Tailwind } from "@react-email/tailwind";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText: string;
  logoUrl?: string;
  siteUrl?: string;
  supportUrl?: string;
}

export default function EmailLayout({
  children,
  previewText,
  logoUrl,
  siteUrl,
  supportUrl,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-muted font-sans">
          <Container className="mx-auto py-8 px-4 max-w-2xl">
            <Section className="bg-card rounded-lg shadow-sm border border-border p-8">
              <Header logoUrl={logoUrl} />
              {children}
              <Footer siteUrl={siteUrl} supportUrl={supportUrl} />
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
