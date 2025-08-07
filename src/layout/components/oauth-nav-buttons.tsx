"use client";

import { Button } from "@/components/ui/button";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

interface OAuthNavButtonsProps {
  isLoading?: boolean;
  onError?: (error: string) => void;
  setIsLoading?: (loading: boolean) => void;
}

export function OAuthNavButtons({
  isLoading = false,
  onError = () => {},
  setIsLoading = () => {},
}: OAuthNavButtonsProps) {
  const t = useTranslations("Auth.login");

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);

    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      onError(t("errors.oauth"));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Google */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleOAuthSignIn("google")}
        disabled={isLoading}
        tooltip={t("oauth.google")}
      >
        <FcGoogle className="h-4 w-4" />
      </Button>

      {/* Facebook */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleOAuthSignIn("facebook")}
        disabled={isLoading}
        tooltip={t("oauth.facebook")}
      >
        <FaFacebook className="h-4 w-4 text-blue-600" />
      </Button>

      {/* Apple */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleOAuthSignIn("apple")}
        disabled={isLoading}
        tooltip={t("oauth.apple")}
      >
        <FaApple className="h-4 w-4" />
      </Button>
    </div>
  );
}
