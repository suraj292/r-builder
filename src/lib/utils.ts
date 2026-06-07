import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string | number | null | undefined): string {
  if (!date) return 'Never';
  
  const now = new Date();
  const then = new Date(date);
  
  if (isNaN(then.getTime())) return 'Invalid date';

  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 0) return 'just now'; // Future dates handle
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  
  return then.toLocaleDateString();
}

export const PAGE_HEIGHT_MM = 297;
export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_PX = 1122.5; // Approx at 96 DPI
export const PAGE_WIDTH_PX = 793.7;  // Approx at 96 DPI
