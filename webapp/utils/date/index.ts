import dayjs from 'dayjs';

/**
 * Parse a date and return a formatted string
 * @param date - The date to parse
 * @param withTime - Whether to include time in the output
 * @returns Formatted date string or "---" if invalid
 */
export const parseDate = (date: any, withTime = true): string => {
    const dt = dayjs(date);
    if (dt.isValid()) {
        return withTime 
            ? dt.format('D MMMM YYYY, h:mm:ss a')
            : dt.format('D MMMM YYYY');
    }
    return date ?? "---";
};

/**
 * Format a date string according to the specified format
 * @param str - The date string to format
 * @param format - The format to apply
 * @returns Formatted date string or "---" if invalid
 */
export const formatDate = (str: any, format: string): string => {
    const dt = dayjs(str);
    if (dt.isValid()) {
        return dt.format(format);
    }
    return str ?? "---";
};

/**
 * Calculate the number of days between two dates
 * @param first - First date
 * @param second - Second date
 * @returns Number of days between dates
 */
export const subtractDates = (first: any, second: any): number => 
    Math.floor(Math.abs(first - second) / (1000 * 60 * 60 * 24)); 