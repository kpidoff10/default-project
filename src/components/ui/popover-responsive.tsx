"use client";

import * as React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface PopoverResponsiveProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function PopoverResponsive({
  trigger,
  children,
  title,
  className,
  side = "bottom",
  align = "center",
}: PopoverResponsiveProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          className={cn("w-80", className)}
          side={side}
          align={align}
        >
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="h-auto max-h-[60vh]">
        <DrawerHeader className="pb-4">
          <DrawerTitle className="text-left">{title || ""}</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">{children}</div>
      </DrawerContent>
    </Drawer>
  );
}
