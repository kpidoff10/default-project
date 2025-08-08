"use client";

import * as React from "react";

import {
  GetPresignedUploadUrlInput,
  getPresignedUploadUrl,
} from "@/lib/actions/protected/files";

import { uploadFileToPresignedUrl } from "@/lib/files/upload-client";

type Folder = GetPresignedUploadUrlInput["folder"];

interface FilesContextValue {
  isUploading: boolean;
  progress: number;
  lastPublicUrl: string | null;
  lastError: string | null;
  onUpload: (
    file: File,
    options?: {
      folder?: Folder;
      onProgress?: (percent: number) => void;
      signal?: AbortSignal;
    }
  ) => Promise<{ key: string; publicUrl?: string } | null>;
  cancel: () => void;
}

const FilesContext = React.createContext<FilesContextValue | undefined>(
  undefined
);

export function FilesProvider({ children }: { children: React.ReactNode }) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [lastPublicUrl, setLastPublicUrl] = React.useState<string | null>(null);
  const [lastError, setLastError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const cancel = React.useCallback(() => {
    abortRef.current?.abort();
    setIsUploading(false);
  }, []);

  const onUpload: FilesContextValue["onUpload"] = React.useCallback(
    async (file, options) => {
      setLastError(null);
      setLastPublicUrl(null);
      setProgress(0);

      if (!file) return null;

      try {
        setIsUploading(true);
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        const folder: Folder = options?.folder ?? "content";
        const presigned = await getPresignedUploadUrl({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          folder,
        });

        if (presigned.validationErrors) {
          const msg = Object.values(presigned.validationErrors).join(", ");
          setLastError(msg);
          return null;
        }
        if (presigned.serverError || !presigned.data) {
          setLastError(presigned.serverError || "Server error");
          return null;
        }

        const { uploadUrl, key, publicUrl } = presigned.data;

        await uploadFileToPresignedUrl(file, uploadUrl, {
          signal: options?.signal ?? abortRef.current.signal,
          onProgress: ({ percent }) => {
            const p = percent ?? 0;
            setProgress(p);
            options?.onProgress?.(p);
          },
        });

        setLastPublicUrl(publicUrl || null);
        return { key, publicUrl };
      } catch (e: any) {
        setLastError(e?.message || "Upload error");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const value: FilesContextValue = React.useMemo(
    () => ({
      isUploading,
      progress,
      lastPublicUrl,
      lastError,
      onUpload,
      cancel,
    }),
    [isUploading, progress, lastPublicUrl, lastError, onUpload, cancel]
  );

  return (
    <FilesContext.Provider value={value}>{children}</FilesContext.Provider>
  );
}

export function useFiles() {
  const ctx = React.useContext(FilesContext);
  if (!ctx) throw new Error("useFiles must be used within <FilesProvider>");
  return ctx;
}
