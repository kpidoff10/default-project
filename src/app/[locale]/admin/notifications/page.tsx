import SendNotificationForm from "./components/send-notification-form";
import { getTranslations } from "next-intl/server";

export default async function AdminNotificationsPage() {
  const t = await getTranslations("AdminNotifications");

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("title", { default: "Tester l'envoi de notification" })}
        </h1>
        <p className="text-muted-foreground">
          {t("description", {
            default: "Envoyer une notification USER à un utilisateur via Ably",
          })}
        </p>
      </div>
      <SendNotificationForm />
    </div>
  );
}
