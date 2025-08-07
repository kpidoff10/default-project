import { LogIn, UserPlus } from "lucide-react";

import { Route } from "../types";

export const authPagesRoutes: Route[] = [
  {
    path: "/login",
    labelKey: "AuthPages.login",
    descriptionKey: "AuthPages.login",
    icon: LogIn,
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/register",
    labelKey: "AuthPages.register",
    descriptionKey: "AuthPages.register",
    icon: UserPlus,
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
];
