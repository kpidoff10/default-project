"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ExternalLink,
  Facebook,
  Heart,
  Instagram,
  Lock,
  Mail,
  Shield,
  Twitter,
  Users,
} from "lucide-react";
import {
  aboutRoutes,
  authPagesRoutes,
  featuresRoutes,
  legalRoutes,
  productRoutes,
  supportRoutes,
} from "@/lib/routes/menus";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { LocaleSwitcher } from "./locale-switcher";
import Logo from "./logo";
import { OAuthNavButtons } from "./oauth-nav-buttons";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { clientConfig } from "@/lib/config/client-config";
import { useAuth } from "@/providers/auth-provider";
import { useTranslatedRoutes } from "@/hooks/use-translated-routes";
import { useTranslations } from "next-intl";

export function Footer() {
  const { isAuthenticated } = useAuth();
  const t = useTranslations("Footer");
  const { getTranslation } = useTranslatedRoutes();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-3">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <Logo height={32} width={32} />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {t("description")}
            </p>

            {/* Boutons OAuth si non connecté */}
            {!isAuthenticated && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-3">{t("quickLogin")}</p>
                <OAuthNavButtons />
              </div>
            )}
          </div>

          {/* Produit */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              {t("sections.product")}
            </h3>
            <ul className="space-y-2">
              {productRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {getTranslation(route)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fonctionnalités / Entreprise */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              {t("sections.features")}
            </h3>
            <ul className="space-y-2">
              {featuresRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {getTranslation(route)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* À propos et Blog */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              {t("sections.about")}
            </h3>
            <ul className="space-y-2">
              {aboutRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {getTranslation(route)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Légal */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              {t("sections.legal")}
            </h3>
            <ul className="space-y-2">
              {legalRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    {route.icon && <route.icon className="h-4 w-4" />}
                    {getTranslation(route)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              {t("sections.support")}
            </h3>
            <ul className="space-y-2">
              {supportRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    {route.icon && <route.icon className="h-4 w-4" />}
                    {getTranslation(route)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <Separator className="my-8" />

        {/* Section inférieure */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              © {currentYear} {clientConfig.app.name}
            </span>
            <span>•</span>
            <span>{t("madeWith")}</span>
            <Heart className="h-4 w-4 text-red-500" />
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
