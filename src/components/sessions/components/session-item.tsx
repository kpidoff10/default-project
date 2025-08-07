"use client";

import {
  formatDate,
  getDeviceIcon,
  getDeviceTypeLabel,
  getOSLabel,
} from "@/lib/utils/device-utils";

import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { SessionData } from "@/lib/actions/shared/session-info";
import { getCountryFlag } from "@/lib/utils/country-utils";
import { useTranslations } from "next-intl";

interface SessionItemProps {
  session: SessionData;
}

export function SessionItem({ session }: SessionItemProps) {
  const t = useTranslations("Sessions");

  return (
    <div key={session.id}>
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center space-x-3">
          {getDeviceIcon(session.deviceType)}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">
                {getOSLabel(session.osName, t)}
              </span>
              {session.country && (
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {getCountryFlag(session.country)} {session.country}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {getDeviceTypeLabel(session.deviceType, t)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {t("lastActivity")}: {formatDate(session.lastActivity)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(session.createdAt)}
        </div>
      </div>
    </div>
  );
}
