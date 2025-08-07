"use client";

import * as React from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TransitionPanel } from "@/components/ui/transition-panel";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TabsResponsiveProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsResponsiveListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsResponsiveTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsResponsiveContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabsResponsive({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: TabsResponsiveProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  // Extract content children for TransitionPanel
  const contentChildren = React.useMemo(() => {
    const contents: React.ReactElement[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === TabsResponsiveContent) {
        contents.push(child);
      }
    });
    return contents;
  }, [children]);

  // Find active index
  const activeIndex = React.useMemo(() => {
    return contentChildren.findIndex(
      (child) =>
        (child as React.ReactElement<TabsResponsiveContentProps>).props
          .value === selectedValue
    );
  }, [contentChildren, selectedValue]);

  // Animation variants
  const variants = {
    enter: {
      opacity: 0,
      x: 20,
      scale: 0.95,
    },
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.95,
    },
  };

  if (isDesktop) {
    return (
      <Tabs
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        className={className}
      >
        {children}
      </Tabs>
    );
  }

  // Mobile: Render Select with TransitionPanel
  return (
    <div className={className}>
      <Select value={selectedValue} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {React.Children.map(children, (child) => {
            if (
              React.isValidElement(child) &&
              child.type === TabsResponsiveList
            ) {
              return React.Children.map(
                (child as React.ReactElement<TabsResponsiveListProps>).props
                  .children,
                (triggerChild) => {
                  if (
                    React.isValidElement(triggerChild) &&
                    triggerChild.type === TabsResponsiveTrigger
                  ) {
                    const triggerProps =
                      triggerChild as React.ReactElement<TabsResponsiveTriggerProps>;
                    return (
                      <SelectItem
                        key={triggerProps.props.value}
                        value={triggerProps.props.value}
                      >
                        {triggerProps.props.children}
                      </SelectItem>
                    );
                  }
                  return null;
                }
              );
            }
            return null;
          })}
        </SelectContent>
      </Select>

      {/* Render content with TransitionPanel */}
      <TransitionPanel
        activeIndex={activeIndex}
        className="mt-4"
        variants={variants}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
          duration: 0.3,
        }}
      >
        {contentChildren.map((child, index) => {
          const contentProps =
            child as React.ReactElement<TabsResponsiveContentProps>;
          return (
            <div key={index} className={contentProps.props.className}>
              {contentProps.props.children}
            </div>
          );
        })}
      </TransitionPanel>
    </div>
  );
}

function TabsResponsiveList({ className, children }: TabsResponsiveListProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <TabsList className={className}>{children}</TabsList>;
  }

  // Mobile: Don't render anything here, handled by Select above
  return null;
}

function TabsResponsiveTrigger({
  value,
  className,
  children,
}: TabsResponsiveTriggerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <TabsTrigger value={value} className={className}>
        {children}
      </TabsTrigger>
    );
  }

  // Mobile: Don't render anything here, handled by Select above
  return null;
}

function TabsResponsiveContent({
  value,
  className,
  children,
}: TabsResponsiveContentProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <TabsContent value={value} className={className}>
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.2,
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </TabsContent>
    );
  }

  // Mobile: Don't render anything here, handled by TransitionPanel above
  return null;
}

export {
  TabsResponsive,
  TabsResponsiveList,
  TabsResponsiveTrigger,
  TabsResponsiveContent,
};
