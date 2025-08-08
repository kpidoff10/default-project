import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserSession } from "next-auth";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { prisma } from "./prisma";
import { serverConfig } from "./config/server-config";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: serverConfig.auth.providers.google.clientId,
      clientSecret: serverConfig.auth.providers.google.clientSecret,
    }),
    
    // Facebook OAuth (si configuré)
    ...(serverConfig.auth.providers.facebook ? [
      FacebookProvider({
        clientId: serverConfig.auth.providers.facebook.clientId,
        clientSecret: serverConfig.auth.providers.facebook.clientSecret,
      })
    ] : []),
    
    // Apple OAuth (si configuré)
    ...(serverConfig.auth.providers.apple ? [
      AppleProvider({
        clientId: serverConfig.auth.providers.apple.id,
        clientSecret: serverConfig.auth.providers.apple.privateKey,
        authorization: {
          url: "https://appleid.apple.com/auth/authorize",
          params: {
            scope: "name email",
            response_mode: "form_post",
            response_type: "code id_token",
          },
        },
      })
    ] : []),
    
    // Credentials (email/mot de passe)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email || "",
          name: user.name || "",
          image: user.image || "",
          coverImage: user.coverImage || "",
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      let fullUser = null;
      if (user) {
        // Récupérer l'utilisateur complet depuis la base de données
        fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, role: true, firstName: true, lastName: true, bio: true, image: true, coverImage: true }
        });
      }
      return {
        ...session,
        user: {
          ...session.user,
          ...fullUser,
        },
      };
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Les informations de session seront mises à jour via l'API route
      console.log(`Utilisateur connecté: ${user.email}`);
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: serverConfig.auth.secret,
};

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
} 