import createMiddleware from "next-intl/middleware";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ROUTERS } from "./constants/routers";
import { routing } from "./libs/i18n/routing";
import { CookiesStorageKeys } from "./constants/keys";

const handleI18nRouting = createMiddleware(routing);

const protectedRoutes: string[] = [
];

export async function middleware(req: NextRequest) {
  try {
    const privatePathnameRegex = RegExp(
      `^(/(${routing.locales.join("|")}))?(${protectedRoutes
        .map((p) => (p === "/" ? "" : `${p}(?:/.*)?`))
        .join("|")})/?$`,
      "i",
    );
    const isProtectedRoute = privatePathnameRegex.test(req.nextUrl.pathname);

    if (!isProtectedRoute) {
      return handleI18nRouting(req);
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get(CookiesStorageKeys.ACCESS_TOKEN)?.value;

    if (!accessToken && isProtectedRoute) {
      const localeMatch = req.nextUrl.pathname.match(/^\/(en|vi)/);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/${ROUTERS.HOME}`, req.url);
      return NextResponse.redirect(loginUrl);
    }

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
