"use client";

import * as React from "react";

import { ArrowUp, Loader2 } from "lucide-react";

import { Button } from "./button";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";

// Composant unifié pour l'animation de transformation
function UnifiedPullToRefreshIndicator({
  isRefreshing,
  onRefresh,
}: {
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="w-full mb-2 pt-2 md:pt-0">
      <div
        className={cn(
          "flex items-center justify-center space-x-2 rounded-lg overflow-hidden transition-all duration-300 ease-in-out w-full",
          isRefreshing ? "p-4 bg-muted/50 max-h-16" : "p-2 bg-muted/30 max-h-12"
        )}
      >
        {isRefreshing && <Loader2 className="h-4 w-4 animate-spin" />}
        <span
          className={cn(
            "transition-all duration-300 text-muted-foreground",
            isRefreshing ? "text-sm" : "text-xs"
          )}
          onClick={!isRefreshing ? onRefresh : undefined}
        >
          {isRefreshing ? "Actualisation..." : "Cliquez pour actualiser"}
        </span>
      </div>
    </div>
  );
}

interface VirtualListProps<T> {
  // Option 1: Données directement
  data?: T[];

  // Option 2: Fonction pour récupérer les données
  queryFn?: (pageParam: number) => Promise<{
    data: T[];
    nextPage?: number;
    hasNextPage?: boolean;
  }>;

  // Clé unique pour React Query (requis si queryFn est fourni)
  queryKey?: string[];

  // Fonction pour rendre chaque élément
  renderItem: (item: T, index: number) => React.ReactNode;

  // Hauteur du conteneur
  height?: number | string;

  // Hauteur de chaque élément
  itemHeight: number;

  // Classes CSS personnalisées
  className?: string;

  // Élément de chargement personnalisé
  loadingComponent?: React.ReactNode;

  // Élément vide personnalisé
  emptyComponent?: React.ReactNode;

  // Élément d'erreur personnalisé
  errorComponent?: React.ReactNode;

  // Fonction pour charger plus de données (utilisé avec data)
  onLoadMore?: () => void;

  // Indique s'il y a plus de données (utilisé avec data)
  hasMore?: boolean;

  // Indique si on charge plus de données (utilisé avec data)
  isLoadingMore?: boolean;

  // Fonction pour rafraîchir les données (pull-to-refresh)
  onRefresh?: () => void;

  // Indique si on est en train de rafraîchir
  isRefreshing?: boolean;

  // Désactiver le pull-to-refresh (utile dans les drawers)
  disablePullToRefresh?: boolean;
}

export function VirtualList<T>({
  data,
  queryFn,
  queryKey,
  renderItem,
  height = 400,
  itemHeight,
  className,
  loadingComponent,
  emptyComponent,
  errorComponent,
  onLoadMore,
  hasMore,
  isLoadingMore,
  onRefresh,
  isRefreshing,
  disablePullToRefresh = false,
}: VirtualListProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = React.useState(false);

  // Mode 1: Données directes
  const isDataMode = data !== undefined;

  // Mode 2: Query infinie avec React Query
  const {
    data: queryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: queryKey || [],
    queryFn: ({ pageParam = 0 }) =>
      queryFn?.(pageParam) ??
      Promise.resolve({ data: [], nextPage: undefined, hasNextPage: false }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !isDataMode && !!queryFn && !!queryKey,
  });

  // Aplatir toutes les pages en une seule liste (mode query)
  const queryItems = React.useMemo(() => {
    return queryData?.pages.flatMap((page) => page.data) ?? [];
  }, [queryData]);

  // Utiliser les données appropriées selon le mode
  const allItems = isDataMode ? (data as T[]) : queryItems;
  const currentHasMore = isDataMode ? hasMore : hasNextPage;
  const currentIsLoadingMore = isDataMode ? isLoadingMore : isFetchingNextPage;
  const currentIsLoading = isDataMode ? false : isLoading;
  const currentIsError = isDataMode ? false : isError;
  const currentError = isDataMode ? null : error;

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: currentHasMore ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  // Détecter si on est en haut du tableau
  React.useEffect(() => {
    const handleScroll = () => {
      if (parentRef.current) {
        const scrollTop = parentRef.current.scrollTop;
        setShowScrollToTop(scrollTop > 100); // Afficher après 100px de scroll
      }
    };

    const scrollElement = parentRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Fonction pour remonter en haut
  const scrollToTop = () => {
    if (parentRef.current) {
      parentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Charger plus d'éléments quand on atteint la fin
  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allItems.length - 1 &&
      currentHasMore &&
      !currentIsLoadingMore
    ) {
      if (isDataMode && onLoadMore) {
        onLoadMore();
      } else if (!isDataMode) {
        fetchNextPage();
      }
    }
  }, [
    currentHasMore,
    onLoadMore,
    fetchNextPage,
    allItems.length,
    currentIsLoadingMore,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    rowVirtualizer.getVirtualItems(),
    isDataMode,
    rowVirtualizer,
  ]);

  // États de rendu
  if (currentIsLoading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        {loadingComponent || (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Chargement...</span>
          </div>
        )}
      </div>
    );
  }

  if (currentIsError) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        {errorComponent || (
          <div className="text-center">
            <p className="text-destructive text-sm">
              Erreur lors du chargement
            </p>
            {currentError && (
              <p className="text-xs text-muted-foreground mt-1">
                {currentError.message}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        {emptyComponent || (
          <p className="text-sm text-muted-foreground">Aucun élément</p>
        )}
      </div>
    );
  }

  return (
    <>
      {onRefresh && (
        <UnifiedPullToRefreshIndicator
          isRefreshing={isRefreshing || false}
          onRefresh={onRefresh}
        />
      )}
      <div
        ref={parentRef}
        id="virtual-list-container"
        className={cn(
          "overflow-auto pr-1 relative",
          // Suppression de select-none qui bloque le scroll tactile
          // Ajout de classes pour améliorer le scroll tactile sur mobile
          "touch-pan-y overscroll-contain",

          className
        )}
        style={{
          height: showScrollToTop
            ? `calc(${height} - 96px)`
            : `calc(${height} - 40px)`,
          // Suppression du cursor grab qui peut interférer
          // Ajout de propriétés pour améliorer le scroll tactile
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {disablePullToRefresh ? (
          // Mode sans pull-to-refresh
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > allItems.length - 1;
              const item = allItems[virtualRow.index];

              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${itemHeight}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    <div className="flex items-center justify-center p-4">
                      {currentIsLoadingMore ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Chargement...
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Fin de la liste
                        </span>
                      )}
                    </div>
                  ) : (
                    renderItem(item, virtualRow.index)
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Mode avec pull-to-refresh - PullToRefresh englobe tout le conteneur

          <div className="h-full">
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index > allItems.length - 1;
                const item = allItems[virtualRow.index];

                return (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${itemHeight}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isLoaderRow ? (
                      <div className="flex items-center justify-center p-4">
                        {currentIsLoadingMore ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">
                              Chargement...
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Fin de la liste
                          </span>
                        )}
                      </div>
                    ) : (
                      renderItem(item, virtualRow.index)
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bouton "Remonter en haut" avec effet accordéon */}
      </div>

      {showScrollToTop && (
        <div className="w-full mb-2 md:pt-0">
          <div
            className={cn(
              "flex items-center justify-center space-x-2 rounded-lg overflow-hidden transition-all duration-300 ease-in-out w-full cursor-pointer",
              "p-2 bg-muted/30 max-h-12"
            )}
            onClick={scrollToTop}
          >
            <ArrowUp className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">
              Remonter en haut
            </span>
          </div>
        </div>
      )}
    </>
  );
}
