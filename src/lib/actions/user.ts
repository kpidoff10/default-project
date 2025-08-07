"use server";

import { authActionClient } from "@/lib/create-safe-action";
import { profileFormSchema } from "@/app/[locale]/(protected)/profile/schemas/profile-schema";
import { prisma } from "@/lib/prisma";

export const updateProfile = authActionClient
  .metadata({ actionName: "updateProfile" })
  .inputSchema(profileFormSchema)
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
        role: true,
        bio: true,
        firstName: true,
        lastName: true,
      },
    });

    return updatedUser;
  });
