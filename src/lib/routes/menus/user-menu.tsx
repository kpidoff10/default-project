import { Settings, Shield, User } from "lucide-react";

import { Route } from "../types";

export const userMenuRoutes: Route[] = [
  {
    path: "/dashboard",
    labelKey: "UserMenu.dashboard",
    descriptionKey: "UserMenu.dashboard",
    icon: User,
    public: false,
    requiresAuth: true,
    showInNav: false,
  },
  {
    path: "/profile",
    labelKey: "UserMenu.profile",
    descriptionKey: "UserMenu.profile",
    icon: Settings,
    public: false,
    requiresAuth: true,
    showInNav: false,
  },
  {
    path: "/sessions",
    labelKey: "UserMenu.sessions",
    descriptionKey: "UserMenu.sessions",
    icon: Shield,
    public: false,
    requiresAuth: true,
    showInNav: false,
  },
];
