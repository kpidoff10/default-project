"use client";

import { ProfileFormData, profileFormSchema } from "./schemas/profile-schema";

import { Form } from "@/components/ui/form";
import { ProfileHeader } from "./components/profile-header";
import { ProfileTabs } from "./components/profile-tabs";
import { useAuth } from "@/providers/auth-provider";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // Initialiser le formulaire avec les données utilisateur
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ").slice(1).join(" ") || "",
      email: user?.email || "",
      username: user?.name?.toLowerCase().replace(/\s+/g, "") || "",
      bio: "",
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p>Vous devez être connecté pour accéder à votre profil.</p>
      </div>
    );
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Simulation d'une sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Données du formulaire:", data);

      setIsSaving(false);
      setSaveStatus("success");

      // Réinitialiser le statut après 3 secondes
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setIsSaving(false);
      setSaveStatus("error");

      // Réinitialiser le statut après 3 secondes
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleCancel = () => {
    form.reset();
    setSaveStatus("idle");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* En-tête avec image de couverture et photo de profil */}
        <ProfileHeader
          isSaving={isSaving}
          saveStatus={saveStatus}
          onSave={form.handleSubmit(onSubmit)}
          onCancel={handleCancel}
          userImage={user?.image}
          userName={user?.name}
        />

        {/* Contenu principal avec onglets */}
        <div className="pt-8">
          <Form {...form}>
            <ProfileTabs />
          </Form>
        </div>
      </div>
    </div>
  );
}
