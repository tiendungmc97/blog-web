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
          <Link
            href="/news"
            className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            {t("Home")}
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 md:flex">
            {/* {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))} */}
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
