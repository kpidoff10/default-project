"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

import Link from "next/link";
import { LoginForm } from "./components/login-form";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth.login");
  const [isMounted, setIsMounted] = useState(false);

  // Éviter les conflits d'hydratation avec les extensions
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Éviter le rendu pendant l'hydratation
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-10 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <LoginForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t("noAccount")} </span>
            <Link href="/register" className="text-primary hover:underline">
              {t("createAccount")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
