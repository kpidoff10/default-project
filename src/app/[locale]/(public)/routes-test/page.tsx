"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RouteManager } from "@/lib/routes/routes";
import { useRoutes } from "@/hooks/use-routes";

export default function RoutesTestPage() {
  const {
    navRoutes,
    userMenuRoutes,
    publicRoutes,
    protectedRoutes,
    isAuthenticated,
    userRole,
  } = useRoutes();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Test du RouteManager</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* État de l'utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>État de l&apos;utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Connecté :</strong> {isAuthenticated ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Rôle :</strong> {userRole || "Aucun"}
            </p>
          </CardContent>
        </Card>

        {/* Routes de navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Routes de navigation</CardTitle>
            <CardDescription>
              Routes visibles dans le menu principal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {navRoutes.map((route) => (
                <li key={route.path} className="flex justify-between">
                  <span>{route.label}</span>
                  <span className="text-muted-foreground">{route.path}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Routes du menu utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>Routes du menu utilisateur</CardTitle>
            <CardDescription>Routes dans le menu avatar</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {userMenuRoutes.map((route) => (
                <li key={route.path} className="flex justify-between">
                  <span>{route.label}</span>
                  <span className="text-muted-foreground">{route.path}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Routes publiques */}
        <Card>
          <CardHeader>
            <CardTitle>Routes publiques</CardTitle>
            <CardDescription>Toutes les routes publiques</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {publicRoutes.map((route) => (
                <li key={route.path} className="flex justify-between">
                  <span>{route.label}</span>
                  <span className="text-muted-foreground">{route.path}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Routes protégées */}
        <Card>
          <CardHeader>
            <CardTitle>Routes protégées</CardTitle>
            <CardDescription>
              Toutes les routes nécessitant une authentification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {protectedRoutes.map((route) => (
                <li key={route.path} className="flex justify-between">
                  <span>{route.label}</span>
                  <span className="text-muted-foreground">{route.path}</span>
                  {route.roles && (
                    <span className="text-xs text-blue-600">
                      Rôles: {route.roles.join(", ")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Test d'accessibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Test d&apos;accessibilité des routes</CardTitle>
          <CardDescription>
            Vérifier si certaines routes sont accessibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {["/", "/profile", "/upload", "/admin", "/creators", "/login"].map(
              (path) => (
                <div
                  key={path}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span>{path}</span>
                  <span
                    className={
                      RouteManager.isRouteAccessible(
                        path,
                        isAuthenticated,
                        userRole
                      )
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {RouteManager.isRouteAccessible(
                      path,
                      isAuthenticated,
                      userRole
                    )
                      ? "✅"
                      : "❌"}
                  </span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
