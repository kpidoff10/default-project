"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSessionInfo } from "@/lib/actions/shared/session-info";
import { updateSessionInfoClient } from "@/lib/actions/shared/session-info";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";

export function useSessions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sessions", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("Utilisateur non connecté");
      }
      
      const result = await getSessionInfo(user.id);
      
      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des sessions");
      }

      if (!result.data) {
        throw new Error("Aucune donnée reçue");
      }

      // Convertir les dates string en Date objects
      const sessionsWithDates = result.data.map((session) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        lastActivity: new Date(session.lastActivity),
      }));

      return sessionsWithDates;
    },
    enabled: !!user?.id, // Ne s'exécute que si l'utilisateur est connecté
  });
}

/**
 * Hook pour récupérer les sessions avec pagination infinie
 */
export function useInfiniteSessions(pageSize: number = 10) {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["infinite-sessions", user?.id, pageSize],
    queryFn: async ({ pageParam }) => {
      if (!user?.id) {
        throw new Error("Utilisateur non connecté");
      }
      
      const result = await getSessionInfo(user.id, pageSize, pageParam);
      
      if (!result.success) {
        throw new Error(result.error || "Erreur lors de la récupération des sessions");
      }

      if (!result.data) {
        throw new Error("Aucune donnée reçue");
      }

      // Convertir les dates string en Date objects
      const sessionsWithDates = result.data.map((session) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        lastActivity: session.lastActivity ? new Date(session.lastActivity) : null,
      }));

      return {
        sessions: sessionsWithDates,
        nextCursor: result.nextCursor,
        hasMore: result.hasMore
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!user?.id,
  });
}

// Hook pour terminer une session (si vous avez cette fonctionnalité)
export function useTerminateSession() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      // TODO: Implémenter la fonction terminateSession dans vos Server Actions
      // const result = await terminateSession(sessionId);
      // if (!result.success) {
      //   throw new Error(result.error || "Erreur lors de la terminaison de la session");
      // }
      // return result.data;
      
      // Simulation pour l'instant
      return { sessionId };
    },
    onSuccess: () => {
      // Invalider le cache des sessions pour forcer un re-fetch
      queryClient.invalidateQueries({ queryKey: ["sessions", user?.id] });
    },
    onError: (error) => {
      console.error("Erreur lors de la terminaison de la session:", error);
    },
  });
}

// Hook pour rafraîchir manuellement les sessions
export function useRefreshSessions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", user?.id] });
    },
  };
} 

/**
 * Hook pour mettre à jour automatiquement les informations de session
 * lors de la connexion (pays, appareil)
 */
export function useSessionUpdate() {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Mettre à jour les informations de session avec le User-Agent
      updateSessionInfoClient(navigator.userAgent)
        .then((result) => {
          if (result.success) {
            console.log("Informations de session mises à jour:", result.data);
          } else {
            console.warn("Erreur lors de la mise à jour de la session:", result.error);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour de la session:", error);
        });
    }
  }, [isAuthenticated, user?.id]);

  return null;
} 