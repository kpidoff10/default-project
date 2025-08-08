"use client";

import { ReactNode, useEffect } from "react";

import moment from "moment";
import { useLocale } from "next-intl";

interface MomentProviderProps {
  children: ReactNode;
}

export function MomentProvider({ children }: MomentProviderProps) {
  const locale = useLocale();

  useEffect(() => {
    // Configuration de moment.js avec la locale en cours
    // Moment.js gère automatiquement les locales disponibles
    moment.locale(locale);
  }, [locale]);

  return <>{children}</>;
}
