"use server";

import { changePasswordInput, updateProfileCoverInput, updateProfileImageInput } from "../../validations/user";

import { ActionError } from "@/lib/create-safe-action";
import { authActionClient } from "@/lib/create-safe-action";
import { createProfileFormSchema } from "@/app/[locale]/(protected)/profile/schemas/profile-schema";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

export const changePassword = authActionClient
  .metadata({ actionName: "changePassword" })
  .inputSchema(changePasswordInput)
  .action(async ({ parsedInput: { currentPassword, newPassword }, ctx: { userId } }) => {
    // Vérifier le mot de passe actuel
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) {
      throw new ActionError("Utilisateur introuvable");
    }
    const bcrypt = await import("bcryptjs");
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new ActionError("Mot de passe actuel invalide");
    }

    // Mettre à jour le mot de passe
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return { success: true };
  });

export const getPasswordEligibility = authActionClient
  .metadata({ actionName: "getPasswordEligibility" })
  .inputSchema(z.undefined())
  .action(async ({ ctx: { userId } }) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true, accounts: { select: { provider: true } } },
    });

    if (!user) {
      return { canChangePassword: false, reason: "Utilisateur introuvable", providers: [] as string[] };
    }

    const providers = (user.accounts || []).map((a) => a.provider);
    const hasPassword = !!user.password;
    const canChangePassword = hasPassword;
    const reason = hasPassword ? null : "Compte sans mot de passe local (OAuth)";

    return { canChangePassword, reason, providers };
  });
