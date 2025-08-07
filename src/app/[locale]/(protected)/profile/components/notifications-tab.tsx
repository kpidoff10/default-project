"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export function NotificationsTab() {
  const t = useTranslations("Profile");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          {t("notifications.title")}
        </CardTitle>
        <CardDescription>{t("notifications.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">
              {t("notifications.emailNotifications.title")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t("notifications.emailNotifications.description")}
            </p>
          </div>
          <Button variant="outline" size="sm">
            {t("notifications.emailNotifications.configure")}
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">
              {t("notifications.pushNotifications.title")}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t("notifications.pushNotifications.description")}
            </p>
          </div>
          <Button variant="outline" size="sm">
            {t("notifications.pushNotifications.configure")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
