import { LanguageSwitcher } from "@/components/language-switcher";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Test Blog
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
