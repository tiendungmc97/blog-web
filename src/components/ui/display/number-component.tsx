"use client";

import { Language } from "@/libs/i18n/types";
import React from "react";
import { NumericFormat } from "react-number-format";

export interface PriceDisplayProps {
  value: number | string | null | undefined;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimalScale?: number;
  disabled?: boolean;
  invalidText?: string;
  show?: boolean;
  mask?: string | React.ReactNode;
}

export interface AmountDisplayProps {
  value: number | string | null | undefined;
  className?: string;
  decimalScale?: number;
  invalidText?: string;
  prefix?: string;
  suffix?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  value,
  className = "",
  invalidText = "-",
  prefix = "",
  suffix = "",
  decimalScale,
  show = true,
  mask = "******",
}) => {
  const locale = Language.VI;
  const finalDecimalScale = decimalScale !== undefined ? decimalScale : 2;

  if (value === null || value === undefined || isNaN(Number(value))) {
    return <span className={className}> {invalidText} </span>;
  }

  if (!show) {
    return <span className={className}>{mask}</span>;
  }

  return (
    <NumericFormat
      displayType="text"
      value={value}
      thousandSeparator={locale === Language.VI ? "." : ","}
      decimalSeparator={locale === Language.VI ? "," : "."}
      prefix={`${prefix} `}
      suffix={` ${suffix}`}
      decimalScale={finalDecimalScale}
      className={className}
    />
  );
};

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  value,
  className = "",
  decimalScale,
  invalidText,
  prefix = "",
  suffix = "",
}) => {
  const locale = Language.VI;
  const finalDecimalScale = decimalScale !== undefined ? decimalScale : 2;
  if (value === null || value === undefined || isNaN(Number(value))) {
    return <span className={className}> {invalidText} </span>;
  }
  return (
    <NumericFormat
      displayType="text"
      value={value}
      prefix={`${prefix} `}
      suffix={` ${suffix}`}
      thousandSeparator={locale === Language.VI ? "." : ","}
      decimalSeparator={locale === Language.VI ? "," : "."}
      decimalScale={finalDecimalScale}
      className={className}
    />
  );
};
