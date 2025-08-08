"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import AuthAvatar from "./auth-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LocaleSwitcher } from "./locale-switcher";
import Logo from "./logo";
import { Menu } from "lucide-react";
import { NotificationBell } from "./notification-bell";
import { OAuthNavButtons } from "./oauth-nav-buttons";
import { PopoverResponsive } from "@/components/ui/popover-responsive";
import { Route } from "@/lib/routes/types";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/providers/auth-provider";
import { useRoutes } from "@/hooks/use-routes";
import { useTranslatedRoutes } from "@/hooks/use-translated-routes";
import { useTranslations } from "next-intl";

// Composant pour les boutons d'authentification
function AuthButtons() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AuthAvatar />;
  }

  return (
    <div className="flex items-center space-x-4">
      <OAuthNavButtons />
    </div>
  );
}

// Composant pour la navigation desktop
function DesktopNavigation({ navRoutes }: { navRoutes: Route[] }) {
  const { getTranslation } = useTranslatedRoutes();
  return (
    <nav className="hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          {navRoutes.map((route) => (
            <NavigationMenuItem key={route.path}>
              <Link href={route.path} className={navigationMenuTriggerStyle()}>
                {getTranslation(route)}
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

// Composant pour la navigation mobile
function MobileNavigation({ navRoutes }: { navRoutes: Route[] }) {
  const { getTranslation } = useTranslatedRoutes();
  const t = useTranslations("Navigation");

  return (
    <div className="space-y-4">
      {navRoutes.map((route) => (
        <Link key={route.path} href={route.path}>
          <Button variant="ghost" className="w-full justify-start">
            {route.icon && <route.icon className="mr-2 h-4 w-4" />}
            {getTranslation(route)}
          </Button>
        </Link>
      ))}

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">{t("language")}</span>
          <LocaleSwitcher />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">{t("theme")}</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export function TopNav() {
  const { isAuthenticated } = useAuth();
  const { navRoutes } = useRoutes();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <DesktopNavigation navRoutes={navRoutes} />

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LocaleSwitcher />
          <ThemeToggle />
          <div className="w-px h-6 bg-border" />
          <NotificationBell />

          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <NotificationBell />
              <div className="mr-2">
                <AuthAvatar />
              </div>
            </div>
          )}

          <PopoverResponsive
            trigger={
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            }
            title="Menu"
          >
            <MobileNavigation navRoutes={navRoutes} />
          </PopoverResponsive>
        </div>
      </div>
    </header>
  );
}
