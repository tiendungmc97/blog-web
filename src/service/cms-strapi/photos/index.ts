import { apiClient } from "@/libs/axios/config";
import { fetchNewsDraft } from "../common";
import { Photo } from "./interface";

export function getPhotos(locale: string) {
  const localeParam = locale ? `&locale=${locale}` : "";
  const url = `/photos?${localeParam}&populate[coverImage]=true`;
  return apiClient.get<Photo[]>(url);
}

export function getPhotosBySlug(slug: string, locale: string, status?: string) {
  const localeParam = locale ? `&locale=${locale}` : "";
  const statusParam = status ? `&status=${status}` : "";
  const url = `/photos?filters[slug][$eq]=${slug}${localeParam}${statusParam}&populate[coverImage]=true&populate[seo]=true&populate[gallery][populate][image]=true&populate[related][populate][coverImage]=true`;
  // const url = "/news?filters[slug][$eq]=new-2&populate[news_related][populate][cover]=true&locale=vi";

  if (status === "draft") {
    // Draft content requires a server-side API token with draft access
    return fetchNewsDraft(url);
  }
  return apiClient.get<Photo[]>(url);
}
