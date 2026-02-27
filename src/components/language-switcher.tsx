"use client";

import { usePathname, useRouter } from "@/libs/i18n/navigation";
import { useMutationUpdateUserSettings, useQueryUserProfile } from "@/services/users/hooks";
import { TypeLangApi } from "@/services/users/types";
import { Language } from "@/types/language";
import { Dropdown, Image, MenuProps } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

export function LanguageSwitcher({ shouldFetchUserSettings = false }: { shouldFetchUserSettings?: boolean }) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const { data: userInfo } = useQueryUserProfile(shouldFetchUserSettings);
  const { mutate: updateUserSettings } = useMutationUpdateUserSettings();

  useEffect(() => {
    if (userInfo?.data?.lang) {
      const langMap: Record<TypeLangApi, Language> = {
        en_US: Language.EN,
        vi_VN: Language.VI,
      };
      const userLang = langMap[userInfo.data.lang];
      router.replace(pathname, { locale: userLang });
    }
  }, [userInfo?.data?.lang]);

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: Language.EN, name: t("english"), flag: "/flags/en.svg" },
    { code: Language.VI, name: t("vietnamese"), flag: "/flags/vi.svg" },
  ];

  const handleLanguageChange = (language: Language) => {
    router.replace(pathname, { locale: language });
    const langMap: Record<Language, TypeLangApi> = {
      [Language.EN]: "en_US",
      [Language.VI]: "vi_VN",
    };
    if (shouldFetchUserSettings) return;
    updateUserSettings({ lang: langMap[language] });
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
