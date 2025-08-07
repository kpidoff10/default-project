import { EmailTestForm } from "./components/email-test-form";
import { ResendTest } from "./components/resend-test";
import { getTranslations } from "next-intl/server";

export default async function AdminEmailsPage() {
  const t = await getTranslations("Admin.Emails");

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
      </div>

      <div className="grid gap-8">
        <ResendTest />
        <EmailTestForm />
      </div>
    </div>
  );
}
