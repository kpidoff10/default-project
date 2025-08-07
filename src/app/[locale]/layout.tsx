import { GlobalProviders } from "@/layout/provider/global-providers";
import { getMessages } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validation de la locale
  const validLocales = ["fr", "en"];
  if (!validLocales.includes(locale)) {
    redirect(`/fr`);
  }

  // Récupérer les messages pour la locale
  const messages = await getMessages({ locale });

  return (
    <GlobalProviders locale={locale} messages={messages}>
      <div className="min-h-screen bg-background">{children}</div>
    </GlobalProviders>
  );
}
