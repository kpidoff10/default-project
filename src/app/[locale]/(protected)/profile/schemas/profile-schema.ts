import { z } from "zod";

// Factory de schéma avec i18n
export function createProfileFormSchema(
  t: (key: string, values?: any) => string
) {
  return z.object({
    firstName: z
      .string()
      .max(50, { message: t("Validation.Profile.firstName.max", { max: 50 }) })
      .optional()
      .or(z.literal("")),
    lastName: z
      .string()
      .max(50, { message: t("Validation.Profile.lastName.max", { max: 50 }) })
      .optional()
      .or(z.literal("")),
    name: z
      .string()
      .min(3, { message: t("Validation.Profile.name.min", { min: 3 }) })
      .max(30, { message: t("Validation.Profile.name.max", { max: 30 }) })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: t("Validation.Profile.name.regex"),
      }),
    email: z.string().email({ message: t("Validation.Profile.email.invalid") }),
    bio: z
      .string()
      .max(500, { message: t("Validation.Profile.bio.max", { max: 500 }) })
      .optional()
      .or(z.literal("")),
  });
}

export type ProfileFormData = z.infer<ReturnType<typeof createProfileFormSchema>>;