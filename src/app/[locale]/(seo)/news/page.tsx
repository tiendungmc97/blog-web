import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/service/cms-strapi/news";

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
  const newsData = await getNews(locale);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">News</h1>
      <div className="grid gap-6">
        {newsData.data.map((news: any) => (
          <div
            key={news.id}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <h2 className="mb-2 text-xl font-semibold">{news.slug}</h2>
            <p className="mb-4 text-gray-600">{news.descriptions}</p>
            <Link
              href={`/news/${news.slug}`}
              className="text-blue-500 hover:underline"
            >
              See more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
