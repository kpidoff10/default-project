"use client";

import {
  DialogResponsiveDescription,
  DialogResponsiveHeader,
  DialogResponsiveTitle,
} from "@/components/ui/dialog-responsive";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface SessionsHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function SessionsHeader({
  onRefresh,
  isRefreshing,
}: SessionsHeaderProps) {
  const t = useTranslations("Sessions");

  return (
    <DialogResponsiveHeader>
      <DialogResponsiveTitle className="flex items-center justify-between">
        <span>{t("activeSessions")}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="ml-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </DialogResponsiveTitle>
      <DialogResponsiveDescription>
        {t("sessionsDescription")}
      </DialogResponsiveDescription>
    </DialogResponsiveHeader>
  );
}
