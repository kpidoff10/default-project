"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Monitor, Shield } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "@/components/ui/change-password-dialog";
import { Separator } from "@/components/ui/separator";
import { SessionsDialog } from "@/components/sessions/sessions-dialog";
import { usePasswordEligibility } from "@/hooks/use-profile";
import { useTranslations } from "next-intl";

export function SecurityTab() {
  const t = useTranslations("Profile");
  const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false);
  const {
    mutate: checkEligibility,
    data: eligibility,
    isPending,
  } = usePasswordEligibility();

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

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
          <div className="flex flex-col gap-3 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-medium">
                {t("security.changePassword.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("security.changePassword.description")}
              </p>
            </div>
            <ChangePasswordDialog>
              <Button
                variant="outline"
                size="sm"
                disabled={eligibility && !eligibility.canChangePassword}
                isLoading={isPending}
              >
                {eligibility && !eligibility.canChangePassword
                  ? t("security.changePassword.oauth")
                  : t("security.changePassword.edit")}
              </Button>
            </ChangePasswordDialog>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between">
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
