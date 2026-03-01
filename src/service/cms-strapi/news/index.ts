import { apiClient } from "@/libs/axios/config";
import { New } from "./interface";

export function getNews(locale: string) {
  const localeParam = locale ? `&locale=${locale}` : "";
  const url = `/news?${localeParam}&populate[cover]=true`;
  return apiClient.get<New[]>(url);
}

export function getNewsBySlug(slug: string, locale: string, status?: string) {
  const localeParam = locale ? `&locale=${locale}` : "";
  const statusParam = status ? `&status=${status}` : "";
  const url = `/news?filters[slug][$eq]=${slug}${localeParam}${statusParam}&populate[cover]=true&populate[contents][populate]=true&populate[news_related][populate][cover]=true&populate[author][populate][avatar]=true`;
  // const url = "/news?filters[slug][$eq]=new-2&populate[news_related][populate][cover]=true&locale=vi";

  if (status === "draft") {
    // Draft content requires a server-side API token with draft access
    return fetchNewsDraft(url);
  }
  return apiClient.get<New[]>(url);
}

/** Server-only helper for fetching draft content with the Strapi API token. */
async function fetchNewsDraft(path: string): Promise<{ data: New[]; meta: unknown }> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337/api";
  const token = process.env.STRAPI_API_TOKEN;

  const response = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "strapi-encode-source-maps": "true",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Strapi draft fetch failed: ${response.status}`);
  }

  return response.json() as Promise<{ data: New[]; meta: unknown }>;
}
