"use client";

import { Bell, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PopoverResponsive } from "@/components/ui/popover-responsive";
import { useNotifications } from "@/providers/notifications-provider";
import { useTranslations } from "next-intl";

export function NotificationBell() {
  const { unreadCount, latest, markDisplayedAsRead } = useNotifications();
  const t = useTranslations("NotificationsBell");
  const t2 = useTranslations("Notifications");

  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? "99+" : String(unreadCount);

  const unreadItems = latest.filter((n) => !n.read).slice(0, 8);

  return (
    <PopoverResponsive
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell
            className={`h-5 w-5 ${hasUnread ? "animate-pulse text-primary" : ""}`}
          />
          {hasUnread && (
            <>
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              </span>
              <span className="absolute -top-1 -right-1">
                <Badge className="h-4 min-w-4 px-1 text-[10px] leading-none rounded-full">
                  {displayCount}
                </Badge>
              </span>
            </>
          )}
        </Button>
      }
      title={t("title")}
      className="w-80"
      side="bottom"
      align="end"
    >
      <div className="space-y-3">
        {/* Top actions */}
        {unreadItems.length > 0 && (
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => markDisplayedAsRead(unreadItems.map((n) => n.id))}
            >
              <Eye className="h-4 w-4" />
              {t("markAll")}
            </Button>
          </div>
        )}
        {unreadItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-auto">
            {unreadItems.map((n) => (
              <div key={n.id} className="text-sm flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="font-medium">{t2(`${n.type}.title`)}</p>
                  <p className="text-muted-foreground">
                    {t2(`${n.type}.body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom action: full width */}
        <div className="pt-2">
          <Link href="/notifications" className="block">
            <Button variant="secondary" size="sm" className="w-full">
              {t("viewAll")}
            </Button>
          </Link>
        </div>
      </div>
    </PopoverResponsive>
  );
}
