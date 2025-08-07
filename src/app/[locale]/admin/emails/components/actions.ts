"use server";

import { EmailService } from "@/lib/email/service";
import { getTranslations } from "next-intl/server";
import { resend } from "@/lib/email/config";
import { z } from "zod";

// Schéma de validation pour le test d'email
const testEmailSchema = z.object({
  email: z.string().email("Email invalide"),
});

export async function testEmailTemplate(formData: z.infer<typeof testEmailSchema>) {
  try {
    // Validation des données
    const validatedData = testEmailSchema.parse(formData);
    
    console.log("🔍 Test de connexion email...", {
      to: validatedData.email,
    });

    // Envoi de l'email de test de connexion
    await EmailService.sendTestConnectionEmail({
      to: validatedData.email,
    });

    console.log("✅ Email de test envoyé avec succès!");

    // Récupération des traductions
    const t = await getTranslations("Admin.Emails");

    return {
      success: true,
      message: t("result.success", { 
        template: "test-connection",
        email: validatedData.email 
      }),
    };

  } catch (error) {
    console.error("❌ Erreur lors du test d'email:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: `Erreur de validation: ${error.issues.map((e: any) => e.message).join(", ")}`,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: `Erreur: ${error.message}`,
      };
    }

    return {
      success: false,
      message: "Une erreur inattendue s'est produite",
    };
  }
}

export async function testResendConnection() {
    try {
      console.log("🔍 Test de connexion Resend...");
      
      // Test simple d'envoi d'email (la clé est restreinte)
      const testEmail = await resend.emails.send({
        from: "noreply@cloaky.me",
        to: ["test@example.com"],
        subject: "Test de connexion Resend",
        html: "<p>Ceci est un test de connexion Resend.</p>",
      });
      
      console.log("✅ Test d'envoi Resend réussi:", testEmail);
      
      return {
        success: true,
        message: "Connexion Resend réussie ! L'API peut envoyer des emails.",
        domains: [],
      };
      
    } catch (error) {
      console.error("❌ Erreur de connexion Resend:", error);
      
      return {
        success: false,
        message: `Erreur de connexion Resend: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
      };
    }
  } 