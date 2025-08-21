"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Cookie, Settings } from "lucide-react";
import { Button } from "./button";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Separator } from "./separator";
import { Switch } from "./switch";
import { cn } from "@/lib/utils";
import { useCookieConsent } from "@/hooks/use-cookie-consent";
import { 
  DialogResponsive, 
  DialogResponsiveHeader, 
  DialogResponsiveTitle, 
  DialogResponsiveDescription, 
  DialogResponsiveContent, 
  DialogResponsiveFooter 
} from "./dialog-responsive";
import { PopoverResponsive } from "./popover-responsive";

interface CookieConsentProps {
  className?: string;
}

export function CookieConsent({ className }: CookieConsentProps) {
  const t = useTranslations("Cookies");
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const {
    preferences,
    hasConsented,
    isLoaded,
    savePreferences,
    acceptAll,
    acceptNecessary,
    updatePreference,
  } = useCookieConsent();

  // Afficher automatiquement le popover si pas encore consenti
  useEffect(() => {
    if (isLoaded && !hasConsented) {
      // Délai pour laisser le temps à la page de se charger
      const timer = setTimeout(() => {
        setIsPopoverOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasConsented]);

  // Ne pas afficher tant que les préférences ne sont pas chargées
  if (!isLoaded) {
    return null;
  }

  // Si l'utilisateur a déjà consenti, ne rien afficher
  if (hasConsented) {
    return null;
  }

  return (
    <>
      {/* Bouton cookie avec popover responsive */}
      <PopoverResponsive
        trigger={
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
              "bg-background/80 backdrop-blur-sm border-2",
              "hover:scale-110 active:scale-95",
              "animate-pulse",
              className
            )}
            title={t("iconTooltip")}
          >
            <Cookie className="h-5 w-5" />
          </Button>
        }
        title={t("title")}
        side="top"
        align="end"
        className="w-80 p-4"
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cookie className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">{t("title")}</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("description")}
          </p>
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => {
                acceptAll();
                setIsPopoverOpen(false);
              }}
              className="text-xs"
            >
              {t("acceptAll")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                acceptNecessary();
                setIsPopoverOpen(false);
              }}
              className="text-xs"
            >
              {t("acceptNecessary")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsPopoverOpen(false);
                setIsOpen(true);
              }}
              className="text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              {t("customize")}
            </Button>
          </div>
        </div>
      </PopoverResponsive>

      {/* Dialog de préférences responsive */}
      <DialogResponsive open={isOpen} onOpenChange={setIsOpen}>
        <DialogResponsiveContent 
          className="max-w-md sm:max-w-lg" 
          drawerHeight="70%"
        >
          <DialogResponsiveHeader>
            <DialogResponsiveTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              {t("title")}
            </DialogResponsiveTitle>
            <DialogResponsiveDescription>
              {t("preferencesDescription")}
            </DialogResponsiveDescription>
          </DialogResponsiveHeader>

          <div className="space-y-3 overflow-y-auto flex-1 px-4">
            {/* Cookies essentiels */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-2 px-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {t("necessary")}
                    <Badge variant="secondary" className="text-xs">Obligatoire</Badge>
                  </CardTitle>
                  <Switch checked disabled className="opacity-50" />
                </div>
                <CardDescription className="text-xs">
                  {t("necessaryDescription")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Separator />

            {/* Cookies d'analyse */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-2 px-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("analytics")}</CardTitle>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => updatePreference("analytics", checked)}
                  />
                </div>
                <CardDescription className="text-xs">
                  {t("analyticsDescription")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Separator />

            {/* Cookies marketing */}
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-2 px-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{t("marketing")}</CardTitle>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => updatePreference("marketing", checked)}
                  />
                </div>
                <CardDescription className="text-xs">
                  {t("marketingDescription")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <DialogResponsiveFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto"
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                savePreferences(preferences);
                setIsOpen(false);
              }}
              className="w-full sm:w-auto"
            >
              {t("save")}
            </Button>
          </DialogResponsiveFooter>
        </DialogResponsiveContent>
      </DialogResponsive>
    </>
  );
}
