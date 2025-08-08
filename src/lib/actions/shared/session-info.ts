"use server";

import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { extractSessionInfo } from "@/lib/utils/device-detection";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

/**
 * Met à jour les informations de session avec le pays et l'appareil
 */
export async function updateSessionInfo(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    // Extraire les informations de l'appareil et du pays
    const sessionInfo = await extractSessionInfo(request);

    // Trouver la session active de l'utilisateur
    const activeSession = await prisma.session.findFirst({
      where: {
        userId: session.user.id,
        expires: { gt: new Date() }
      }
    });

    if (!activeSession) {
      return { success: false, error: "Session non trouvée" };
    }

    // Mettre à jour la session avec les nouvelles informations
    await prisma.session.update({
      where: { id: activeSession.id },
      data: {
        country: sessionInfo.country,
        deviceType: sessionInfo.deviceType,
        osName: sessionInfo.osName,
        lastActivity: new Date()
      }
    });

    return { 
      success: true, 
      data: {
        country: sessionInfo.country,
        deviceType: sessionInfo.deviceType,
        osName: sessionInfo.osName
      }
    };

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la session:", error);
    return { 
      success: false, 
      error: "Erreur lors de la mise à jour de la session" 
    };
  }
}

/**
 * Met à jour les informations de session côté client
 */
export async function updateSessionInfoClient(userAgent: string) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non connecté" };
    }

    // Détection de l'appareil basée sur le User-Agent
    const deviceType = detectDeviceType(userAgent);
    const osName = detectOS(userAgent);
    
    // Récupérer le pays via une API externe
    const country = await getCountryFromIP();

    // Trouver la session active de l'utilisateur
    const activeSession = await prisma.session.findFirst({
      where: {
        userId: session.user.id,
        expires: { gt: new Date() }
      }
    });

    if (!activeSession) {
      return { success: false, error: "Session non trouvée" };
    }

    // Mettre à jour la session avec les nouvelles informations
    await prisma.session.update({
      where: { id: activeSession.id },
      data: {
        country,
        deviceType,
        osName,
        lastActivity: new Date()
      }
    });

    return { 
      success: true, 
      data: {
        country,
        deviceType,
        osName
      }
    };

  } catch (error) {
    console.error("Erreur lors de la mise à jour de la session:", error);
    return { 
      success: false, 
      error: "Erreur lors de la mise à jour de la session" 
    };
  }
}

/**
 * Récupère le pays basé sur l'IP du serveur
 */
async function getCountryFromIP(): Promise<string | null> {
  try {
    // Utiliser une API gratuite pour récupérer le pays
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'User-Agent': 'Cloaky.me/1.0'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.country_code) {
      return data.country_code;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la détection du pays:', error);
    return null;
  }
}

/**
 * Détecte le type d'appareil basé sur le User-Agent
 */
function detectDeviceType(userAgent: string): "desktop" | "tablet" | "mobile" {
  const ua = userAgent.toLowerCase();
  
  // Tablets
  if (ua.includes('ipad') || ua.includes('tablet')) {
    return 'tablet';
  }
  
  // Mobile
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  }
  
  // Desktop par défaut
  return 'desktop';
}

/**
 * Détecte l'OS basé sur le User-Agent
 */
function detectOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('windows')) {
    return 'Windows';
  }
  
  if (ua.includes('mac os')) {
    return 'macOS';
  }
  
  if (ua.includes('iphone') || ua.includes('ipad')) {
    return 'iOS';
  }
  
  if (ua.includes('android')) {
    return 'Android';
  }
  
  if (ua.includes('linux')) {
    return 'Linux';
  }
  
  return 'Unknown';
}

/**
 * Type de retour pour getSessionInfo
 */
export type GetSessionInfoResult = Awaited<ReturnType<typeof getSessionInfo>>;
/**
 * Type de retour pour un data de session
 */
export type SessionData = NonNullable<GetSessionInfoResult["data"]>[number];
/**
 * Récupère les informations de session d'un utilisateur
 */
export async function getSessionInfo(
  userId: string, 
  limit: number = 10, 
  cursor?: string
) {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        expires: { gt: new Date() }
      },
      select: {
        id: true,
        country: true,
        deviceType: true,
        osName: true,
        createdAt: true,
        lastActivity: true
      },
      orderBy: {
        lastActivity: 'desc'
      },
      take: limit,
      ...(cursor && {
        cursor: {
          id: cursor
        },
        skip: 1
      })
    });

    // Récupérer le prochain cursor
    const nextCursor = sessions.length === limit ? sessions[sessions.length - 1]?.id : null;

    return { 
      success: true, 
      data: sessions,
      nextCursor,
      hasMore: sessions.length === limit
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions:", error);
    return { 
      success: false, 
      error: "Erreur lors de la récupération des sessions" 
    };
  }
}

/**
 * Révoque toutes les sessions d'un utilisateur
 */
export async function revokeAllSessions(userId: string) {
  try {
    await prisma.session.deleteMany({
      where: { userId }
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la révocation des sessions:", error);
    return { 
      success: false, 
      error: "Erreur lors de la révocation des sessions" 
    };
  }
}

/**
 * Révoque une session spécifique
 */
export async function revokeSession(sessionId: string) {
  try {
    await prisma.session.delete({
      where: { id: sessionId }
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la révocation de la session:", error);
    return { 
      success: false, 
      error: "Erreur lors de la révocation de la session" 
    };
  }
} 