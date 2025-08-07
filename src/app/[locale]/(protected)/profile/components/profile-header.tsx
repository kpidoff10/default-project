"use client";

import { AlertCircle, Camera, CheckCircle, Image, Save, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ProfileHeaderProps {
  userImage?: string | null;
  userName?: string | null;
}

export function ProfileHeader({
  userImage,
  userName,
}: ProfileHeaderProps) {
  const t = useTranslations("Profile");

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      {/* Image de couverture avec avatar intégré */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
        <div className="absolute inset-0 bg-black/20 rounded-lg" />

        {/* Photo de profil intégrée dans la couverture */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={userImage || ""} alt="Profile" />
              <AvatarFallback className="text-2xl">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-white hover:bg-gray-50"
              title={t("header.changePhoto")}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bouton changer couverture */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white"
          >
            <Image className="w-4 h-4 mr-2" />
            {t("header.changeCover")}
          </Button>
        </div>
      </div>
    </div>
  );
}
