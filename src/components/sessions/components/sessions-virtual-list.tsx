"use client";

import { SessionItem } from "./session-item";
import { VirtualList } from "@/components/ui/virtual-list";
import { useInfiniteSessions } from "@/hooks/use-sessions";
import { useTranslations } from "next-intl";

// Type correspondant à celui attendu par SessionItem
interface SessionData {
  id: string;
  country: string | null;
  deviceType: string | null;
  osName: string | null;
  createdAt: Date;
  lastActivity: Date; // Non nullable pour correspondre à SessionItem
}

interface SessionsVirtualListProps {
  // Hauteur du conteneur
  height?: number | string;

  // Taille de la page pour la pagination
  pageSize?: number;

  // Fonction de rafraîchissement
  onRefresh?: () => void;

  // Indique si on rafraîchit
  isRefreshing?: boolean;
}

export function SessionsVirtualList({
  height = 400,
  pageSize = 10,
  onRefresh,
  isRefreshing,
}: SessionsVirtualListProps) {
  const t = useTranslations("Sessions");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useInfiniteSessions(pageSize);

  // Extraire toutes les sessions de toutes les pages et filtrer les sessions sans lastActivity
  const allSessions =
    data?.pages
      .flatMap((page) => page.sessions)
      .filter((session) => session.lastActivity !== null)
      .map((session) => ({
        ...session,
        lastActivity: session.lastActivity as Date, // Type assertion car on a filtré les null
      })) ?? [];

  const renderSessionItem = (session: SessionData) => (
    <div className="mb-2">
      <SessionItem key={session.id} session={session} />
    </div>
  );

  const loadingComponent = (
    <div className="space-y-3">
      <div className="h-16 bg-muted rounded animate-pulse" />
      <div className="h-16 bg-muted rounded animate-pulse" />
      <div className="h-16 bg-muted rounded animate-pulse" />
    </div>
  );

  const emptyComponent = (
    <div className="text-center py-8">
      <p className="text-muted-foreground text-sm">{t("noSessions")}</p>
    </div>
  );

  const errorComponent = (
    <div className="text-center py-8">
      <p className="text-destructive text-sm">{t("errorLoadingSessions")}</p>
    </div>
  );

  // Fonction pour charger plus de données
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <VirtualList<SessionData>
      data={allSessions}
      renderItem={renderSessionItem}
      height={height}
      itemHeight={90} // Hauteur augmentée pour compenser l'espacement
      loadingComponent={isLoading ? loadingComponent : undefined}
      emptyComponent={
        allSessions.length === 0 && !isLoading ? emptyComponent : undefined
      }
      errorComponent={isError ? errorComponent : undefined}
      onLoadMore={loadMore}
      hasMore={hasNextPage}
      isLoadingMore={isFetchingNextPage}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
    />
  );
}
