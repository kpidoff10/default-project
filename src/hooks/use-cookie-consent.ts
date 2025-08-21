import { useState, useEffect, useCallback } from "react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_STORAGE_KEY = "cookie-preferences";

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [hasConsented, setHasConsented] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem(COOKIE_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
        setHasConsented(true);
      } catch (error) {
        console.error("Erreur lors du chargement des préférences cookies:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  const savePreferences = useCallback((newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    setHasConsented(true);
    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(newPreferences));
  }, []);

  const acceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  }, [savePreferences]);

  const acceptNecessary = useCallback(() => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(necessaryOnly);
  }, [savePreferences]);

  const updatePreference = useCallback((key: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    localStorage.removeItem(COOKIE_STORAGE_KEY);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    setHasConsented(false);
  }, []);

  return {
    preferences,
    hasConsented,
    isLoaded,
    savePreferences,
    acceptAll,
    acceptNecessary,
    updatePreference,
    resetPreferences,
  };
}
