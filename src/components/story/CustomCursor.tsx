import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMotion } from '../motion/MotionProvider';

export const CustomCursor: React.FC = () => {
  const { isTouchDevice, reducedMotion } = useMotion();
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'scan'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Smooth lerp springs for cursor physics
  const springConfig = { damping: 28, stiffness: 450, mass: 0.2 };
  const cursorX = useSpring(rawX, springConfig);
  const cursorY = useSpring(rawY, springConfig);

  useEffect(() => {
    if (isTouchDevice || reducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check target element to detect interactive states
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-cursor="scan"]')) {
        setCursorType('scan');
      } else if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[data-cursor="pointer"]')
      ) {
        setCursorType('hover');
      } else {
        setCursorType('default');
      }
    };

    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    document.addEventListener('mouseenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      document.removeEventListener('mouseenter', handlePointerEnter);
    };
  }, [rawX, rawY, isTouchDevice, reducedMotion, isVisible]);

  if (isTouchDevice || reducedMotion || !isVisible) {
    return null;
  }

  // Visual variants based on cursorType
  const size = cursorType === 'scan' ? 68 : cursorType === 'hover' ? 44 : 10;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: size,
        height: size,
        backgroundColor:
          cursorType === 'scan'
            ? 'rgba(25, 22, 20, 0.88)'
            : cursorType === 'hover'
            ? 'rgba(197, 178, 227, 0.25)'
            : 'rgba(25, 22, 20, 0.9)',
        borderColor:
          cursorType === 'scan'
            ? 'rgba(197, 178, 227, 0.8)'
            : cursorType === 'hover'
            ? 'rgba(139, 116, 188, 0.6)'
            : 'transparent',
      }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border backdrop-blur-[2px] flex items-center justify-center shadow-sm select-none"
    >
      {cursorType === 'scan' && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="font-mono text-[9px] uppercase tracking-widest text-[#FAF7F0] font-semibold"
        >
          Scan
        </motion.span>
      )}
    </motion.div>
  );
};
