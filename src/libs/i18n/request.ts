// import { getRequestConfig } from "next-intl/server";
// import { hasLocale } from "next-intl";
// import { headers } from "next/headers";
// import { routing } from "./routing";
// import { Language } from "./types";

// async function detectLocaleFromBrowser(): Promise<Language> {
//   const headersList = await headers();
//   const acceptLanguage = headersList.get("accept-language") ?? "";

//   // Use the first (highest priority) language from Accept-Language header
//   const firstLang = ((acceptLanguage.split(",")?.[0] ?? "").trim().split(";")[0] ?? "").split("-")[0]?.toLowerCase();
//   const detected = hasLocale(routing.locales, firstLang) ? firstLang : routing.defaultLocale;

//   return detected as Language;
// }

// export default getRequestConfig(async ({ requestLocale }) => {
//   // Typically corresponds to the `[locale]` segment
//   const requested = await requestLocale;
//   const locale = hasLocale(routing.locales, requested) ? requested : await detectLocaleFromBrowser();

//   return {
//     locale,
//     messages: (await import(`../../../messages/${locale}.json`)).default,
//   };
// });
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  console.log("test: ", hasLocale(routing.locales, requested));

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});
