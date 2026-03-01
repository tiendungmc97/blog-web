import { GalleryItem } from "@/service/cms-strapi/photos/interface";
import Image from "next/image";

export function GallaryItem({ gallery }: { gallery: GalleryItem }) {
  const image = gallery.image;
  return (
    <div className="mb-6 w-full rounded-lg object-cover">
      <Image
        src={image?.url ?? "/placeholder.png"}
        alt={image?.alternativeText ?? gallery.altText ?? "Gallery Image"}
        width={image?.width ?? 400}
        height={image?.height ?? 300}
        className="w-full rounded-xs object-cover"
      />
      {gallery?.headline && <p className="mt-2 text-sm text-gray-500">{gallery?.headline}</p>}
      {gallery?.credit && <p className="mt-1 text-xs text-gray-400">{gallery?.credit}</p>}
    </div>
  );
}
