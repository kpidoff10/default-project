"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { SessionUpdater } from "@/components/providers/session-updater";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";

interface GlobalProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>; // Type plus spécifique pour les messages
}

export function GlobalProviders({
  children,
  locale,
  messages,
}: GlobalProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Provider d'authentification */}
      <AuthProvider>
        <SessionUpdater />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
