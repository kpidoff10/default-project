import { LucideIcon } from "lucide-react";

export interface Route {
  path: string;
  labelKey: string;
  descriptionKey?: string;
  icon?: LucideIcon;
  public: boolean;
  requiresAuth: boolean;
  roles?: string[];
  showInNav: boolean;
}

export interface MenuItem {
  path: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  children?: MenuItem[];
} 