/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Couleurs synchronisées depuis votre projet (converties en hex)
        primary: "#8B5CF6",
        "primary-foreground": "#FFFFFF",
        secondary: "#F8FAFC",
        "secondary-foreground": "#334155",
        muted: "#F1F5F9",
        "muted-foreground": "#64748B",
        accent: "#F1F5F9",
        "accent-foreground": "#334155",
        destructive: "#EF4444",
        "destructive-foreground": "#FFFFFF",
        border: "#E2E8F0",
        input: "#F8FAFC",
        ring: "#8B5CF6",
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        card: "#FFFFFF",
        "card-foreground": "#1A1A1A",
        popover: "#FFFFFF",
        "popover-foreground": "#1A1A1A",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
    },
  },
};
