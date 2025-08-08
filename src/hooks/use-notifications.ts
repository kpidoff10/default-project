"use client";

import { getNotifications, markAllAsRead, markAsRead } from "@/lib/notifications/actions";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryClient } from "@/providers/query-provider";
import { useNotifications } from "@/providers/notifications-provider";

type Cursor = string | undefined;

export function useNotificationsList(limit = 20) {

  const query = useInfiniteQuery({
    queryKey: ["notifications", limit],
    queryFn: async ({ pageParam }: { pageParam: Cursor }) => {
      const res = await getNotifications({ cursor: pageParam, limit });
      const items = res?.data?.items ?? [];
      const nextCursor = res?.data?.nextCursor as Cursor;
      return { data: items, nextPage: nextCursor, hasNextPage: !!nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: undefined as Cursor,
  });

  const items = (query.data?.pages.flatMap((p: any) => p.data) ?? []) as any[];
  const hasNextPage = !!query.hasNextPage;
  const fetchMore = () => query.fetchNextPage();

  return { ...query, items, hasNextPage, fetchMore };
}

export function useMarkOneNotificationRead() {

  return useMutation({
    mutationFn: async (id: string) => {
      return await markAsRead({ ids: [id] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

}

export function useMarkManyNotificationsRead() { 
  return useMutation({
    mutationFn: async () => {
      return await markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

