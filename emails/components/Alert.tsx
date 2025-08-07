import { Section, Text } from "@react-email/components";

import { THEME_CLASSES } from "./theme";

interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  className?: string;
}

export default function Alert({
  children,
  variant = "info",
  title,
  className = "",
}: AlertProps) {
  const variantClasses = {
    info: `${THEME_CLASSES.muted} ${THEME_CLASSES.border} text-[#1E40AF]`,
    success: `${THEME_CLASSES.muted} ${THEME_CLASSES.border} text-[#166534]`,
    warning: `${THEME_CLASSES.muted} ${THEME_CLASSES.border} text-[#92400E]`,
    error: `${THEME_CLASSES.muted} ${THEME_CLASSES.border} text-[#991B1B]`,
  };

  const iconMap = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <Section
      className={`${variantClasses[variant]} border rounded-lg p-4 mb-6 ${className}`}
    >
      <div className="flex items-start">
        <div className="mr-3 flex-shrink-0 mt-4">
          <span className="text-base">{iconMap[variant]}</span>
        </div>
        <div className="flex-1 min-w-0">
          {title && <Text className="font-semibold mb-1">{title}</Text>}
          <Text className="text-sm leading-relaxed">{children}</Text>
        </div>
      </div>
    </Section>
  );
}
