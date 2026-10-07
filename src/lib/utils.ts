import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreColor(score: number): { text: string; bg: string; border: string; ring: string } {
  if (score >= 85) {
    return {
      text: 'text-sage-DEFAULT',
      bg: 'bg-sage-light',
      border: 'border-sage-DEFAULT/30',
      ring: '#526E55',
    };
  }
  if (score >= 75) {
    return {
      text: 'text-champagne-dark',
      bg: 'bg-champagne-light',
      border: 'border-champagne-DEFAULT/30',
      ring: '#C5A059',
    };
  }
  return {
    text: 'text-terracotta-DEFAULT',
    bg: 'bg-terracotta-light',
    border: 'border-terracotta-DEFAULT/30',
    ring: '#B8583E',
  };
}
