"use server";

import { createPresignedPutUrl, getR2PublicUrl } from "@/lib/files/r2";

import { authActionClient } from "@/lib/create-safe-action";
import { serverConfig } from "@/lib/config/server-config";
import { z } from "zod";

const inputSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.enum(["content", "content/blurred"]).default("content"),
});

export type GetPresignedUploadUrlInput = z.infer<typeof inputSchema>;

export const getPresignedUploadUrl = authActionClient
  .metadata({ actionName: "getPresignedUploadUrl" })
  .inputSchema(inputSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const r2 = serverConfig.storage.r2;
    if (!r2) {
      throw new Error("R2 storage is not configured");
    }

    const { fileName, contentType, folder } = parsedInput;

    // Génère une clé sûre en préservant l'extension
    const safeBase = fileName
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();
    const ext = safeBase.includes(".") ? `.${safeBase.split(".").pop()}` : "";
    const uid = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const objectKey = `users/${userId}/${folder}/${uid}${ext}`;

    try {
      const uploadUrl = await createPresignedPutUrl({
        bucket: r2.bucketName,
        key: objectKey,
        contentType,
        expiresIn: 900, // 15 min
      });

      const publicUrl = getR2PublicUrl(objectKey);

      return { uploadUrl, key: objectKey, publicUrl };
    } catch (e) {
      console.error("Erreur présignature R2:", e);
      throw new Error("Impossible de générer l'URL d'upload");
    }
  });


