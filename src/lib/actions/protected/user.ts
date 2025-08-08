"use server";

import { updateProfileCoverInput, updateProfileImageInput } from "../../validations/user";

import { authActionClient } from "@/lib/create-safe-action";
import { createProfileFormSchema } from "@/app/[locale]/(protected)/profile/schemas/profile-schema";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export const updateProfile = authActionClient
  .metadata({ actionName: "updateProfile" })
  .inputSchema(async () => {
    const t = await getTranslations();
    return createProfileFormSchema(t);
  })
  .action(async ({ parsedInput: data, ctx: { userId } }) => {
  
    // Mettre à jour l'utilisateur et sélectionner seulement les champs nécessaires
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        coverImage: true,
        role: true,
        bio: true,
        firstName: true,
        lastName: true,
      },
    });

    return updatedUser;
  });

/**
 * Type de retour pour updateProfileImage
 */
export type UpdateProfileImageResult = NonNullable<Awaited<ReturnType<typeof updateProfileImage>>['data']>;

export const updateProfileImage = authActionClient
  .metadata({ actionName: "updateProfileImage" })
  .inputSchema(updateProfileImageInput)
  .action(async ({ parsedInput: { imageUrl }, ctx: { userId } }) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
      select: {

        image: true,

      },
    });

    return updatedUser;
  });


  /**
   * Type de retour pour updateProfileCover
   */
  export type UpdateProfileCoverResult = NonNullable<Awaited<ReturnType<typeof updateProfileCover>>['data']>;

  export const updateProfileCover = authActionClient
  .metadata({ actionName: "updateProfileCover" })
  .inputSchema(updateProfileCoverInput)
  .action(async ({ parsedInput: { imageUrl }, ctx: { userId } }) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { coverImage: imageUrl },
      select: {

        coverImage: true,

      },
    });

    return updatedUser;
  });
