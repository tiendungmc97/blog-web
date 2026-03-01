export interface Photo {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  description: string | null;
  coverImage: PhotoMedia | null;
  seo: PhotoSeo | null;
  gallery: GalleryItem[];
  related: PhotoSummary[];
}

/* ============================= */
/* Gallery Item */
/* ============================= */

export interface GalleryItem {
  id: number;
  altText: string | null;
  caption: RichTextBlock[] | null;
  headline: string | null;
  credit: string | null;
  image: PhotoMedia | null;
}

export interface RichTextBlock {
  type: string;
  children: RichTextChild[];
}

export interface RichTextChild {
  type: string;
  text: string;
}

/* ============================= */
/* SEO */
/* ============================= */

export interface PhotoSeo {
  id: number;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalURL: string | null;
  ogDescription: string | null;
  ogTitle: string | null;
  metaRobots: string | null;
}

/* ============================= */
/* Related / Summary Photo */
/* ============================= */

export interface PhotoSummary {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  description: string | null;
  coverImage: PhotoMedia | null;
}

/* ============================= */
/* Media (Strapi Upload File) */
/* ============================= */

export interface PhotoMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  focalPoint: unknown | null;
  width: number;
  height: number;
  formats: PhotoMediaFormats | null;
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

export interface PhotoMediaFormats {
  thumbnail?: PhotoMediaFormat;
  small?: PhotoMediaFormat;
  medium?: PhotoMediaFormat;
  large?: PhotoMediaFormat;
}

export interface PhotoMediaFormat {
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
