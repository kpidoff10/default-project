import { NextRequest } from "next/server";

export interface SessionInfo {
  country: string | null;
  deviceType: "desktop" | "tablet" | "mobile" | null;
  osName: string | null;
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
 * Récupère l'adresse IP depuis la requête
 */
function getClientIP(request: NextRequest): string | null {
  // Headers pour les proxies
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return null;
}

/**
 * Récupère le pays basé sur l'IP (pas de GPS)
 */
async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    // API gratuite pour récupérer le pays
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`);
    const data = await response.json();
    
    if (data.status === 'success' && data.countryCode) {
      return data.countryCode;
    }
  } catch (error) {
    console.error('Erreur lors de la détection du pays:', error);
  }
  
  return null;
}

/**
 * Extrait les informations de session (pays + appareil)
 */
export async function extractSessionInfo(request: NextRequest): Promise<SessionInfo> {
  const userAgent = request.headers.get('user-agent') || '';
  const ipAddress = getClientIP(request);
  
  // Détection de l'appareil
  const deviceType = detectDeviceType(userAgent);
  const osName = detectOS(userAgent);
  
  // Détection du pays (basé sur IP uniquement)
  let country: string | null = null;
  if (ipAddress) {
    country = await getCountryFromIP(ipAddress);
  }
  
  return {
    country,
    deviceType,
    osName,
  };
} 