import { MenuItem, Route } from "./types";
import {
  authNavRoutes,
  authPagesRoutes,
  publicNavRoutes,
  userMenuRoutes
} from "./menus";

export class RouteManager {
  private static routes: Route[] = [
    // Page d'accueil
    {
      path: "/",
      label: "Accueil",
      description: "Page d'accueil",
      public: true,
      requiresAuth: false,
      showInNav: false,
    },
    
    // Routes publiques
    ...publicNavRoutes,
    ...authPagesRoutes,
    
    // Routes protégées
    ...authNavRoutes,
    ...userMenuRoutes,
  ];

  /**
   * Déduplique les routes en gardant la première occurrence
   */
  private static deduplicateRoutes(routes: Route[]): Route[] {
    const seen = new Set<string>();
    return routes.filter(route => {
      if (seen.has(route.path)) {
        return false;
      }
      seen.add(route.path);
      return true;
    });
  }

  /**
   * Récupère toutes les routes (dédupliquées)
   */
  static getAllRoutes(): Route[] {
    return this.deduplicateRoutes(this.routes);
  }

  /**
   * Récupère les routes publiques
   */
  static getPublicRoutes(): Route[] {
    return this.deduplicateRoutes(this.routes.filter(route => route.public));
  }

  /**
   * Récupère les routes protégées
   */
  static getProtectedRoutes(): Route[] {
    return this.deduplicateRoutes(this.routes.filter(route => !route.public));
  }

  /**
   * Récupère les routes visibles dans la navigation
   */
  static getNavRoutes(isAuthenticated: boolean = false, userRole?: string): Route[] {
    const filteredRoutes = this.routes.filter(route => {
      // Route doit être visible dans la nav
      if (!route.showInNav) return false;

      // Si route publique, toujours visible
      if (route.public) return true;

      // Si route protégée, vérifier l'authentification et les rôles
      if (route.requiresAuth && !isAuthenticated) return false;

      // Vérifier les rôles si spécifiés
      if (route.roles && userRole) {
        return route.roles.includes(userRole);
      }

      // Si pas de rôles spécifiés, accessible à tous les utilisateurs connectés
      return isAuthenticated;
    });

    return this.deduplicateRoutes(filteredRoutes);
  }

  /**
   * Récupère les routes pour le menu utilisateur
   */
  static getUserMenuRoutes(isAuthenticated: boolean = false, userRole?: string): Route[] {
    const filteredRoutes = this.routes.filter(route => {
      // Routes du menu utilisateur (dashboard, profile, etc.)
      return route.requiresAuth && isAuthenticated && !route.showInNav;
    });

    return this.deduplicateRoutes(filteredRoutes);
  }

  /**
   * Vérifie si une route est accessible
   */
  static isRouteAccessible(path: string, isAuthenticated: boolean = false, userRole?: string): boolean {
    const route = this.routes.find(r => r.path === path);
    if (!route) return false;

    // Route publique toujours accessible
    if (route.public) return true;

    // Route protégée nécessite une authentification
    if (route.requiresAuth && !isAuthenticated) return false;

    // Vérifier les rôles si spécifiés
    if (route.roles && userRole) {
      return route.roles.includes(userRole);
    }

    // Si pas de rôles spécifiés, accessible à tous les utilisateurs connectés
    return isAuthenticated;
  }

  /**
   * Récupère une route par son chemin
   */
  static getRouteByPath(path: string): Route | undefined {
    return this.routes.find(route => route.path === path);
  }

  /**
   * Récupère les routes par rôle
   */
  static getRoutesByRole(role: string): Route[] {
    return this.deduplicateRoutes(this.routes.filter(route => route.roles?.includes(role)));
  }

  /**
   * Convertit les routes en MenuItems pour les composants
   */
  static getMenuItems(isAuthenticated: boolean = false, userRole?: string): MenuItem[] {
    const navRoutes = this.getNavRoutes(isAuthenticated, userRole);
    
    return navRoutes.map(route => ({
      path: route.path,
      label: route.label,
      description: route.description,
      icon: route.icon,
    }));
  }

} 