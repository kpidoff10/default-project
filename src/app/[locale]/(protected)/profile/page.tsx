"use client";

import { ProfileFormData, profileFormSchema } from "./schemas/profile-schema";

import { Form } from "@/components/ui/form";
import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";
import { useAuth } from "@/providers/auth-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const t = useTranslations("Profile");
  const updateProfile = useUpdateProfile();
  // Initialiser le formulaire avec les données utilisateur
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user as ProfileFormData,
  });

  // Mettre à jour les valeurs du formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      form.reset(user as ProfileFormData);
    }
  }, [user, form]);


  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p>Vous devez être connecté pour accéder à votre profil.</p>
      </div>
    );
  }

  const onSubmit = async (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* En-tête avec image de couverture et photo de profil */}
        <ProfileHeader
          userImage={user?.image}
          userName={user?.name}
        />

        {/* Contenu principal avec onglets */}
        <div className="pt-8">
          <Form {...form}>
            <ProfileTabs />
          </Form>
        </div>

        {/* Bouton de sauvegarde en bas de page */}
        <div className="pt-8 border-t">
          <div className="flex justify-end">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={updateProfile.isPending || !form.formState.isDirty}
              isLoading={updateProfile.isPending}
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              {t("form.saveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
