import { defineRouting } from "next-intl/routing";
import { Language } from "./types";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [Language.EN, Language.VI],

  // Used when no locale matches
  defaultLocale: Language.VI,
});
