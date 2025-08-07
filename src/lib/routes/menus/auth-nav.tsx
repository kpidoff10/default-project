import { DollarSign, Folder, Shield, Upload } from "lucide-react";

import { Route } from "../types";

export const authNavRoutes: Route[] = [
  {
    path: "/upload",
    labelKey: "AuthMenu.upload",
    descriptionKey: "AuthMenu.upload",
    icon: Upload,
    public: false,
    requiresAuth: true,
    roles: ["creator", "admin"],
    showInNav: true,
  },
  {
    path: "/my-content",
    labelKey: "AuthMenu.myContent",
    descriptionKey: "AuthMenu.myContent",
    icon: Folder,
    public: false,
    requiresAuth: true,
    roles: ["creator", "admin"],
    showInNav: true,
  },
  {
    path: "/earnings",
    labelKey: "AuthMenu.earnings",
    descriptionKey: "AuthMenu.earnings",
    icon: DollarSign,
    public: false,
    requiresAuth: true,
    roles: ["creator", "admin"],
    showInNav: true,
  },
  {
    path: "/admin",
    labelKey: "AuthMenu.admin",
    descriptionKey: "AuthMenu.admin",
    icon: Shield,
    public: false,
    requiresAuth: true,
    roles: ["admin"],
    showInNav: true,
  },
];
