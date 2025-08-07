import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().max(50, {
    message: "Le prénom ne peut pas dépasser 50 caractères.",
  }).optional().or(z.literal("")),
  lastName: z.string().max(50, {
    message: "Le nom ne peut pas dépasser 50 caractères.",
  }).optional().or(z.literal("")),
  name: z.string().min(3, {
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
  }).optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>; 