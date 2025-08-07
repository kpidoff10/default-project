"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";

import { EmailForm } from "./email-form";
import { OAuthButtons } from "./oauth-buttons";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="space-y-4">
      {/* Formulaire email/mot de passe */}
      <EmailForm
        onError={handleError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 py-1 text-xs font-medium text-muted-foreground rounded-full border border-border/50 shadow-sm">
            {t("separator")}
          </span>
        </div>
      </div>

      {/* Boutons OAuth */}
      <OAuthButtons
        isLoading={isLoading}
        onError={handleError}
        setIsLoading={setIsLoading}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
