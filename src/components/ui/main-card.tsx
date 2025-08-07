import React from "react";
import { useTranslations } from "next-intl";

interface MainCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function MainCard({
  title,
  description,
  children,
}: MainCardProps) {
  const t = useTranslations("Profile");
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {(title || description) && (
          <div className="flex items-center justify-between pt-20 pb-8">
            <div>
              {title && <h1 className="text-3xl font-bold">{title}</h1>}
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
