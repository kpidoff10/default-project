import { NextRequest, NextResponse } from "next/server";

import { RouteManager } from "@/lib/routes/routes";
import { authOptions } from "@/lib/auth";
import { clientConfig } from "@/lib/config/client-config";
import createI18nMiddleware from "next-intl/middleware";
import { getServerSession } from "next-auth";

// Middleware i18n
const i18nMiddleware = createI18nMiddleware({
  locales: clientConfig.i18n.locales,
  defaultLocale: clientConfig.i18n.defaultLocale,
  localePrefix: clientConfig.i18n.localePrefix
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques et les images
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') // Fichiers avec extensions (.png, .jpg, etc.)
  ) {
    return NextResponse.next();
  }

  // Appliquer le middleware i18n en premier
  const i18nResponse = i18nMiddleware(request);
  if (i18nResponse) return i18nResponse;

  // Extraire la locale et le chemin sans locale
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
  
  // Récupérer les routes publiques depuis le RouteManager
  const publicRoutes = RouteManager.getPublicRoutes().map(route => route.path);
  
  // Si c'est une route publique, toujours laisser passer
  if (publicRoutes.includes(pathnameWithoutLocale)) {
    return NextResponse.next();
  }

  // Pour toutes les autres routes, vérifier l'authentification
  // Note: getServerSession ne fonctionne pas dans le middleware
  // On utilise une approche alternative avec les cookies de session
  const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                      request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Si l'utilisateur n'est pas connecté, rediriger vers login
  if (!sessionToken) {
    // Déterminer la locale actuelle
    const locale = clientConfig.i18n.locales.find(loc => pathname.startsWith(`/${loc}`)) || clientConfig.i18n.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est connecté, laisser passer
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};