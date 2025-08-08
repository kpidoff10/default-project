"use client";

import {
  ProfileFormData,
  createProfileFormSchema,
} from "./schemas/profile-schema";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import MainCard from "@/components/ui/main-card";
import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";
import { Save } from "lucide-react";
import SaveButton from "@/components/ui/save-button";
import { useAuth } from "@/providers/auth-provider";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useUpdateProfile } from "@/hooks/use-profile";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const t = useTranslations();
  const updateProfile = useUpdateProfile();
  // Initialiser le formulaire avec les données utilisateur
  const schema = useMemo(() => createProfileFormSchema(t), [t]);
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: user as ProfileFormData,
  });

  // Mettre à jour les valeurs du formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      form.reset(user as ProfileFormData);
    }
  }, [user, form]);

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  return (
    <MainCard>
      {/* En-tête avec image de couverture et photo de profil */}
      <ProfileHeader userImage={user?.image} userName={user?.name} />

      {/* Contenu principal avec onglets */}

      <Form {...form}>
        <ProfileTabs />
      </Form>

      {/* Bouton de sauvegarde en bas de page */}
      <SaveButton
        onSubmit={form.handleSubmit(onSubmit)}
        isLoading={updateProfile.isPending}
        isDisabled={updateProfile.isPending || !form.formState.isDirty}
      />
    </MainCard>
  );
}
