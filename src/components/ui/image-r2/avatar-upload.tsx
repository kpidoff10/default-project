"use client";

import * as React from "react";

import { Camera, CircleUserRoundIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useFilesUploader } from "@/hooks/use-files-uploader";

export interface AvatarUploadProps {
  imageUrl?: string | null;
  size?: number; // px
  className?: string;
  onUploaded?: (publicUrl: string) => void | Promise<void>;
}

export default function AvatarUpload({
  imageUrl,
  size = 96,
  className,
  onUploaded,
}: AvatarUploadProps) {
  const { onUpload, isUploading } = useFilesUploader();
  const [localUrl, setLocalUrl] = React.useState<string | null>(null);

  const [state, actions] = useFileUpload({ accept: "image/*" });
  const { files, isDragging } = state;
  const {
    openFileDialog,
    getInputProps,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = actions;

  const currentUrl = localUrl || imageUrl || null;

  const handleSelect = async (file: File) => {
    // Optimistic preview
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
    <div
      className={cn("relative inline-flex", className)}
      style={{ width: size, height: size }}
    >
      {/* Spinner ring while uploading */}
      {isUploading && (
        <div
          className="pointer-events-none absolute -inset-2 rounded-full border-4 border-green-500/60 border-t-transparent animate-spin"
          aria-hidden
        />
      )}

      {/* Drop/Click area styled like Avatar */}
      <button
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-lg outline-none focus-visible:ring-[3px] cursor-pointer",
          "border-dashed has-[img]:border-solid",
          "focus-visible:border-ring focus-visible:ring-ring/50",
          "hover:bg-accent/50 data-[dragging=true]:bg-accent/50",
          "has-disabled:pointer-events-none has-disabled:opacity-50"
        )}
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        aria-label={currentUrl ? "Change image" : "Upload image"}
        style={{ width: size, height: size }}
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div aria-hidden="true">
            <CircleUserRoundIcon className="size-6 opacity-60" />
          </div>
        )}
      </button>

      {/* Camera button to trigger file dialog */}
      <Button
        onClick={openFileDialog}
        variant="outline"
        size="sm"
        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white p-0 hover:bg-gray-50"
        aria-label="Change avatar"
        disabled={isUploading}
      >
        <Camera className="h-4 w-4" />
      </Button>

      {/* Hidden input */}
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload image file"
        tabIndex={-1}
      />
    </div>
  );
}
