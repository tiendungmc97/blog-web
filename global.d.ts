import { routing } from "@/libs/i18n/routing";
import { formats } from "@/libs/i18n/request";
import messages from "./messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
