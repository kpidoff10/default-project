import { z } from "zod";

export const updateProfileImageInput = z.object({
    imageUrl: z.string().url(),
  });
  
  export const updateProfileCoverInput = z.object({
    imageUrl: z.string().url(),
  });
  

export type ChangePasswordFormValues = z.infer<typeof changePasswordInput>;
export const changePasswordInput = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  });
  