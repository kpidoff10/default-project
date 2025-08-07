// Classes de thème synchronisées depuis votre projet
export const THEME_CLASSES = {
  primary: "bg-[#8B5CF6] text-[#FFFFFF]",
  secondary: "bg-[#F8FAFC] text-[#334155]",
  destructive: "bg-[#EF4444] text-[#FFFFFF]",
  muted: "bg-[#F1F5F9] text-[#64748B]",
  background: "bg-[#FFFFFF]",
  foreground: "text-[#1A1A1A]",
  border: "border-[#E2E8F0]",
} as const;

export type ThemeVariant = keyof typeof THEME_CLASSES;
