"use client";

import { useSessionUpdate } from "@/hooks/use-sessions";

/**
 * Composant wrapper pour mettre à jour les informations de session
 * Doit être utilisé à l'intérieur du AuthProvider
 */
export function SessionUpdater() {
  useSessionUpdate();
  return null;
}
