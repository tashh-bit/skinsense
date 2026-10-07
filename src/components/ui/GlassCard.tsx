import React, { useState, useCallback } from 'react';
import { cn } from '../../lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'strong' | 'sub' | 'light' | 'dark';
  hoverEffect?: boolean;
  tiltEffect?: boolean;
  blurIn?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'glass',
  hoverEffect = true,
  tiltEffect = true,
  blurIn = false,
  style,
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tiltEffect && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        // Max 3 degrees tilt toward cursor
        const rx = Number((-py * 6).toFixed(2));
        const ry = Number((px * 6).toFixed(2));
        setTilt({ rx, ry });
      }
      onMouseMove?.(e);
    },
    [tiltEffect, onMouseMove]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setTilt({ rx: 0, ry: 0 });
      onMouseLeave?.(e);
    },
    [onMouseLeave]
  );

  const variantClass = {
    glass: 'glass',
    strong: 'glass-strong rounded-3xl',
    sub: 'glass-sub',
    light: 'glass',
    dark: 'bg-[#191614]/90 backdrop-blur-xl border border-white/15 text-[#FAF7F0] rounded-3xl shadow-editorial',
  }[variant];

  const dynamicTransform =
    tilt.rx !== 0 || tilt.ry !== 0
      ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
      : undefined;

  return (
    <div
      className={cn(
        variantClass,
        hoverEffect && 'glass-interactive',
        blurIn && 'animate-blur-in',
        className
      )}
      style={{
        transform: dynamicTransform,
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};
