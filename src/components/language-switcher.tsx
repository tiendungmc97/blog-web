"use client";

import { usePathname, useRouter } from "@/libs/i18n/navigation";
import { Language } from "@/libs/i18n/types";
import { Dropdown, Image, MenuProps } from "antd";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: Language.EN, name: "English", flag: "/flags/en.svg" },
    { code: Language.VI, name: "Vietnamese", flag: "/flags/vi.svg" },
  ];

  const handleLanguageChange = (language: Language) => {
    router.replace(pathname, { locale: language });
  };

  const items: MenuProps["items"] = languages.map((e) => ({
    key: e.code,
    label: (
      <div
        onClick={() => handleLanguageChange(e.code)}
        className="flex items-center gap-2"
      >
        <Image
          src={e.flag}
          alt={e.name}
          width={20}
          height={18}
          preview={false}
        />
        {e.name}
      </div>
    ),
  }));
  const currentLanguage = languages.find((lang) => lang.code === locale);
  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
    >
      <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white">
        <Image
          src={currentLanguage?.flag}
          alt={currentLanguage?.name || ""}
          width={40}
          height={30}
          preview={false}
        />
      </div>
    </Dropdown>
  );
}
