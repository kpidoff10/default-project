import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }).max(50, {
    message: "Le prénom ne peut pas dépasser 50 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }).max(50, {
    message: "Le nom ne peut pas dépasser 50 caractères.",
  }),
  username: z.string().min(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères.",
  }).max(30, {
    message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères.",
  }).regex(/^[a-zA-Z0-9_-]+$/, {
    message: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  bio: z.string().max(500, {
    message: "La bio ne peut pas dépasser 500 caractères.",
  }).optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>; 