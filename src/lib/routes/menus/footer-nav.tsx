import { Route } from "../types";

// Routes Produit
export const productRoutes: Route[] = [
  {
    path: "/products",
    labelKey: "FooterMenu.product.products",
    descriptionKey: "FooterMenu.product.products",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
];

// Routes Fonctionnalités / Entreprise
export const featuresRoutes: Route[] = [
  {
    path: "/features",
    labelKey: "FooterMenu.features.features",
    descriptionKey: "FooterMenu.features.features",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/creators",
    labelKey: "FooterMenu.features.creators",
    descriptionKey: "FooterMenu.features.creators",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/enterprise",
    labelKey: "FooterMenu.features.enterprise",
    descriptionKey: "FooterMenu.features.enterprise",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
];

// Routes À propos et Blog
export const aboutRoutes: Route[] = [
  {
    path: "/about",
    labelKey: "FooterMenu.about.about",
    descriptionKey: "FooterMenu.about.about",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/blog",
    labelKey: "FooterMenu.about.blog",
    descriptionKey: "FooterMenu.about.blog",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
];

// Routes Contact / Légal
export const legalRoutes: Route[] = [
  {
    path: "/contact",
    labelKey: "FooterMenu.legal.contact",
    descriptionKey: "FooterMenu.legal.contact",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/terms",
    labelKey: "FooterMenu.legal.terms",
    descriptionKey: "FooterMenu.legal.terms",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/privacy",
    labelKey: "FooterMenu.legal.privacy",
    descriptionKey: "FooterMenu.legal.privacy",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/cookies",
    labelKey: "FooterMenu.legal.cookies",
    descriptionKey: "FooterMenu.legal.cookies",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/gdpr",
    labelKey: "FooterMenu.legal.gdpr",
    descriptionKey: "FooterMenu.legal.gdpr",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
];

// Routes Support
export const supportRoutes: Route[] = [
  {
    path: "/help",
    labelKey: "FooterMenu.support.help",
    descriptionKey: "FooterMenu.support.help",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
  {
    path: "/support",
    labelKey: "FooterMenu.support.support",
    descriptionKey: "FooterMenu.support.support",
    public: true,
    requiresAuth: false,
    showInNav: false,
  },
];
