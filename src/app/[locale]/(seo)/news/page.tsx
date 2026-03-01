import { getNews } from "@/service/cms-strapi/news";
import { New } from "@/service/cms-strapi/news/interface";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return {
    title: "News - My Website",
    description: "Latest news and updates from My Website.",
    openGraph: {
      title: "News - My Website",
      description: "Latest news and updates from My Website.",
      type: "website",
      url: "/news",
      images: [
        {
          url: "/images/og-news.png",
          width: 1200,
          height: 630,
          alt: "News - My Website",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "News - My Website",
      description: "Latest news and updates from My Website.",
      images: ["/images/og-news.png"],
    },
  };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [newsData, t] = await Promise.all([getNews(locale), getTranslations()]);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("news")}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsData.data.map((news: New) => (
          <CardNews
            key={news.id}
            news={news}
          />
        ))}
      </div>
    </div>
  );
}

function CardNews({ news }: { news: New }) {
  const t = useTranslations();
  const locale = useLocale();
  const formattedDate = new Date(news.publishedAt).toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  console.log("News cover URL:", news.cover?.url);
  return (
    <Link
      href={`/news/${news.slug}`}
      className="group flex flex-col overflow-hidden bg-white shadow-sm transition-shadow outline-none hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {news.cover?.url ? (
          <Image
            src={news.cover.url}
            alt={news.cover.alternativeText ?? news.titles ?? news.slug}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          {news.titles ?? news?.descriptions ?? "Untitled"}
        </h2>
        <p className="text-xs text-gray-400">{formattedDate}</p>
        <span className="mt-auto pt-2 text-sm font-medium text-blue-500 group-hover:underline">{t("seeMore")} →</span>
      </div>
    </Link>
  );
}
