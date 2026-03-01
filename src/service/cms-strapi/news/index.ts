import { apiClient } from "@/libs/axios/config";
import { New } from "./interface";

export function getNews(locale: string) {
  const localeParam = locale ? `&locale=${locale}` : "";
  const url = `/news?populate=*${localeParam}`;
  return apiClient.get<New[]>(url);
}

export function getNewsBySlug(slug: string, locale: string) {
  const localeParam = locale ? `&locale=${locale}` : "";
  const url = `/news?filters[slug][$eq]=${slug}&populate=*${localeParam}`;
  return apiClient.get<New[]>(url);
}
