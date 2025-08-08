import { Button } from "./button";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";

interface SaveButtonProps {
  onSubmit: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export default function SaveButton({
  onSubmit,
  isLoading,
  isDisabled,
}: SaveButtonProps) {
  const t = useTranslations("Common");
  return (
    <div className="pt-8 border-t">
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
          isLoading={isLoading}
          size="lg"
        >
          <Save className="h-5 w-5 mr-2" />
          {t("form.saveChanges")}
        </Button>
      </div>
    </div>
  );
}
