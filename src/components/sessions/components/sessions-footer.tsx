"use client";

import { Button } from "@/components/ui/button";
import { DialogResponsiveFooter } from "@/components/ui/dialog-responsive";
import { useTranslations } from "next-intl";

interface SessionsFooterProps {
  sessionCount?: number;
  onClose: () => void;
}

export function SessionsFooter({ sessionCount, onClose }: SessionsFooterProps) {
  const t = useTranslations("Sessions");

  return (
    <DialogResponsiveFooter>
      <div className="flex items-center justify-between w-full">
        <span className="text-sm text-muted-foreground">
          {sessionCount ? `${sessionCount} ${t("sessionCount")}` : ""}
        </span>
        <Button variant="outline" onClick={onClose}>
          {t("close")}
        </Button>
      </div>
    </DialogResponsiveFooter>
  );
}
