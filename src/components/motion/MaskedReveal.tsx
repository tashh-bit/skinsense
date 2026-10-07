import React from 'react';
import { motion } from 'framer-motion';
import { useMotion } from './MotionProvider';

interface MaskedRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const MaskedReveal: React.FC<MaskedRevealProps> = ({
  children,
  delay = 0,
  duration = 0.85,
  yOffset = 100,
  className = '',
}) => {
  const { reducedMotion } = useMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: `${yOffset}%`, opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Exponential luxury ease
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
