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
    <div className="relative">
      {/* Image de couverture avec avatar intégré */}
      <div className="relative h-48 rounded-lg overflow-hidden">
        <CoverUpload
          imageUrl={userCover}
          onUploaded={(publicUrl) => {
            updateProfileCover(publicUrl);
          }}
          className="h-full w-full"
        />

        {/* Photo de profil intégrée dans la couverture */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20">
          <div className="relative">
            <AvatarUpload
              imageUrl={userImage || null}
              size={96}
              onUploaded={async (publicUrl) => {
                updateProfileImage(publicUrl);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
