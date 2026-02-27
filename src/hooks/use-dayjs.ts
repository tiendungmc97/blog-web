import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import dayjs, { dateHelpers, DATE_FORMATS, type DateInput } from "@/utils/dayjs";

/**
 * Hook for reactive date formatting that updates automatically
 * Useful for displaying relative times that update in real-time
 */
export function useDateFormat(date: DateInput, format: string = DATE_FORMATS.DISPLAY_DATE, updateInterval?: number) {
  const [formattedDate, setFormattedDate] = useState(() => dayjs(date).format(format));

  useEffect(() => {
    const updateDate = () => {
      setFormattedDate(dayjs(date).format(format));
    };

    updateDate();

    if (updateInterval) {
      const interval = setInterval(updateDate, updateInterval);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [date, format, updateInterval]);

  return formattedDate;
}

/**
 * Hook for relative time that updates automatically
 * e.g., "2 minutes ago" -> "3 minutes ago"
 */
export function useRelativeTime(date: DateInput, updateInterval: number = 60000) {
  const [relativeTime, setRelativeTime] = useState(() => dateHelpers.formatRelative(date));

  useEffect(() => {
    const updateRelativeTime = () => {
      setRelativeTime(dateHelpers.formatRelative(date));
    };

    updateRelativeTime();

    const interval = setInterval(updateRelativeTime, updateInterval);
    return () => clearInterval(interval);
  }, [date, updateInterval]);

  return relativeTime;
}

/**
 * Hook for locale-aware date formatting
 * Automatically updates when locale changes
 */
export function useLocalizedDate(date: DateInput, format: string = DATE_FORMATS.LOCALIZED_DATE) {
  const locale = useLocale();

  const [localizedDate, setLocalizedDate] = useState(() => {
    // Set locale for dayjs
    const currentDayjs = dayjs(date);
    return currentDayjs.format(format);
  });

  useEffect(() => {
    // Import locale dynamically based on current locale
    const loadLocale = async () => {
      try {
        let dayjsLocale;
        switch (locale) {
          case "vi":
            dayjsLocale = await import("dayjs/locale/vi");
            break;
          case "en":
          default:
            dayjsLocale = await import("dayjs/locale/en");
            break;
        }

        dayjs.locale(dayjsLocale.default);
        setLocalizedDate(dayjs(date).format(format));
      } catch (error) {
        console.warn(`Failed to load dayjs locale for ${locale}:`, error);
        // Fallback to default formatting
        setLocalizedDate(dayjs(date).format(format));
      }
    };

    loadLocale();
  }, [date, format, locale]);

  return localizedDate;
}

/**
 * Hook for timezone-aware date display
 */
export function useTimezoneDate(date: DateInput, timezone: string, format: string = DATE_FORMATS.DISPLAY_DATE_TIME) {
  const [timezoneDate, setTimezoneDate] = useState(() => dateHelpers.toTimezone(date, timezone).format(format));

  useEffect(() => {
    setTimezoneDate(dateHelpers.toTimezone(date, timezone).format(format));
  }, [date, timezone, format]);

  return timezoneDate;
}

/**
 * Hook for checking if a date matches certain conditions
 * Returns an object with various boolean checks
 */
export function useDateChecks(date: DateInput) {
  const [checks, setChecks] = useState(() => ({
    isToday: dateHelpers.isToday(date),
    isYesterday: dateHelpers.isYesterday(date),
    isTomorrow: dateHelpers.isTomorrow(date),
    isValid: dateHelpers.isValid(date),
    isPast: dayjs(date).isBefore(dayjs()),
    isFuture: dayjs(date).isAfter(dayjs()),
  }));

  useEffect(() => {
    setChecks({
      isToday: dateHelpers.isToday(date),
      isYesterday: dateHelpers.isYesterday(date),
      isTomorrow: dateHelpers.isTomorrow(date),
      isValid: dateHelpers.isValid(date),
      isPast: dayjs(date).isBefore(dayjs()),
      isFuture: dayjs(date).isAfter(dayjs()),
    });
  }, [date]);

  return checks;
}

/**
 * Hook for countdown timer
 * Returns time remaining until target date
 */
export function useCountdown(targetDate: DateInput) {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const now = dayjs().utc();
    const target = dayjs.utc(targetDate);

    return {
      days: target.diff(now, "d"),
      hours: target.diff(now, "h") % 24,
      minutes: target.diff(now, "m"),
      seconds: target.diff(now, "s") % 60,
      totalMilliseconds: target.diff(now),
      isExpired: target.isBefore(now),
    };
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = dayjs().utc();
      const target = dayjs.utc(targetDate);

      setTimeRemaining({
        days: target.diff(now, "d"),
        hours: target.diff(now, "h") % 24,
        minutes: target.diff(now, "m") % 60,
        seconds: target.diff(now, "s") % 60,
        totalMilliseconds: target.diff(now),
        isExpired: target.isBefore(now),
      });
    };
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeRemaining;
}
