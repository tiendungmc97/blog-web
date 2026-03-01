import { Link } from "@/libs/i18n/navigation";
import { Photo } from "@/service/cms-strapi/photos/interface";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function CardPhoto({ photo }: { photo: Photo }) {
  const t = useTranslations();
  return (
    <Link
      href={`/photos/${photo.slug}`}
      className="group flex flex-col overflow-hidden bg-white shadow-sm transition-shadow outline-none hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {photo.coverImage?.url ? (
          <Image
            src={photo.coverImage.url}
            alt={photo.coverImage.alternativeText ?? photo.slug}
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
          {photo.title ?? "Untitled"}
        </h2>
        <p className="line-clamp-2 text-sm text-gray-500">{photo.description ?? t("noDescription")}</p>
      </div>
    </Link>
  );
}
