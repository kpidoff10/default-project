"use server";

import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

/**
 * Récupère l'utilisateur actuel depuis la session
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Récupère l'ID de l'utilisateur actuel
 */
export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id;
}

/**
 * Hash un mot de passe avec bcrypt
 */
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

/**
 * Vérifie un mot de passe avec bcrypt
 */
export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Vérifie si un utilisateur existe avec cet email
 */
export async function isUserExists(email: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  return !!user;
}

/**
 * Vérifie si un nom d'utilisateur existe
 */
export async function isUsernameExists(name: string) {
  const user = await prisma.user.findFirst({
    where: { name }
  });
  return !!user;
} 