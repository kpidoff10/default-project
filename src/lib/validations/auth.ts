import { z } from "zod"

// Factories de schémas avec i18n
export function createLoginSchema(t: (key: string, values?: any) => string) {
  return z.object({
    email: z.string().email(t("Validation.Auth.email.invalid")),
    password: z.string().min(6, t("Validation.Auth.password.min", { min: 6 })),
  })
}

export function createRegisterSchema(t: (key: string, values?: any) => string) {
  return z.object({
    name: z.string().min(2, t("Validation.Auth.name.min", { min: 2 })),
    email: z.string().email(t("Validation.Auth.email.invalid")),
    password: z.string().min(6, t("Validation.Auth.password.min", { min: 6 })),
    username: z
      .string()
      .min(3, t("Validation.Auth.username.min", { min: 3 }))
      .regex(/^[a-zA-Z0-9_]+$/, t("Validation.Auth.username.regex")),
  })
}

export function createUpdateProfileSchema(t: (key: string, values?: any) => string) {
  return z.object({
    name: z.string().min(2, t("Validation.Auth.name.min", { min: 2 })).optional(),
    bio: z.string().max(500, t("Validation.Auth.bio.max", { max: 500 })).optional(),
    username: z
      .string()
      .min(3, t("Validation.Auth.username.min", { min: 3 }))
      .regex(/^[a-zA-Z0-9_]+$/, t("Validation.Auth.username.regex"))
      .optional(),
  })
}

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>
export type UpdateProfileInput = z.infer<ReturnType<typeof createUpdateProfileSchema>>