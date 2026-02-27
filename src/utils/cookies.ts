/**
 * Cookie utility functions for client-side cookie management
 */

export interface CookieOptions {
  expires?: Date | number; // Date object or days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
}

/**
 * Set a cookie with optional configuration
 * @param name - Cookie name
 * @param value - Cookie value
 * @param options - Cookie options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === "undefined") {
    console.warn("setCookie: document is not available (SSR context)");
    return;
  }

  const { expires, path = "/", domain, secure = true, sameSite = "strict", httpOnly = false } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    if (typeof expires === "number") {
      // Convert days to milliseconds
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += `; secure`;
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  if (httpOnly) {
    cookieString += `; httponly`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    console.warn("getCookie: document is not available (SSR context)");
    return null;
  }

  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 * @param name - Cookie name
 * @param options - Cookie options (path and domain should match the original cookie)
 */
export function deleteCookie(name: string, options: Pick<CookieOptions, "path" | "domain"> = {}): void {
  if (typeof document === "undefined") {
    console.warn("deleteCookie: document is not available (SSR context)");
    return;
  }

  setCookie(name, "", {
    ...options,
    expires: new Date(0), // Set expiry to past date
  });
}

/**
 * Check if a cookie exists
 * @param name - Cookie name
 * @returns True if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Get all cookies as an object
 * @returns Object with cookie names as keys and values
 */
export function getAllCookies(): Record<string, string> {
  if (typeof document === "undefined") {
    console.warn("getAllCookies: document is not available (SSR context)");
    return {};
  }

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(";");

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    const [name, ...valueParts] = cookie.split("=");
    if (name && valueParts.length > 0) {
      const value = valueParts.join("="); // Handle values with '=' in them
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
}
