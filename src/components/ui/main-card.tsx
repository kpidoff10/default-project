import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import React from "react";

interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
}

interface MainCardProps {
  title?: string;
  description?: string;
  actions?: ActionItem[];
  children: React.ReactNode;
}

export default function MainCard({
  title,
  description,
  actions,
  children,
}: MainCardProps) {
  return (
    <div className="container mx-auto py-8 px-2 md:px-0">
      <div className="max-w-6xl mx-auto space-y-8">
        {(title || description || actions) && (
          <div className="flex items-center justify-between pt-20 pb-8">
            <div>
              {title && <h1 className="text-3xl font-bold">{title}</h1>}
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            {actions && actions.length > 0 && (
              <>
                {/* Desktop: Affichage des boutons */}
                <div className="hidden md:flex items-center gap-2">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={action.onClick}
                      disabled={action.disabled || action.isLoading}
                    >
                      {action.isLoading ? (
                        <span className="mr-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </span>
                      ) : (
                        action.icon && (
                          <span className="mr-2">{action.icon}</span>
                        )
                      )}
                      {action.label}
                    </Button>
                  ))}
                </div>

                {/* Mobile: Menu dropdown */}
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={action.onClick}
                          disabled={action.disabled}
                          isLoading={action.isLoading}
                        >
                          {action.icon && (
                            <span className="mr-2">{action.icon}</span>
                          )}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
