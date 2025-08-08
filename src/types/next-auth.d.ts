import NextAuth from "next-auth"
import { User as UserPrisma } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: User
  }

  type UserSession  = Pick<UserPrisma, "id" | "email" | "name" | "image" | "coverImage" | "role" | "firstName" | "lastName" | "bio">
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
} 