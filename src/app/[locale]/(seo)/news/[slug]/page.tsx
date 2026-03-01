import { UserCard } from "@/components/ui/card/user-card";
import { RelatedContent } from "@/components/ui/swiper/related-content";
import { getNewsBySlug } from "@/service/cms-strapi/news";
import { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const res = await getNewsBySlug(slug, locale, isDraftMode ? "draft" : undefined);
  const article = res.data?.length > 0 ? res.data[0] : null;

  const title = article?.titles ?? "News - My Website";
  const description = article?.descriptions ?? "Latest news and updates from My Website.";
  const coverUrl = article?.cover?.url ?? "/images/og-news.png";
  const coverWidth = article?.cover?.width ?? 1200;
  const coverHeight = article?.cover?.height ?? 630;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/news/${slug}`,
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

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const res = await getNewsBySlug(slug, locale, isDraftMode ? "draft" : undefined);
  const news = res.data?.length > 0 ? res.data[0] : null;

  if (!news) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">News not found.</p>
      </div>
    );
  }

  const coverUrl = news.cover?.url ?? "/images/og-news.png";
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">{news.titles}</h1>
      <p className="mb-6 text-sm text-gray-500">
        Published:{" "}
        {new Date(news.publishedAt).toLocaleString(locale, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
      <UserCard
        name={news.author?.name ?? "Unknown Author"}
        avatarUrl={news.author?.avatar?.url ?? ""}
        avatarAlt={news.author?.name ?? ""}
        role={news.author?.email ?? ""}
        facebookUrl="#"
        gmailUrl="#"
        twitterUrl="#"
      />
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={news.cover?.alternativeText ?? news.titles ?? ""}
          className="mb-6 w-full rounded-lg object-cover"
          width={news.cover?.width ?? 400}
          height={news.cover?.height ?? 300}
        />
      )}
      {news.contents?.map((content: { id: number; body: string }) => (
        <div
          key={content.id}
          className="prose mb-4 max-w-none"
        >
          <ReactMarkdown>{content.body}</ReactMarkdown>
        </div>
      ))}
      <RelatedContent items={news.news_related ?? []} />
    </div>
  );
}
