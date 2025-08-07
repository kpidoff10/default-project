"use client";

import React from "react";
import {
  formatDate,
  getDeviceIcon,
  getDeviceTypeLabel,
  getOSLabel,
} from "@/lib/utils/device-utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, X } from "lucide-react";
import { SessionData } from "@/lib/actions/shared/session-info";
import { getCountryFlag } from "@/lib/utils/country-utils";
import { useTranslations } from "next-intl";
import { useRevokeSession } from "@/hooks/use-sessions";

interface SessionItemProps {
  session: SessionData;
}

export function SessionItem({ session }: SessionItemProps) {
  const t = useTranslations("Sessions");
  const revokeSession = useRevokeSession();

  const handleDelete = () => {
    revokeSession.mutate(session.id);
  };

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
                 <div className="flex items-center space-x-2">
           <div className="text-xs text-muted-foreground">
             {formatDate(session.createdAt)}
           </div>
        
              <Button
                 variant="destructiveGhost"
                 size="sm"
                 onClick={handleDelete}
                 tooltip={t("deleteSession")}
                 isLoading={revokeSession.isPending}
                 className="h-6 w-6 p-0"
               >
                 <X className="h-3 w-3" />
               </Button>
          
         </div>
      </div>
    </div>
  );
}
