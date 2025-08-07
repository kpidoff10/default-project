import { Section, Text } from "@react-email/components";

import { THEME_CLASSES } from "./theme";

interface Feature {
  text: string;
  icon?: string;
  description?: string;
}

interface FeatureListProps {
  features: Feature[];
  title?: string;
  variant?: "default" | "success" | "info";
  className?: string;
}

export default function FeatureList({
  features,
  title,
  variant = "default",
  className = "",
}: FeatureListProps) {
  const variantClasses = {
    default: `${THEME_CLASSES.muted} ${THEME_CLASSES.border}`,
    success: `${THEME_CLASSES.muted} ${THEME_CLASSES.border}`,
    info: `${THEME_CLASSES.muted} ${THEME_CLASSES.border}`,
  };

  const iconColors = {
    default: THEME_CLASSES.foreground,
    success: THEME_CLASSES.foreground,
    info: THEME_CLASSES.foreground,
  };

  return (
    <Section
      className={`${variantClasses[variant]} p-6 rounded-xl mb-6 ${className}`}
    >
      {title && (
        <Text
          className={`${THEME_CLASSES.foreground} mb-4 font-semibold text-lg`}
        >
          {title}
        </Text>
      )}
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex items-start ${index > 0 ? "mt-3" : ""}`}
        >
          {feature.icon && (
            <span className={`mr-3 mt-3 text-lg ${iconColors[variant]}`}>
              {feature.icon}
            </span>
          )}
          <div>
            <Text className={`${THEME_CLASSES.foreground} font-medium`}>
              {feature.text}
            </Text>
            {feature.description && (
              <Text
                className={`${THEME_CLASSES.muted.replace("bg-", "text-")} text-sm mt-1`}
              >
                {feature.description}
              </Text>
            )}
          </div>
        </div>
      ))}
    </Section>
  );
}
