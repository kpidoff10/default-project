"use client";

import {
  DialogResponsive,
  DialogResponsiveContent,
} from "@/components/ui/dialog-responsive";
import {
  SessionsFooter,
  SessionsHeader,
  SessionsVirtualList,
} from "./components";

import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";

interface SessionsDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SessionsDialog({
  trigger,
  open,
  onOpenChange,
}: SessionsDialogProps) {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Ici on pourrait ajouter une fonction de refresh pour la liste virtuelle
      // Pour l'instant, on simule juste le loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClose = () => {
    onOpenChange?.(false);
  };

  if (!user) {
    return null;
  }

  return (
    <DialogResponsive open={open} onOpenChange={onOpenChange} trigger={trigger}>
      <DialogResponsiveContent className="sm:max-w-[600px]" drawerHeight="80%">
        <SessionsHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />

        <div className="space-y-4">
          <SessionsVirtualList
            height="55vh"
            pageSize={20}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>

        <SessionsFooter sessionCount={undefined} onClose={handleClose} />
      </DialogResponsiveContent>
    </DialogResponsive>
  );
}
