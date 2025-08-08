"use client";

import { updateProfile, updateProfileCover, updateProfileImage } from "@/lib/actions/protected/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ProfileFormData } from "@/app/[locale]/(protected)/profile/schemas/profile-schema";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import { useTranslations } from "next-intl";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();
  const t = useTranslations("Profile");

  return useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const result = await updateProfile(data);
      
      if (result.validationErrors) {
        throw new Error(Object.values(result.validationErrors).join(", "));
      }
      
      if (result.serverError) {
        throw new Error(result.serverError);
      }
      
      return result.data;
    },
    onSuccess: (updatedUser) => {
      // Invalider le cache utilisateur
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      
      // Mettre à jour le cache avec les nouvelles données
      queryClient.setQueryData(["user", user?.id], updatedUser);
      
      // Mettre à jour l'utilisateur dans le contexte d'authentification
      if (updateUser && updatedUser) {
        updateUser(updatedUser);
      }
      
      toast.success(t("form.changesSaved"));
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error(error.message || t("form.errorSaving"));
    },
  });
}


export function useUpdateProfileImage() {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();
  const t = useTranslations("Profile");

  return useMutation({
    mutationFn: async (imageUrl: string) => {
      const result = await updateProfileImage({
        imageUrl,
      });
      
      if (result.validationErrors) {
        throw new Error(Object.values(result.validationErrors).join(", "));
      }
      
      if (result.serverError) {
        throw new Error(result.serverError);
      }
      
      return result.data;
    },
    onSuccess: (updatedUser) => {
      // Invalider le cache utilisateur
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      
      // Mettre à jour le cache avec les nouvelles données
      queryClient.setQueryData(["user", user?.id], updatedUser);
      
      // Mettre à jour l'utilisateur dans le contexte d'authentification
      if (updateUser && updatedUser) {
        updateUser(updatedUser);
      }
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'image:", error);
      toast.error(error.message || t("form.errorSaving"));
    },
  });
}

export function useUpdateProfileCover() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const t = useTranslations("Profile");

  return useMutation({
    mutationFn: async (imageUrl: string) => {
      const result = await updateProfileCover({
        imageUrl,
      });
      
      if (result.validationErrors) {
        throw new Error(Object.values(result.validationErrors).join(", "));
      }
      
      if (result.serverError) {
        throw new Error(result.serverError);
      }
      
      return result.data;
    },
    onSuccess: (updatedUser) => {
      // Invalider le cache utilisateur
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      
      // Mettre à jour le cache avec les nouvelles données
      queryClient.setQueryData(["user", user?.id], updatedUser);
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'image:", error);
      toast.error(error.message || t("form.errorSaving"));
    },
  });
}