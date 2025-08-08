"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import moment from "moment";
import { useMarkOneNotificationRead } from "@/hooks/use-notifications";
import { useTranslations } from "next-intl";

interface NotificationItemProps {
  notification: any;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const t = useTranslations("Notifications");
  const tPage = useTranslations("NotificationsPage");

  const { mutate: markOneAsRead, isPending } = useMarkOneNotificationRead();

  return (
    <Card className="border-l-4 border-l-primary/20 hover:shadow-sm transition-shadow h-full overflow-hidden">
      <CardContent className="px-4 pb-2 h-full overflow-hidden">
        <div className="flex items-start gap-3">
          <span
            className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
              notification.read ? "bg-muted" : "bg-primary"
            }`}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t(
                    `${notification.type}.title`,
                    (notification.params as any) || {}
                  )}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {notification.priority}
                </Badge>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markOneAsRead(notification.id)}
                  className="h-8 w-8 p-0"
                  title={tPage("markOne")}
                  isLoading={isPending}
                  startIcon={<Eye className="h-4 w-4" />}
                  tooltip={tPage("markOne")}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                `${notification.type}.body`,
                (notification.params as any) || {}
              )}
            </p>
            <div className="text-xs text-muted-foreground italic text-right mt-2">
              {moment(notification.createdAt).fromNow()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
