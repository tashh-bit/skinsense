import React from 'react';
import { cn } from '../../lib/utils';

interface EditorialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EditorialButton: React.FC<EditorialButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans tracking-wide transition-all duration-300 rounded-full font-medium active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2',
    lg: 'text-base px-8 py-4 gap-2.5 shadow-sm',
  };

  const variantStyles = {
    primary: 'bg-[#191614] text-[#FAF7F0] hover:bg-[#2F2925] hover:shadow-md hover:shadow-[#191614]/10',
    secondary: 'bg-[#F2ECE3] text-[#191614] hover:bg-[#E8DFD3] border border-[#191614]/[0.08]',
    outline: 'bg-transparent text-[#191614] border border-[#191614]/25 hover:border-[#191614] hover:bg-[#191614]/[0.03]',
    ghost: 'bg-transparent text-[#6B6259] hover:text-[#191614] hover:bg-[#191614]/[0.04]',
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
