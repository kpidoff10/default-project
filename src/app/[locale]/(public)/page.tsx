import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          <span className="text-primary">{t("title")}</span>
        </h1>
        <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
          {t("description")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/creators"
            className="rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            {t("discoverCreators")}
          </Link>
          <Link
            href="/register"
            className="text-base font-semibold leading-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("becomeCreator")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
