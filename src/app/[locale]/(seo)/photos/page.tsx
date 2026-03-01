import { getPhotos } from "@/service/cms-strapi/photos";
import { Photo } from "@/service/cms-strapi/photos/interface";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CardPhoto } from "./_components/card-photo";

export function generateMetadata(): Metadata {
  return {
    title: "Photos - My Website",
    description: "Latest photos and updates from My Website.",
    openGraph: {
      title: "Photos - My Website",
      description: "Latest photos and updates from My Website.",
      type: "website",
      url: "/photos",
      images: [
        {
          url: "/images/og-photos.png",
          width: 1200,
          height: 630,
          alt: "Photos - My Website",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Photos - My Website",
      description: "Latest photos and updates from My Website.",
      images: ["/images/og-photos.png"],
    },
  };
}

export default async function PhotosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [newsData, t] = await Promise.all([getPhotos(locale), getTranslations()]);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("photos")}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsData.data.map((photo: Photo) => (
          <CardPhoto
            key={photo.id}
            photo={photo}
          />
        ))}
      </div>
    </div>
  );
}
