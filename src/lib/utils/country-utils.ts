/**
 * Convertit un code pays en emoji drapeau
 * @param country - Code pays (ex: "FR", "US")
 * @returns Emoji drapeau ou null si le code est invalide
 */
export function getCountryFlag(country: string | null): string | null {
  if (!country) return null;

  try {
    // Convertir le code pays en emoji drapeau
    const codePoints = country
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
  } catch (error) {
    console.warn(`Impossible de convertir le code pays: ${country}`);
    return null;
  }
}

/**
 * Liste des codes pays supportés avec leurs noms
 */
export const SUPPORTED_COUNTRIES = {
  FR: "France",
  US: "États-Unis",
  GB: "Royaume-Uni",
  DE: "Allemagne",
  ES: "Espagne",
  IT: "Italie",
  CA: "Canada",
  AU: "Australie",
  JP: "Japon",
  KR: "Corée du Sud",
  CN: "Chine",
  IN: "Inde",
  BR: "Brésil",
  MX: "Mexique",
  AR: "Argentine",
  RU: "Russie",
  TR: "Turquie",
  SA: "Arabie Saoudite",
  AE: "Émirats Arabes Unis",
  SG: "Singapour",
} as const;

export type SupportedCountryCode = keyof typeof SUPPORTED_COUNTRIES;
