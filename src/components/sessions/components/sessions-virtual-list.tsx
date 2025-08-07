"use client";

import { SessionItem } from "./session-item";
import { SessionSkeleton } from "./session-skeleton";
import { VirtualList } from "@/components/ui/virtual-list";
import { useInfiniteSessions, useRevokeAllSessions } from "@/hooks/use-sessions";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
}

export function SessionsVirtualList({
  height = 400,
  pageSize = 10,
}: SessionsVirtualListProps) {
  const t = useTranslations("Sessions");
  const revokeAllSessions = useRevokeAllSessions();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
    refetch,
    isRefetching,
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

  // Fonction pour révoquer toutes les sessions
  const handleRevokeAllSessions = () => {
    revokeAllSessions.mutate();
  };

  return (
    <div className="space-y-4">
      {/* Bouton pour révoquer toutes les sessions */}
      {allSessions.length > 0 && (
        <div className="flex justify-end">
          <Button
            variant="destructiveGhost"
            size="sm"
            onClick={handleRevokeAllSessions}
            isLoading={revokeAllSessions.isPending}
            tooltip={t("revokeAllSessions")}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t("revokeAllSessions")}
          </Button>
        </div>
      )}

      <VirtualList<SessionData>
        data={allSessions}
        renderItem={renderSessionItem}
        height={height}
        itemHeight={90} // Hauteur augmentée pour compenser l'espacement
        loadingComponent={<SessionSkeleton />}
        isLoading={isLoading}
        errorComponent={isError ? errorComponent : undefined}
        onLoadMore={loadMore}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        onRefresh={refetch}
        isRefreshing={isRefetching}
      />
    </div>
  );
}
