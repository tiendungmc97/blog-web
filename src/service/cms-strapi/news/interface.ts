export interface New {
  id: number;
  documentId: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  titles: string | null;
  descriptions: string | null;

  cover: Media | null;
  media: Media | null;

  contents: Content[];

  relative_news: NewsSummary[];
  news: NewsSummary | null;
  relativee_news1: NewsSummary | null;
  new: NewsSummary | null;
  relative_news2: NewsSummary | null;
  relative_news3: NewsSummary[];

  localizations: NewsLocalization[];
}

/* ============================= */
/* Content */
/* ============================= */

export interface Content {
  id: number;
  body: string;
}

/* ============================= */
/* Media (Strapi Upload File) */
/* ============================= */

export interface Media {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  focalPoint: unknown | null;

  width: number;
  height: number;

  formats: MediaFormats | null;

  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;

  previewUrl: string | null;
  provider: string;
  provider_metadata: unknown | null;

  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface MediaFormats {
  thumbnail?: MediaFormat;
  small?: MediaFormat;
  medium?: MediaFormat;
  large?: MediaFormat;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

/* ============================= */
/* Related / Summary News */
/* ============================= */

export interface NewsSummary {
  id: number;
  documentId: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  titles: string | null;
  descriptions: string | null;
  url: string | null;
}

/* ============================= */
/* Localization */
/* ============================= */

export interface NewsLocalization {
  id: number;
  documentId: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  titles: string | null;
  descriptions: string | null;
}
