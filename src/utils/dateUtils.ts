import {
  format,
  formatDistance,
  formatRelative,
  differenceInDays,
  differenceInHours,
  isToday,
  isTomorrow,
  isYesterday,
  addDays,
  addWeeks,
  addMonths
} from 'date-fns';

/**
 * Formats a date relative to the current time in a human-readable way
 */
export const formatRelativeTime = (date: Date | number | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`;
  } else if (isTomorrow(dateObj)) {
    return `Tomorrow at ${format(dateObj, 'h:mm a')}`;
  } else if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  } else if (differenceInDays(dateObj, new Date()) < 7) {
    return formatRelative(dateObj, new Date());
  } else {
    return format(dateObj, 'MMM d, yyyy h:mm a');
  }
};

/**
 * Returns a short format of the time difference
 */
export const getTimeAgo = (date: Date | number | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

/**
 * Format a date for display in the UI
 */
export const formatDate = (
  date: Date | number | string,
  formatStr: string = 'MMM d, yyyy'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Get preset date options for scheduling
 */
export const getPresetDates = () => {
  const now = new Date();
  
  return {
    tomorrow: addDays(now, 1),
    nextWeek: addWeeks(now, 1),
    nextMonth: addMonths(now, 1)
  };
};
