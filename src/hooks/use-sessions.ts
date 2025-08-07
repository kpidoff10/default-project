"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSessionInfo, revokeSession, revokeAllSessions } from "@/lib/actions/shared/session-info";
import { updateSessionInfoClient } from "@/lib/actions/shared/session-info";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useSessions() {
  const { user } = useAuth();
  const t = useTranslations("Sessions");

  return useQuery({
    queryKey: ["sessions", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error(t("userNotConnected"));
      }
      
      const result = await getSessionInfo(user.id);
      
      if (!result.success) {
        throw new Error(result.error || t("errorLoadingSessions"));
      }

      if (!result.data) {
        throw new Error(t("noDataReceived"));
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
  const t = useTranslations("Sessions");

  return useInfiniteQuery({
    queryKey: ["infinite-sessions", user?.id, pageSize],
    queryFn: async ({ pageParam }) => {
      if (!user?.id) {
        throw new Error(t("userNotConnected"));
      }
      
      const result = await getSessionInfo(user.id, pageSize, pageParam);
      
      if (!result.success) {
        throw new Error(result.error || t("errorLoadingSessions"));
      }

      if (!result.data) {
        throw new Error(t("noDataReceived"));
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
export function useRevokeSession() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const t = useTranslations("Sessions");

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const result = await revokeSession(sessionId);
      if (!result.success) {
        throw new Error(result.error || t("errorRevokingSession"));
      }
      return result;
    },
    onSuccess: () => {
      // Invalider le cache des sessions pour forcer un re-fetch
      queryClient.invalidateQueries({ queryKey: ["sessions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["infinite-sessions", user?.id] });
      toast.success(t("sessionRevoked"));
    },
    onError: (error) => {
      toast.error(t("errorRevokingSession"));
    },
  });
}

/**
 * Hook pour révoquer toutes les sessions d'un utilisateur
 */
export function useRevokeAllSessions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const t = useTranslations("Sessions");

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error(t("userNotConnected"));
      }
      
      // Appeler la fonction pour révoquer toutes les sessions
      const result = await revokeAllSessions(user.id);
      if (!result.success) {
        throw new Error(result.error || t("errorRevokingAllSessions"));
      }
      return result;
    },
    onSuccess: () => {
      // Invalider tous les caches liés aux sessions
      queryClient.invalidateQueries({ queryKey: ["sessions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["infinite-sessions", user?.id] });
      toast.success(t("allSessionsRevoked"));
    },
    onError: (error) => {
      toast.error(t("errorRevokingAllSessions"));
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
      updateSessionInfoClient(navigator.userAgent);
    }
  }, [isAuthenticated, user?.id]);

  return null;
} 