import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PAGE_HEIGHT_MM = 297;
export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_PX = 1122.5; // Approx at 96 DPI
export const PAGE_WIDTH_PX = 793.7;  // Approx at 96 DPI
