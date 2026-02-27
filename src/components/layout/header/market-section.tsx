"use client";

import React from "react";
import { CaretDownOutlined } from "@ant-design/icons";

type MetricTone = "pos" | "neg" | "neutral";
type MetricItem = { key: string; value: string; label: string; tone?: MetricTone };

const getToneColor = (tone?: MetricTone) => {
  if (tone === "pos") return "text-success";
  if (tone === "neg") return "text-error";
  return "text-textSecondary";
};

const metrics: MetricItem[] = [
  { key: "lastPrice", value: "85,882.02", label: "Giá khớp gần nhất", tone: "pos" },
  { key: "change24h", value: "1,222.11 - 1.8%", label: "Biến động giá 24h", tone: "neg" },
  { key: "high24h", value: "85,655", label: "Giá cao nhất 24h" },
  { key: "low24h", value: "81,002", label: "Giá thấp nhất 24h" },
  { key: "vol24hFSV", value: "20,001 FSV", label: "Khối lượng 24h" },
  { key: "vol24hVND", value: "20,001 VND", label: "Khối lượng 24h" },
];

interface MarketSectionProps {
  isPairSelectorOpen: boolean;
  onPairSelectorEnter: () => void;
  onPairSelectorLeave: () => void;
  pairSelectorRef: React.RefObject<HTMLDivElement | null>;
}

export function MarketSection({
  isPairSelectorOpen,
  onPairSelectorEnter,
  onPairSelectorLeave,
  pairSelectorRef,
}: MarketSectionProps) {
  // Count per breakpoint:
  // base: 2 | md: 3 | lg (≥1024): 3 | 1200–1279: 4 | xl (≥1280): 5 | 2xl (≥1536): 6
  const visibilityFor = (i: number) =>
    [
      i >= 2 ? "hidden" : "flex", // base: 2
      i >= 3 ? "md:hidden" : "md:flex", // md: 3
      i >= 3 ? "lg:hidden" : "lg:flex", // lg: 3
      i >= 4 ? "min-[1200px]:hidden" : "min-[1200px]:flex", // 1200–1279: 4
      i >= 5 ? "xl:hidden" : "xl:flex", // xl: 5
      i >= 6 ? "2xl:hidden" : "2xl:flex", // 2xl: 6
    ].join(" ");

  return (
    <div className="hidden flex-1 items-center overflow-x-hidden xl:flex">
      {/* Pair Selector (lg+) */}
      <div
        ref={pairSelectorRef}
        className="relative flex h-full cursor-pointer items-center space-x-1 px-2 transition-colors"
        onMouseEnter={onPairSelectorEnter}
        onMouseLeave={onPairSelectorLeave}
      >
        <span className="text-pairSelectorText text-md font-bold">FSV/VND</span>
        <CaretDownOutlined className={`transition-transform ${isPairSelectorOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Metrics */}
      <div className="flex flex-1 items-center justify-start gap-2 px-2 sm:px-3 lg:px-4 xl:px-5">
        <div
          className={[
            "grid w-full place-items-center text-center",
            "gap-1 sm:gap-2",
            "grid-cols-2", // base
            "md:grid-cols-3", // md: 3
            "lg:grid-cols-3", // lg: 3 (1080 = 3)
            "min-[1200px]:grid-cols-4", // 1200–1279: 4
            "xl:grid-cols-5", // xl: 5
            "2xl:grid-cols-6", // 2xl: 6
          ].join(" ")}
        >
          {metrics.map((m, i) => (
            <div
              key={m.key}
              className={`${visibilityFor(i)} flex-col`}
            >
              <span
                className={`text-[10px] leading-tight font-bold sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm ${getToneColor(m.tone)} `}
              >
                {m.value}
              </span>
              <span className="text-[8px] leading-none uppercase sm:text-[9px] md:text-[10px] lg:text-sm xl:text-sm 2xl:text-[10px]">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
