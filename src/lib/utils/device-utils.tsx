import { Monitor, Smartphone, Tablet } from "lucide-react";

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

/**
 * Obtient l'icône pour un type d'appareil
 * @param deviceType - Type d'appareil
 * @returns Composant icône Lucide
 */
export function getDeviceIcon(deviceType: string | null) {
  switch (deviceType) {
    case "mobile":
      return <Smartphone className="h-4 w-4" />;
    case "tablet":
      return <Tablet className="h-4 w-4" />;
    case "desktop":
      return <Monitor className="h-4 w-4" />;
    default:
      return <Monitor className="h-4 w-4" />;
  }
}

/**
 * Obtient le label traduit pour un type d'appareil
 * @param deviceType - Type d'appareil
 * @param t - Fonction de traduction
 * @returns Label traduit
 */
export function getDeviceTypeLabel(
  deviceType: string | null,
  t: (key: string) => string
) {
  if (!deviceType) return t("deviceType.unknown");
  return t(`deviceType.${deviceType}` as keyof typeof t) || deviceType;
}

/**
 * Obtient le label traduit pour un système d'exploitation
 * @param osName - Nom du système d'exploitation
 * @param t - Fonction de traduction
 * @returns Label traduit
 */
export function getOSLabel(
  osName: string | null,
  t: (key: string) => string
) {
  if (!osName) return t("osName.Unknown");
  return t(`osName.${osName}` as keyof typeof t) || osName;
}

/**
 * Formate une date en format français
 * @param date - Date à formater
 * @returns Date formatée
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
