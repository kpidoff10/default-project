import { Route } from "@/lib/routes/types";
import { useTranslations } from "next-intl";

export function useTranslatedRoutes() {
  const tNavigation = useTranslations("Navigation");
  const tAuthMenu = useTranslations("AuthMenu");
  const tUserMenu = useTranslations("UserMenu");
  const tAuthPages = useTranslations("AuthPages");
  const tFooterMenu = useTranslations("FooterMenu");

  const getTranslation = (route: Route): string => {
    const { labelKey } = route;
    
    if (labelKey.startsWith("Navigation.")) {
      return tNavigation(labelKey.replace("Navigation.", ""));
    }
    
    if (labelKey.startsWith("AuthMenu.")) {
      return tAuthMenu(labelKey.replace("AuthMenu.", ""));
    }
    
    if (labelKey.startsWith("UserMenu.")) {
      return tUserMenu(labelKey.replace("UserMenu.", ""));
    }
    
    if (labelKey.startsWith("AuthPages.")) {
      return tAuthPages(labelKey.replace("AuthPages.", ""));
    }
    
    if (labelKey.startsWith("FooterMenu.")) {
      return tFooterMenu(labelKey.replace("FooterMenu.", ""));
    }
    
    // Fallback pour les clés directes
    if (labelKey.includes(".")) {
      const [namespace, key] = labelKey.split(".");
      const t = useTranslations(namespace);
      return t(key);
    }
    
    return labelKey;
  };

  const getDescription = (route: Route): string => {
    const { descriptionKey } = route;
    
    if (!descriptionKey) return "";
    
    if (descriptionKey.startsWith("Navigation.")) {
      return tNavigation(descriptionKey.replace("Navigation.", ""));
    }
    
    if (descriptionKey.startsWith("AuthMenu.")) {
      return tAuthMenu(descriptionKey.replace("AuthMenu.", ""));
    }
    
    if (descriptionKey.startsWith("UserMenu.")) {
      return tUserMenu(descriptionKey.replace("UserMenu.", ""));
    }
    
    if (descriptionKey.startsWith("AuthPages.")) {
      return tAuthPages(descriptionKey.replace("AuthPages.", ""));
    }
    
    if (descriptionKey.startsWith("FooterMenu.")) {
      return tFooterMenu(descriptionKey.replace("FooterMenu.", ""));
    }
    
    // Fallback pour les clés directes
    if (descriptionKey.includes(".")) {
      const [namespace, key] = descriptionKey.split(".");
      const t = useTranslations(namespace);
      return t(key);
    }
    
    return descriptionKey;
  };

  return { getTranslation, getDescription };
} 