import { apiClient } from "@/libs/axios/config";
import { New } from "./interface";
import { fetchNewsDraft } from "../common";

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
