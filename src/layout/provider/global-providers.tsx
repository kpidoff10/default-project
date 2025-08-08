"use client";

import { AuthProvider } from "@/providers/auth-provider";
import { FilesProvider } from "@/providers/files-provider";
import { NextIntlClientProvider } from "next-intl";
import { QueryProvider } from "@/providers/query-provider";
import { ReactNode } from "react";
import { SessionUpdater } from "@/components/providers/session-updater";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionUpdater />
          <QueryProvider>
            <FilesProvider>{children}</FilesProvider>
          </QueryProvider>
          <Toaster />
        </NextIntlClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
