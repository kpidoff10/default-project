import { RouteManager } from "@/lib/routes/routes";
import { useAuth } from "@/providers/auth-provider";

export function useRoutes() {
  const { isAuthenticated, userRole } = useAuth();

  return {
    // Routes de navigation
    navRoutes: RouteManager.getNavRoutes(isAuthenticated, userRole),
    userMenuRoutes: RouteManager.getUserMenuRoutes(isAuthenticated, userRole),
    
    // Menu items pour les composants
    navMenuItems: RouteManager.getMenuItems(isAuthenticated, userRole),
    
    // Routes publiques/protégées
    publicRoutes: RouteManager.getPublicRoutes(),
    protectedRoutes: RouteManager.getProtectedRoutes(),
    
    // Utilitaires
    isRouteAccessible: (path: string) => 
      RouteManager.isRouteAccessible(path, isAuthenticated, userRole),
    getRouteByPath: (path: string) => 
      RouteManager.getRouteByPath(path),
    
    // État de l'utilisateur
    isAuthenticated,
    userRole,
  };
} 