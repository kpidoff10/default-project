"use client";

import {
  DialogResponsiveDescription,
  DialogResponsiveHeader,
  DialogResponsiveTitle,
} from "@/components/ui/dialog-responsive";

import { useTranslations } from "next-intl";


export function SessionsHeader() {
  const t = useTranslations("Sessions");

  return (
    <DialogResponsiveHeader>
      <DialogResponsiveTitle className="flex items-center justify-between">
        <span>{t("activeSessions")}</span>
      </DialogResponsiveTitle>
      <DialogResponsiveDescription>
        {t("sessionsDescription")}
      </DialogResponsiveDescription>
    </DialogResponsiveHeader>
  );
}
