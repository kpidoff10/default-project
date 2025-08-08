"use client";

import * as React from "react";

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

import { AlertCircle } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  required?: boolean;
  label: string;
  placeholder: string;
  errorDisplay?: "tooltip" | "label";
}

function FormInput({
  className,
  required,
  label,
  placeholder,
  errorDisplay = "label",
  ...props
}: FormInputProps) {
  const { error } = useFormField();
  const [isTouch, setIsTouch] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // Détecte les dispositifs à pointeur grossier (ex: mobile)
    if (typeof window !== "undefined" && "matchMedia" in window) {
      try {
        const mq = window.matchMedia("(pointer: coarse)");
        setIsTouch(mq.matches);
      } catch {
        setIsTouch(false);
      }
    }
  }, []);

  return (
    <FormItem>
      <div className="flex items-center justify-between gap-2">
        <FormLabel>
          {label}
          {required && <span className="text-red-500">*</span>}
        </FormLabel>
        {errorDisplay === "label" && error && (
          <span className="text-destructive text-xs">
            {String(error?.message ?? "")}
          </span>
        )}
      </div>
      <FormControl>
        <div className="relative">
          <Input
            className={cn(
              error && errorDisplay === "tooltip" && "pr-10",
              className
            )}
            placeholder={placeholder}
            {...props}
          />
          {error && errorDisplay === "tooltip" && (
            <Tooltip {...(isTouch ? { open, onOpenChange: setOpen } : {})}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-destructive cursor-help"
                  aria-label={String(error?.message ?? "")}
                  onClick={(e) => {
                    if (isTouch) {
                      e.preventDefault();
                      setOpen((v) => !v);
                    }
                  }}
                >
                  <AlertCircle className="size-4" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                {String(error?.message ?? "")}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </FormControl>
      {/* Conserve le message pour l'accessibilité via aria-describedby, mais caché visuellement */}
      <FormMessage className="sr-only" />
    </FormItem>
  );
}

export { FormInput };
