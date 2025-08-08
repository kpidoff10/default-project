"use client";

import {
  useMarkManyNotificationsRead,
  useNotificationsList,
} from "@/hooks/use-notifications";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import MainCard from "@/components/ui/main-card";
import { NotificationItem } from "./components/notification-item";
import { NotificationSkeleton } from "./components/notification-skeleton";
import { VirtualList } from "@/components/ui/virtual-list";
import { useMemo } from "react";
import { useNotifications } from "@/providers/notifications-provider";
import { useTranslations } from "next-intl";

export default function NotificationsPage() {
  const t = useTranslations("NotificationsPage");
  const { items, hasNextPage, fetchMore, isLoading, isFetchingNextPage } =
    useNotificationsList(20);

  const { mutateAsync: markManyAsRead, isPending } =
    useMarkManyNotificationsRead();
  const { resetCount } = useNotifications();

  const unreadIds = useMemo(
    () => items.filter((n: any) => !n.read).map((n: any) => n.id),
    [items]
  );
  const hasUnread = unreadIds.length > 0;

  return (
    <MainCard
      title={t("title")}
      actions={[
        {
          label: t("markAll"),
          onClick: () =>
            unreadIds.length &&
            markManyAsRead().then(() => {
              resetCount();
            }),
          icon: <Check className="h-4 w-4" />,
          disabled: !hasUnread,
          isLoading: isPending,
        },
      ]}
    >
      <VirtualList
        data={items}
        itemHeight={130}
        onLoadMore={fetchMore}
        hasMore={hasNextPage}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage}
        itemGap={10}
        loadingCount={4}
        loadingComponent={<NotificationSkeleton />}
        renderItem={(n: any) => (
          <NotificationItem key={n.id} notification={n} />
        )}
      />
    </MainCard>
  );
}
