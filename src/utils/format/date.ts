import { store } from "@/store";
import dayjs, { DATE_FORMATS, DateFormat, dateHelpers, TIMEZONES, type DateInput } from "@/utils/dayjs";

export interface FormatDateOptions {
  format?: DateFormat;
  showTooltip?: boolean;
  tooltipFormat?: DateFormat;
  invalidText?: string;
}

/**
 * Formats a date value with timezone conversion
 * @param value The date to format (UTC timezone)
 * @param options Formatting options
 * @returns Formatted date string
 */
export const formatDisplayDate = (value: DateInput, options: FormatDateOptions = {}): string => {
  const { format = DATE_FORMATS.DISPLAY_SECONDS_TIME_DATE, invalidText = "-" } = options;
  const timezone = store.getState().setting.timezone || TIMEZONES.VIETNAM;
  const isDateValid = dateHelpers.isValid(value);

  if (!isDateValid) {
    return invalidText;
  }

  return dateHelpers.fromUtcToTimezone(value, timezone, format);
};

/**
 * Gets the current time formatted with timezone
 * @param options Formatting options
 * @returns Current formatted time string
 */
export const getCurrentTime = (options: FormatDateOptions = {}): string => {
  const { format = DATE_FORMATS.DISPLAY_SECONDS_TIME_DATE } = options;
  const timezone = store.getState().setting.timezone || TIMEZONES.VIETNAM;
  const now = new Date();
  return dayjs(now).tz(timezone).format(format);
};
