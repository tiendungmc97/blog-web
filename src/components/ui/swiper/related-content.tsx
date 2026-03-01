"use client";

import { NewsSummary } from "@/service/cms-strapi/news/interface";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

interface RelatedContentProps {
  items: NewsSummary[];
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function RelatedContent({ items }: RelatedContentProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!items || items.length === 0) return null;
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Related News</h2>
      </div>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={4}
        slidesPerGroup={4}
        pagination={{ clickable: true, el: ".related-swiper-pagination" }}
        autoplay={false}
        breakpoints={{
          0: { slidesPerView: 1, slidesPerGroup: 1 },
          640: { slidesPerView: 3, slidesPerGroup: 3 },
          1024: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
      >
        {items.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <Link
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-44 w-full bg-neutral-100 dark:bg-neutral-800">
                  {item.cover?.url ? (
                    <Image
                      src={item.cover?.url ?? "/placeholder.png"}
                      alt={item.titles ?? ""}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-400">No image</div>
                  )}
                </div>
                <div className="flex h-20 flex-col gap-1 p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-white">
                    {item.titles ?? "Untitled"}
                  </p>
                  {item.descriptions && <p className="line-clamp-1 text-xs text-neutral-500">{item.descriptions}</p>}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* actions */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="flex cursor-pointer items-center justify-center bg-white text-neutral-600 shadow-sm transition hover:opacity-80"
          aria-label="Previous"
        >
          <ChevronLeft />
        </button>
        <div>
          <div className="related-swiper-pagination flex items-center [&_.swiper-pagination-bullet]:mx-1 [&_.swiper-pagination-bullet]:inline-block [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-neutral-300 dark:[&_.swiper-pagination-bullet]:bg-neutral-600 [&_.swiper-pagination-bullet-active]:!bg-neutral-900 dark:[&_.swiper-pagination-bullet-active]:!bg-white" />
        </div>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="flex cursor-pointer items-center justify-center bg-white text-neutral-600 shadow-sm transition hover:opacity-80"
          aria-label="Next"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
