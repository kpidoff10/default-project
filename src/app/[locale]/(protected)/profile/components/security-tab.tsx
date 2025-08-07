"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SessionsDialog } from "@/components/sessions/sessions-dialog";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function SecurityTab() {
  const t = useTranslations("Profile");
  const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t("security.title")}
          </CardTitle>
          <CardDescription>{t("security.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">
                {t("security.changePassword.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("security.changePassword.description")}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {t("security.changePassword.edit")}
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">
                {t("security.activeSessions.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("security.activeSessions.description")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessionsDialogOpen(true)}
            >
              <Monitor className="w-4 h-4 mr-2" />
              {t("security.activeSessions.view")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <SessionsDialog
        open={sessionsDialogOpen}
        onOpenChange={setSessionsDialogOpen}
      />
    </>
  );
}
