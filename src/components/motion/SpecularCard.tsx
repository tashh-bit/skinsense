import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';
import { useMotion } from './MotionProvider';

interface SpecularCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'translucent' | 'dark' | 'sand';
  tiltMax?: number;
  hoverElevation?: boolean;
}

export const SpecularCard: React.FC<SpecularCardProps> = ({
  children,
  className = '',
  variant = 'light',
  tiltMax = 4.5,
  hoverElevation = true,
  ...props
}) => {
  const { isTouchDevice, reducedMotion } = useMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position inside card for specular highlight
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });

  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(rawRotX, springConfig);
  const rotateY = useSpring(rawRotY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isTouchDevice || reducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    rawRotX.set(-normY * tiltMax);
    rawRotY.set(normX * tiltMax);

    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    rawRotX.set(0);
    rawRotY.set(0);
  };

  const variantStyles = {
    light: 'bg-white/80 backdrop-blur-md border border-[#191614]/[0.06] shadow-soft text-[#191614]',
    translucent: 'bg-white/50 backdrop-blur-lg border border-white/60 shadow-soft text-[#191614]',
    dark: 'bg-[#191614] text-[#FAF7F0] border border-white/10 shadow-editorial',
    sand: 'bg-[#F5EFE6]/75 backdrop-blur-md border border-[#191614]/[0.06] shadow-soft text-[#191614]',
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isTouchDevice || reducedMotion ? 0 : rotateX,
        rotateY: isTouchDevice || reducedMotion ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 transition-shadow duration-300 ${
        hoverElevation && isHovered ? 'shadow-editorial' : ''
      } ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Dynamic Specular Sheen Overlay */}
      {!isTouchDevice && !reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-3xl"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(450px circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(255,255,255,0.35), transparent 70%)`,
          }}
        />
      )}

      {/* Content wrapper with slight 3D translation */}
      <div style={{ transform: 'translateZ(10px)' }}>{children}</div>
    </motion.div>
  );
};
