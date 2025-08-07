"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  required?: boolean;
  label: string;
  placeholder: string;
}

function FormInput({ className, required, label, placeholder, ...props }: FormInputProps) {
  return (
    <FormItem>
      <FormLabel>
        {label}{required && <span className="text-red-500">*</span>}
      </FormLabel>
      <FormControl>
        <Input
          placeholder={placeholder}
          {...props}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

export { FormInput };
