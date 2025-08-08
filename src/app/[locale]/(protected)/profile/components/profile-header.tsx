"use client";

import * as React from "react";

import {
  useUpdateProfileCover,
  useUpdateProfileImage,
} from "@/hooks/use-profile";

import AvatarUpload from "@/components/ui/image-r2/avatar-upload";
import { Button } from "@/components/ui/button";
import CoverUpload from "@/components/ui/image-r2/cover-upload";
import { Image } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileHeaderProps {
  userImage?: string | null;
  userCover?: string | null;
}

export function ProfileHeader({ userImage, userCover }: ProfileHeaderProps) {
  const t = useTranslations("Profile");
  const { mutate: updateProfileImage } = useUpdateProfileImage();
  const { mutate: updateProfileCover } = useUpdateProfileCover();

  return (
    <div className="relative pt-10 md:pt-0">
      {/* Image de couverture */}
      <div className="relative h-48 rounded-lg overflow-hidden">
        <CoverUpload
          imageUrl={userCover}
          onUploaded={(publicUrl) => {
            updateProfileCover(publicUrl);
          }}
          className="h-full w-full"
        />
      </div>

      {/* Avatar : mobile centré avec halo doux; desktop à gauche centré */}
      <div className="absolute z-20 left-1/2 top-15 -translate-x-1/2 -translate-y-1/2 md:left-8 md:top-1/2 md:translate-x-0 md:-translate-y-1/2">
        {/* Halo décoratif derrière l'avatar (mobile uniquement) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-6 rounded-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent blur-2xl md:hidden"
        />
        <div className="relative rounded-full p-2 bg-background/70 ring-2 ring-background shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl md:bg-transparent md:ring-0 md:shadow-none md:p-0">
          <AvatarUpload
            imageUrl={userImage || null}
            size={136}
            className="md:scale-75 md:origin-center"
            onUploaded={async (publicUrl) => {
              updateProfileImage(publicUrl);
            }}
          />
        </div>
      </div>
    </div>
  );
}
