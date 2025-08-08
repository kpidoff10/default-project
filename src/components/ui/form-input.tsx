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
  // Contrôle de la transformation du texte saisi
  // none: aucune transformation
  // first: première lettre en majuscule
  // uppercase: tout en majuscules
  textTransform?: "none" | "first" | "uppercase";
}

function FormInput({
  className,
  required,
  label,
  placeholder,
  errorDisplay = "label",
  textTransform = "none",
  ...props
}: FormInputProps) {
  const { error } = useFormField();
  const [isTouch, setIsTouch] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isComposing, setIsComposing] = React.useState(false);

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
              textTransform === "uppercase" && "uppercase",
              className
            )}
            placeholder={placeholder}
            {...props}
            onInput={(e) => {
              // Ne pas interférer avec l'IME en cours de composition
              if (isComposing || textTransform === "none") {
                props.onInput?.(e);
                return;
              }

              const el = e.currentTarget as HTMLInputElement;
              const originalValue = el.value;
              let nextValue = originalValue;

              if (textTransform === "uppercase") {
                nextValue = originalValue.toUpperCase();
              } else if (
                textTransform === "first" &&
                originalValue.length > 0
              ) {
                nextValue =
                  originalValue.charAt(0).toUpperCase() +
                  originalValue.slice(1);
              }

              if (nextValue !== originalValue) {
                const selectionStart = el.selectionStart;
                const selectionEnd = el.selectionEnd;
                el.value = nextValue;
                try {
                  if (selectionStart != null && selectionEnd != null) {
                    el.setSelectionRange(selectionStart, selectionEnd);
                  }
                } catch {}
              }

              props.onInput?.(e);
            }}
            onCompositionStart={(e) => {
              setIsComposing(true);
              props.onCompositionStart?.(e);
            }}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              // À la fin de la composition, applique une dernière transformation si nécessaire
              if (textTransform !== "none") {
                const el = e.currentTarget as HTMLInputElement;
                const originalValue = el.value;
                let nextValue = originalValue;

                if (textTransform === "uppercase") {
                  nextValue = originalValue.toUpperCase();
                } else if (
                  textTransform === "first" &&
                  originalValue.length > 0
                ) {
                  nextValue =
                    originalValue.charAt(0).toUpperCase() +
                    originalValue.slice(1);
                }

                if (nextValue !== originalValue) {
                  el.value = nextValue;
                }
              }
              props.onCompositionEnd?.(e);
            }}
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
