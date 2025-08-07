"use server";

import { revalidatePath } from "next/cache";
import { signOut } from "next-auth/react";

/**
 * Déconnexion de l'utilisateur
 * Cette fonction gère la déconnexion avec les sessions en base de données
 */
export async function logoutAction() {
  try {
    // Déconnexion côté client
    await signOut({ 
      redirect: false,
      callbackUrl: "/login"
    });

    // Revalider les pages pour mettre à jour l'état
    revalidatePath("/");
    revalidatePath("/login");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return { 
      success: false, 
      error: "Erreur lors de la déconnexion" 
    };
  }
} 