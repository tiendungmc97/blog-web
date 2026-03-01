import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/libs/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}

          <nav className="hidden items-center gap-4 md:flex">
            <Link
              href="/news"
              className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
            >
              {t("news")}
            </Link>

            <Link
              href="/photos"
              className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
            >
              {t("photos")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </>
  );
}
