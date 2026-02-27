import { store } from "@/store";
import { Language } from "@/types/language";
import { Currency } from "@/types/settings";

export interface FormatNumberOptions {
  decimalScale?: number;
  invalidText?: string;
  show?: boolean;
  mask?: string;
  locale?: Language;
  removeTrailingZeros?: boolean;
}

export interface FormatPriceOptions extends FormatNumberOptions {
  prefix?: string;
  suffix?: string;
}

export interface FormatAmountOptions extends FormatNumberOptions {
  symbol?: string;
}

/**
 * Formats a price value with currency symbol and localization
 * @param value The numeric value to format
 * @param options Formatting options
 * @returns Formatted price string
 */
export const formatDisplayPrice = (
  value: number | string | null | undefined,
  options: FormatPriceOptions = {},
): string => {
  const currency = store.getState().setting.currency ?? Currency.VND;
  const {
    invalidText = "-",
    prefix = "",
    suffix = "",
    decimalScale,
    show = true,
    mask = "******",
    locale = Language.VI,
    removeTrailingZeros = true,
  } = options;

  const finalDecimalScale = decimalScale !== undefined ? decimalScale : currency === Currency.VND ? 0 : 2;

  if (value === null || value === undefined || isNaN(Number(value))) {
    return invalidText;
  }

  if (!show) {
    return `${prefix} ${mask} ${suffix}`;
  }

  const numericValue = Number(value);
  const thousandSeparator = locale === Language.VI ? "." : ",";
  const decimalSeparator = locale === Language.VI ? "," : ".";

  // Format the number with appropriate separators
  const formattedNumber = numericValue.toFixed(finalDecimalScale);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = formattedNumber.split(thousandSeparator);

  // Remove trailing zeros from decimal part (if enabled)
  const trimmedDecimalPart = removeTrailingZeros && decimalPart ? decimalPart.replace(/0+$/, "") : decimalPart;

  // Add thousand separators to integer part
  const formattedIntegerPart = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  // Combine parts with appropriate decimal separator
  const finalFormattedNumber =
    finalDecimalScale > 0 && trimmedDecimalPart
      ? `${formattedIntegerPart}${decimalSeparator}${trimmedDecimalPart}`
      : formattedIntegerPart;

  return `${prefix} ${finalFormattedNumber} ${suffix}`;
};

/**
 * Formats an amount value with localization
 * @param value The numeric value to format
 * @param options Formatting options
 * @returns Formatted amount string
 */
export const formatDisplayAmount = (
  value: number | string | null | undefined,
  options: FormatAmountOptions = {},
): string => {
  const {
    decimalScale = 2,
    symbol,
    invalidText = "-",
    show = true,
    mask = "******",
    locale = Language.VI,
    removeTrailingZeros = true,
  } = options;

  if (value === null || value === undefined || isNaN(Number(value))) {
    return invalidText;
  }

  if (!show) {
    return mask;
  }

  const numericValue = Number(value);
  const thousandSeparator = locale === Language.VI ? "." : ",";
  const decimalSeparator = locale === Language.VI ? "," : ".";

  // Format the number with appropriate separators
  const formattedNumber = numericValue.toFixed(decimalScale);

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = formattedNumber.split(thousandSeparator);

  // Remove trailing zeros from decimal part (if enabled)
  const trimmedDecimalPart = removeTrailingZeros && decimalPart ? decimalPart.replace(/0+$/, "") : decimalPart;

  // Remove trailing zeros from integer part (if enabled)
  const trimmedIntegerPart =
    removeTrailingZeros && integerPart ? removeTrailingZerosFromInteger(integerPart) : integerPart;

  // Add thousand separators to integer part
  const formattedIntegerPart = trimmedIntegerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) ?? "";

  // Combine parts with appropriate decimal separator
  const finalFormattedNumber =
    decimalScale > 0 && trimmedDecimalPart
      ? `${formattedIntegerPart}${decimalSeparator}${trimmedDecimalPart}`
      : formattedIntegerPart;

  return symbol ? `${symbol}${finalFormattedNumber}` : finalFormattedNumber;
};

/**
 * Utility function to remove trailing zeros from integer part
 * @param integerPart The integer part as string
 * @returns Integer part with trailing zeros removed
 */
const removeTrailingZerosFromInteger = (integerPart: string): string => {
  // Remove trailing zeros but keep at least one digit
  return integerPart.replace(/0+$/, "") || "0";
};

/**
 * Utility function to get currency symbol
 * @param currency Currency type
 * @returns Currency symbol string
 */
export const getCurrencySymbol = (currency: Currency): string => {
  const currencySymbols: Record<Currency, string> = {
    [Currency.USD]: "$",
    [Currency.VND]: "₫",
  };
  return currencySymbols[currency] ?? "$";
};
