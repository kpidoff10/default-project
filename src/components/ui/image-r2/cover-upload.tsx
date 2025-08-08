"use client";

import * as React from "react";

import { AlertCircleIcon, Image as ImageIcon, ImageUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useFilesUploader } from "@/hooks/use-files-uploader";
import { useTranslations } from "next-intl";

interface CoverUploadProps {
  imageUrl?: string | null;
  className?: string;
  onUploaded?: (publicUrl: string) => void | Promise<void>;
  maxSizeMB?: number;
}

export default function CoverUpload({
  imageUrl,
  className,
  onUploaded,
  maxSizeMB = 5,
}: CoverUploadProps) {
  const t = useTranslations("Profile");
  const tc = useTranslations("Profile.coverUpload");
  const maxSize = maxSizeMB * 1024 * 1024;
  const { onUpload, isUploading } = useFilesUploader();

  const [state, actions] = useFileUpload({ accept: "image/*", maxSize });
  const { files, isDragging, errors } = state;
  const {
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    getInputProps,
  } = actions;

  const [localUrl, setLocalUrl] = React.useState<string | null>(null);
  const currentUrl = localUrl || imageUrl || null;

  const handleSelect = async (file: File) => {
    setLocalUrl(URL.createObjectURL(file));
    const res = await onUpload(file, { folder: "content" });
    if (res?.publicUrl) {
      setLocalUrl(res.publicUrl);
      await onUploaded?.(res.publicUrl);
    }
  };

  React.useEffect(() => {
    const f = files[0]?.file;
    if (f && f instanceof File) {
      void handleSelect(f);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {/* Drop area fills container */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className={cn(
          "border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50",
          "relative flex h-full w-full items-center justify-center transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px] cursor-pointer",
          !currentUrl && "bg-gradient-to-r from-blue-500 to-purple-600"
        )}
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload file"
        />
        {currentUrl ? (
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUrl}
              alt="cover"
              className="size-full object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-6 text-center text-white">
            <div className="relative mb-3">
              <div
                className="absolute inset-0 rounded-full bg-white/20 blur-md"
                aria-hidden="true"
              />
              <div className="relative flex size-12 items-center justify-center rounded-full border border-white/40 bg-white/10">
                <ImageUpIcon className="size-5 opacity-90" />
              </div>
            </div>
            <p className="mb-1.5 text-sm font-semibold drop-shadow">
              {tc("title")}
            </p>
            <p className="text-xs opacity-90 drop-shadow">
              {tc("description")}
            </p>
            <p className="mt-1 text-[11px] opacity-80 drop-shadow">
              {tc("maxSize", { max: maxSizeMB })}
            </p>
          </div>
        )}
        {/* overlay au-dessus de l'image mais sous le bouton */}
        {currentUrl && (
          <div className="absolute inset-0 z-10 bg-black/10 pointer-events-none" />
        )}

        {/* Spinner overlay while uploading */}
        {isUploading && (
          <div className="absolute inset-0 z-40 grid place-items-center bg-black/20">
            <div className="size-10 rounded-full border-4 border-green-500/70 border-t-transparent animate-spin" />
          </div>
        )}

        {/* Bouton changer la couverture */}
        <div className="absolute bottom-4 right-4 z-30">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {t("header.changeCover")}
          </Button>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 p-2 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
