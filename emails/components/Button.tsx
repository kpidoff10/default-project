import { Button as EmailButton } from "@react-email/components";
import { THEME_CLASSES } from "./theme";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const baseClasses =
    "inline-block font-medium text-center rounded-lg transition-colors";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: THEME_CLASSES.primary,
    secondary: THEME_CLASSES.secondary,
    danger: THEME_CLASSES.destructive,
    success: THEME_CLASSES.primary, // Utilise aussi le thème pour success
  };

  return (
    <EmailButton
      href={href}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </EmailButton>
  );
}
