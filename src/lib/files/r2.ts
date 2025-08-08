import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { serverConfig } from "@/lib/config/server-config";

// Initialise un client S3 compatible Cloudflare R2
export const r2Client = (() => {
  const cfg = serverConfig.storage.r2;
  if (!cfg) {
    throw new Error("R2 storage is not configured");
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });
})();

export async function createPresignedPutUrl(params: {
  bucket: string;
  key: string;
  contentType: string;
  expiresIn?: number; // seconds
}) {
  const { bucket, key, contentType, expiresIn = 900 } = params;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });
  return uploadUrl;
}

export function getR2PublicUrl(key: string): string | undefined {
  const cfg = serverConfig.storage.r2;
  if (!cfg?.publicUrl) return undefined;
  return `${cfg.publicUrl.replace(/\/$/, "")}/${key}`;
}


