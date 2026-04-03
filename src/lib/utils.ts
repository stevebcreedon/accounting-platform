import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to Irish-style "D MMM YYYY" format.
 * Example: "2026-03-15" -> "15 Mar 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get Irish tax year string from a date.
 * Example: "2025-06-15" -> "2025/26"
 */
export function getTaxYear(dateString: string): string {
  const year = new Date(dateString).getFullYear();
  return `${year}/${(year + 1).toString().slice(-2)}`;
}
