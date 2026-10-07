import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'glass' | 'glass-warm' | 'glass-lavender' | 'sage' | 'champagne' | 'terracotta' | 'taupe' | 'neutral' | 'dark';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'glass',
  className,
  size = 'md',
}) => {
  const variantStyles = {
    glass: 'glass-chip',
    'glass-warm': 'glass-chip glass-chip-warm',
    'glass-lavender': 'glass-chip glass-chip-lavender',
    sage: 'bg-[#EEF3EE]/75 backdrop-blur-md text-[#2B3E2E] border border-[#C5D8C8] shadow-sm hover:scale-[1.04]',
    champagne: 'glass-chip glass-chip-warm font-mono',
    terracotta: 'bg-[#FDF2EE]/75 backdrop-blur-md text-[#85341E] border border-[#F0D1C6] shadow-sm hover:scale-[1.04]',
    taupe: 'glass-chip',
    neutral: 'glass-chip',
    dark: 'bg-[#191614]/90 backdrop-blur-md text-[#FAF7F0] border border-white/20 shadow-sm hover:scale-[1.04]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-wider',
    md: 'text-xs px-3.5 py-1 tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
