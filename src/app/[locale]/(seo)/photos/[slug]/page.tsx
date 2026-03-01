import { getPhotosBySlug } from "@/service/cms-strapi/photos";
import { GalleryItem } from "@/service/cms-strapi/photos/interface";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import { GallaryItem } from "../_components/gallary-item";
import { cache } from "react";

const getPhotosCached = cache((slug: string, locale: string, status?: string) => getPhotosBySlug(slug, locale, status));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const res = await getPhotosCached(slug, locale, isDraftMode ? "draft" : undefined);
  const article = res.data?.length > 0 ? res.data?.[0] : null;

  const title = article?.title ?? "Photos - My Website";
  const description = article?.description ?? "Latest photos and updates from My Website.";
  const coverUrl = article?.coverImage?.url ?? "/images/og-photos.png";
  const coverWidth = article?.coverImage?.width ?? 1200;
  const coverHeight = article?.coverImage?.height ?? 630;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/photos/${slug}`,
      images: [
        {
          url: coverUrl,
          width: coverWidth,
          height: coverHeight,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverUrl],
    },
  };
}

export default async function PhotosDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const res = await getPhotosCached(slug, locale, isDraftMode ? "draft" : undefined);
  const photos = res.data?.length > 0 ? res.data?.[0] : null;
  if (!photos) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Photos not found.</p>
      </div>
    );
  }
  console.log("Photos gallery:", photos.gallery);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">{photos.titles}</h1>
      {photos.gallery?.map((gallery: GalleryItem) => (
        <GallaryItem
          key={gallery.id}
          gallery={gallery}
        />
      ))}
    </div>
  );
}
