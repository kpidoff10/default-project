"use client";

import * as Ably from "ably";

import { NotificationPriority, NotificationType } from "@prisma/client";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useMarkManyNotificationsRead,
  useNotificationsList,
} from "@/hooks/use-notifications";

import { getAblyToken } from "@/lib/realtime/ably-actions";
import { getUnreadCount } from "@/lib/notifications/actions";
import { showToastForNotification as showToastUtil } from "@/lib/notifications/toast-utils";
import { useAuth } from "./auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  params: Record<string, any> | null;
  read: boolean;
  createdAt: string | Date;
};

type NotificationsContextType = {
  unreadCount: number;
  latest: NotificationItem[];
  loading: boolean;
  fetchMore: () => Promise<void>;
  markDisplayedAsRead: (ids: string[]) => Promise<void>;
  resetCount: () => void;
};

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const t = useTranslations("Notifications");
  const [unreadCountState, setUnreadCount] = useState(0);
  const ablyClientRef = useRef<Ably.Realtime | null>(null);
  const initializedRef = useRef(false);
  const queryClient = useQueryClient();

  // Notifications data via hooks
  const {
    items: latest,
    fetchMore,
    isFetching,
    isPending,
  } = useNotificationsList(20);
  const { mutate: markManyAsRead } = useMarkManyNotificationsRead();

  const showToastForNotification = useCallback(
    (n: NotificationItem) => {
      showToastUtil(n, t);
    },
    [t]
  );

  // Init Ably
  useEffect(() => {
    if (!user?.id) return;
    if (initializedRef.current && ablyClientRef.current) {
      // Déjà initialisé: juste (ré)abonner au canal
      const channel = ablyClientRef.current.channels.get(
        `user:${user.id}:notifications`
      );
      channel.subscribe("notification.created", (msg) => {
        const n = msg.data as NotificationItem;
        showToastForNotification(n);
        setUnreadCount((c) => c + (n.read ? 0 : 1));
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
      channel.subscribe("notification.read", (msg) => {
        const { ids } = (msg.data || {}) as { ids: string[] };
        if (!ids?.length) return;
        setUnreadCount((c) => Math.max(0, c - ids.length));
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });

      return () => {
        try {
          channel.unsubscribe();
        } catch {}
      };
    }

    const client = new Ably.Realtime({
      clientId: user.id,
      echoMessages: false,
      closeOnUnload: true,
      authCallback: async (_params: any, callback: any) => {
        try {
          const res = await getAblyToken(undefined);
          const tokenRequest = res?.data?.tokenRequest;
          if (!tokenRequest) throw new Error("No token request");
          callback(null, tokenRequest);
        } catch (err) {
          callback(err, null);
        }
      },
    } as any);
    ablyClientRef.current = client as any;
    initializedRef.current = true;

    const channel = client.channels.get(`user:${user.id}:notifications`);
    channel.subscribe("notification.created", (msg) => {
      const n = msg.data as NotificationItem;
      setUnreadCount((c) => c + (n.read ? 0 : 1));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
    channel.subscribe("notification.read", (msg) => {
      const { ids } = (msg.data || {}) as { ids: string[] };
      if (!ids?.length) return;
      // On pourrait aussi recalculer via getUnreadCount si besoin
      setUnreadCount((c) => Math.max(0, c - ids.length));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    // Seed initial unread count
    getUnreadCount(undefined).then((res) => {
      if (res?.data?.count !== undefined) setUnreadCount(res.data.count);
    });

    return () => {
      try {
        channel.unsubscribe();
      } catch {}
      // Ne pas fermer le client en dev pour éviter les erreurs "Connection closed" liées au double invoke
      // Le client est partagé dans ce provider global et sera réutilisé
    };
  }, [user?.id]);

  const markDisplayedAsRead = useCallback(
    async (ids: string[]) => {
      if (!ids.length) return;
      setUnreadCount((c) => Math.max(0, c - ids.length));
      await markManyAsRead();
      // Après invalidation par le hook, le compteur peut être recalibré si besoin via getUnreadCount côté serveur
    },
    [markManyAsRead]
  );

  const resetCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const value = useMemo(
    () => ({
      unreadCount: unreadCountState,
      latest: latest as NotificationItem[],
      loading: isPending || isFetching,
      fetchMore: async () => {
        await fetchMore();
      },
      markDisplayedAsRead,
      resetCount,
    }),
    [
      unreadCountState,
      latest,
      isPending,
      isFetching,
      fetchMore,
      markDisplayedAsRead,
      resetCount,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return ctx;
}
