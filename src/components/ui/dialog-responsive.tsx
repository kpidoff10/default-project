"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DialogResponsiveProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogResponsiveHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogResponsiveTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogResponsiveDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogResponsiveContentProps {
  children: React.ReactNode;
  className?: string;
  drawerHeight?: string;
}

interface DialogResponsiveFooterProps {
  children: React.ReactNode;
  className?: string;
}

function DialogResponsive({
  children,
  trigger,
  open,
  onOpenChange,
}: DialogResponsiveProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        {children}
      </Dialog>
    );
  }

  // Mobile: Render Drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      {children}
    </Drawer>
  );
}

function DialogResponsiveHeader({
  children,
  className,
}: DialogResponsiveHeaderProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogHeader className={`${className} relative z-0`}>
        {children}
        <Separator />
      </DialogHeader>
    );
  }

  // Mobile: Use DrawerHeader with border-bottom separator
  return (
    <DrawerHeader className={`${className} border-b border-border`}>
      {children}
    </DrawerHeader>
  );
}

function DialogResponsiveTitle({
  children,
  className,
}: DialogResponsiveTitleProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <DialogTitle className={className}>{children}</DialogTitle>;
  }

  // Mobile: Use DrawerTitle
  return <DrawerTitle className={className}>{children}</DrawerTitle>;
}

function DialogResponsiveDescription({
  children,
  className,
}: DialogResponsiveDescriptionProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogDescription className={className}>{children}</DialogDescription>
    );
  }

  // Mobile: Render as p with italic and left alignment
  return (
    <p className={cn("text-muted-foreground text-sm text-left", className)}>
      {children}
    </p>
  );
}

function DialogResponsiveContent({
  children,
  className,
  drawerHeight = "60%",
}: DialogResponsiveContentProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <DialogContent className={`${className} [&>button]:hidden`}>
        {/* Description cachée pour l'accessibilité */}
        <DialogDescription className="sr-only">
          Contenu du dialogue
        </DialogDescription>
        {children}
      </DialogContent>
    );
  }

  // Mobile: Use DrawerContent with custom height and padding
  return (
    <DrawerContent
      className={`${className} px-1`}
      style={{ height: drawerHeight }}
    >
      {children}
    </DrawerContent>
  );
}

function DialogResponsiveFooter({
  children,
  className,
}: DialogResponsiveFooterProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <>
        <Separator />
        <DialogFooter className={className}>{children}</DialogFooter>
      </>
    );
  }

  // Mobile: Render as div with pt-5 for buttons and border-top separator
  return (
    <div className={`${className} pt-5 pb-3 border-t border-border`}>{children}</div>
  );
}

export {
  DialogResponsive,
  DialogResponsiveHeader,
  DialogResponsiveTitle,
  DialogResponsiveDescription,
  DialogResponsiveContent,
  DialogResponsiveFooter,
};
