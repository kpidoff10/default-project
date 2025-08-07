const fs = require('fs');
const path = require('path');

// Lit les variables CSS de votre projet
const globalsCSS = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf8');

// Extrait les variables CSS du mode clair (root)
const cssVariables = {};
const rootRegex = /:root\s*{([^}]+)}/g;
const variableRegex = /--([^:]+):\s*([^;]+);/g;

let rootMatch;
while ((rootMatch = rootRegex.exec(globalsCSS)) !== null) {
  const rootContent = rootMatch[1];
  let variableMatch;
  while ((variableMatch = variableRegex.exec(rootContent)) !== null) {
    const [, name, value] = variableMatch;
    cssVariables[name] = value.trim();
  }
}

// Convertit les couleurs oklch en hex pour la compatibilité React Email
function convertOklchToHex(oklchValue) {
  // Couleurs Cloaky.me converties en hex
  const colorMap = {
    'oklch(0.558 0.288 302.321)': '#8B5CF6', // Primary violet
    'oklch(1 0 0)': '#FFFFFF', // White
    'oklch(0.1 0 0)': '#1A1A1A', // Dark gray
    'oklch(0.98 0.02 250)': '#F8FAFC', // Secondary light
    'oklch(0.2 0 0)': '#334155', // Secondary foreground
    'oklch(0.96 0.01 250)': '#F1F5F9', // Muted
    'oklch(0.45 0 0)': '#64748B', // Muted foreground
    'oklch(0.95 0.03 250)': '#F1F5F9', // Accent
    'oklch(0.65 0.25 15)': '#EF4444', // Destructive red
    'oklch(0.9 0.01 250)': '#E2E8F0', // Border
    'oklch(0.95 0.01 250)': '#F8FAFC', // Input
  };
  
  return colorMap[oklchValue] || oklchValue;
}

// Génère les classes CSS avec les couleurs de votre thème
function generateThemeClasses(cssVariables) {
  const primary = convertOklchToHex(cssVariables.primary);
  const primaryForeground = convertOklchToHex(cssVariables['primary-foreground']);
  const secondary = convertOklchToHex(cssVariables.secondary);
  const secondaryForeground = convertOklchToHex(cssVariables['secondary-foreground']);
  const destructive = convertOklchToHex(cssVariables.destructive);
  const destructiveForeground = convertOklchToHex(cssVariables['destructive-foreground']);
  const muted = convertOklchToHex(cssVariables.muted);
  const mutedForeground = convertOklchToHex(cssVariables['muted-foreground']);
  const background = convertOklchToHex(cssVariables.background);
  const foreground = convertOklchToHex(cssVariables.foreground);
  const border = convertOklchToHex(cssVariables.border);

  return {
    primary: `bg-[${primary}] text-[${primaryForeground}]`,
    secondary: `bg-[${secondary}] text-[${secondaryForeground}]`,
    destructive: `bg-[${destructive}] text-[${destructiveForeground}]`,
    muted: `bg-[${muted}] text-[${mutedForeground}]`,
    background: `bg-[${background}]`,
    foreground: `text-[${foreground}]`,
    border: `border-[${border}]`,
  };
}

// Génère la config Tailwind pour React Email
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Couleurs synchronisées depuis votre projet (converties en hex)
        primary: "${convertOklchToHex(cssVariables.primary || 'oklch(0.558 0.288 302.321)')}",
        "primary-foreground": "${convertOklchToHex(cssVariables['primary-foreground'] || 'oklch(1 0 0)')}",
        secondary: "${convertOklchToHex(cssVariables.secondary || 'oklch(0.98 0.02 250)')}",
        "secondary-foreground": "${convertOklchToHex(cssVariables['secondary-foreground'] || 'oklch(0.2 0 0)')}",
        muted: "${convertOklchToHex(cssVariables.muted || 'oklch(0.96 0.01 250)')}",
        "muted-foreground": "${convertOklchToHex(cssVariables['muted-foreground'] || 'oklch(0.45 0 0)')}",
        accent: "${convertOklchToHex(cssVariables.accent || 'oklch(0.95 0.03 250)')}",
        "accent-foreground": "${convertOklchToHex(cssVariables['accent-foreground'] || 'oklch(0.2 0 0)')}",
        destructive: "${convertOklchToHex(cssVariables.destructive || 'oklch(0.65 0.25 15)')}",
        "destructive-foreground": "${convertOklchToHex(cssVariables['destructive-foreground'] || 'oklch(1 0 0)')}",
        border: "${convertOklchToHex(cssVariables.border || 'oklch(0.9 0.01 250)')}",
        input: "${convertOklchToHex(cssVariables.input || 'oklch(0.95 0.01 250)')}",
        ring: "${convertOklchToHex(cssVariables.ring || 'oklch(0.558 0.288 302.321)')}",
        background: "${convertOklchToHex(cssVariables.background || 'oklch(1 0 0)')}",
        foreground: "${convertOklchToHex(cssVariables.foreground || 'oklch(0.1 0 0)')}",
        card: "${convertOklchToHex(cssVariables.card || 'oklch(1 0 0)')}",
        "card-foreground": "${convertOklchToHex(cssVariables['card-foreground'] || 'oklch(0.1 0 0)')}",
        popover: "${convertOklchToHex(cssVariables.popover || 'oklch(1 0 0)')}",
        "popover-foreground": "${convertOklchToHex(cssVariables['popover-foreground'] || 'oklch(0.1 0 0)')}",
      },
      borderRadius: {
        lg: "${cssVariables.radius || '0.75rem'}",
        md: "calc(${cssVariables.radius || '0.75rem'} - 2px)",
        sm: "calc(${cssVariables.radius || '0.75rem'} - 4px)",
      },
    },
  },
};
`;

// Écrit la config dans le dossier emails
fs.writeFileSync(path.join(__dirname, '../emails/tailwind.config.js'), tailwindConfig);

// Génère les classes de thème
const themeClasses = generateThemeClasses(cssVariables);

// Crée un fichier de constantes pour les classes
const themeConstants = `// Classes de thème synchronisées depuis votre projet
export const THEME_CLASSES = {
  primary: "${themeClasses.primary}",
  secondary: "${themeClasses.secondary}",
  destructive: "${themeClasses.destructive}",
  muted: "${themeClasses.muted}",
  background: "${themeClasses.background}",
  foreground: "${themeClasses.foreground}",
  border: "${themeClasses.border}",
} as const;

export type ThemeVariant = keyof typeof THEME_CLASSES;
`;

fs.writeFileSync(path.join(__dirname, '../emails/components/theme.ts'), themeConstants);

console.log('✅ Thème synchronisé vers React Email !');
console.log('✅ Classes de thème générées !');
console.log('Variables trouvées:', Object.keys(cssVariables).length); 