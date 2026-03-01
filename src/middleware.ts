import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./libs/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  try {
    return handleI18nRouting(req);
  } catch (error) {
    console.error("Middleware error:", error);
    // Return intlMiddleware instead of redirect to avoid hydration issues
    return handleI18nRouting(req);
  }
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
