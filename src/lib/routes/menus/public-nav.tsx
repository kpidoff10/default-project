import { Info, Package, Users } from "lucide-react";

import { Route } from "../types";

export const publicNavRoutes: Route[] = [
  {
    path: "/creators",
    labelKey: "Navigation.creators",
    descriptionKey: "Navigation.creators",
    icon: Users,
    public: true,
    requiresAuth: false,
    showInNav: true,
  },
  {
    path: "/products",
    labelKey: "Navigation.products",
    descriptionKey: "Navigation.products",
    icon: Package,
    public: true,
    requiresAuth: false,
    showInNav: true,
  },
  {
    path: "/about",
    labelKey: "Navigation.about",
    descriptionKey: "Navigation.about",
    icon: Info,
    public: true,
    requiresAuth: false,
    showInNav: true,
  },
];
