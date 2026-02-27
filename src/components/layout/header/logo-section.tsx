"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "@/libs/i18n/navigation";
import { ROUTERS } from "@/constants/routers";

type LogoItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

const logoItems: Readonly<LogoItem[]> = [
  {
    src: "/images/vindas.svg",
    alt: "VINDAS Logo",
    width: 60,
    height: 60,
    className: "h-10 w-10 md:h-12 md:w-12",
  },
  {
    src: "/images/vindas-text.svg",
    alt: "VINDAS Text",
    width: 112,
    height: 18,
    className: "hidden md:block h-4",
  },
] as const;

export function LogoSection() {
  const router = useRouter();

  return (
    <div
      className="flex w-14 cursor-pointer items-center justify-center px-2 md:w-64 md:px-6"
      onClick={() => router.push(ROUTERS.TRADING.INDEX)}
    >
      <div className="flex items-center space-x-2">
        {logoItems.map(({ src, alt, width, height, className }) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
          />
        ))}
      </div>
    </div>
  );
}
