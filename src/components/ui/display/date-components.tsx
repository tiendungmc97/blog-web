import React, { useEffect, useState } from "react";
import { useDateFormat, useRelativeTime, useLocalizedDate, useCountdown } from "@/hooks/use-dayjs";
import dayjs, { DATE_FORMATS, DateFormat, dateHelpers, TIMEZONES, type DateInput } from "@/utils/dayjs";
import { useAppSelector } from "@/store";

interface BaseDateProps {
  date: DateInput;
  className?: string;
  title?: string;
}

interface DateDisplayProps extends BaseDateProps {
  format?: DateFormat;
  showTooltip?: boolean;
  tooltipFormat?: DateFormat;
}

interface RelativeTimeProps extends BaseDateProps {
  updateInterval?: number;
  showTooltip?: boolean;
  tooltipFormat?: DateFormat;
}

interface CountdownProps extends BaseDateProps {
  onExpire?: () => void;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  expiredText?: string;
}

/**
 * Component for displaying formatted dates
 * @param date - The date to display. Note: date is timezone UTC.
 */
export function DateDisplay({
  date,
  format = DATE_FORMATS.DISPLAY_SECONDS_TIME_DATE,
  className,
  title,
  showTooltip = false,
  tooltipFormat = DATE_FORMATS.DISPLAY_SECONDS_TIME_DATE,
}: DateDisplayProps) {
  const isDateValid = dateHelpers.isValid(date);

  const timezone = useAppSelector((state) => state.setting.timezone) ?? TIMEZONES.VIETNAM;
  const formattedDate = dateHelpers.fromUtcToTimezone(date, timezone, format);
  const tooltipText = showTooltip ? dateHelpers.fromUtcToTimezone(date, timezone, tooltipFormat) : undefined;

  if (!isDateValid || date === null || date === undefined) {
    return "-";
  }

  return (
    <time
      dateTime={new Date(date as any).toISOString()}
      className={className}
      title={title || tooltipText}
    >
      {formattedDate}
    </time>
  );
}

export function CurrentTime({
  format = DATE_FORMATS.DISPLAY_SECONDS_TIME_DATE,
  className,
  title,
}: {
  format?: DateFormat;
  className?: string;
  title?: string;
}) {
  const timezone = useAppSelector((state) => state.setting.timezone) ?? TIMEZONES.VIETNAM;
  const [now, setNow] = useState(new Date());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = dayjs(now).tz(timezone).format(format);
  if (!hydrated) {
    return <span className={className}></span>;
  }
  return (
    <time
      dateTime={now.toISOString()}
      className={className}
      title={title}
    >
      {formattedDate}
    </time>
  );
}

/**
 * Component for countdown timer
 * @param date - The target date for the countdown. Note: date is timezone UTC.
 */
export function Countdown({
  date,
  onExpire,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  expiredText = "Expired",
  className,
  title,
}: CountdownProps) {
  const countdown = useCountdown(date);
  React.useEffect(() => {
    if (countdown.isExpired && onExpire) {
      onExpire();
    }
  }, [countdown.isExpired, onExpire]);

  if (countdown.isExpired) {
    return (
      <span
        className={className}
        title={title}
      >
        {expiredText}
      </span>
    );
  }

  const parts = [];

  if (showDays && countdown.days > 0) {
    parts.push(`${countdown.days}d`);
  }

  if (showHours && countdown.hours > 0) {
    parts.push(`${countdown.hours}`);
  }

  if (showMinutes && countdown.minutes > 0) {
    const minutes = showMinutes ? countdown.minutes.toString().padStart(2, "0") : "00";
    parts.push(`${minutes}`);
  }

  if (showSeconds) {
    const seconds = showSeconds ? countdown.seconds.toString().padStart(2, "0") : "00";
    parts.push(`${seconds}`);
  }

  return (
    <time
      dateTime={new Date(date as any).toISOString()}
      className={className}
      title={title}
    >
      {parts.join(":")}
    </time>
  );
}

/**
 * Component for displaying relative time (e.g., "2 hours ago")
 */
export function RelativeTime({
  date,
  updateInterval = 60000,
  className,
  title,
  showTooltip = true,
  tooltipFormat = DATE_FORMATS.DISPLAY_DATE_TIME,
}: RelativeTimeProps) {
  const relativeTime = useRelativeTime(date, updateInterval);
  const toolTipMessage = useLocalizedDate(date, tooltipFormat);
  const tooltipText = showTooltip ? toolTipMessage : undefined;

  return (
    <time
      dateTime={new Date(date as any).toISOString()}
      className={className}
      title={title || tooltipText}
    >
      {relativeTime}
    </time>
  );
}

/**
 * Component that intelligently chooses between relative time and absolute time
 * based on how old the date is
 */
export function SmartDate({
  date,
  className,
  title,
  relativeDays = 7, // Show relative time for dates within this many days
}: BaseDateProps & { relativeDays?: number }) {
  const now = new Date();
  const dateObj = new Date(date as any);
  const diffInDays = Math.abs((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays <= relativeDays) {
    return (
      <RelativeTime
        date={date}
        className={className}
        title={title}
        showTooltip={true}
      />
    );
  }

  return (
    <DateDisplay
      date={date}
      format={DATE_FORMATS.DISPLAY_DATE}
      className={className}
      title={title}
      showTooltip={true}
    />
  );
}

/**
 * Component for displaying date ranges
 */
export function DateRange({
  startDate,
  endDate,
  format = DATE_FORMATS.DISPLAY_DATE,
  separator = " - ",
  className,
  title,
}: {
  startDate: DateInput;
  endDate: DateInput;
  format?: string;
  separator?: string;
  className?: string;
  title?: string;
}) {
  const formattedStartDate = useDateFormat(startDate, format);
  const formattedEndDate = useDateFormat(endDate, format);

  return (
    <span
      className={className}
      title={title}
    >
      <time dateTime={new Date(startDate as any).toISOString()}>{formattedStartDate}</time>
      {separator}
      <time dateTime={new Date(endDate as any).toISOString()}>{formattedEndDate}</time>
    </span>
  );
}
