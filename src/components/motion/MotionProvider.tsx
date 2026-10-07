import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMotionValue, useSpring, MotionValue } from 'framer-motion';

interface MotionContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  normX: MotionValue<number>; // -1 to 1
  normY: MotionValue<number>; // -1 to 1
  isTouchDevice: boolean;
  reducedMotion: boolean;
}

const MotionContext = createContext<MotionContextType | null>(null);

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Raw motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawNormX = useMotionValue(0);
  const rawNormY = useMotionValue(0);

  // Smooth springs for buttery deceleration
  const springConfig = { damping: 25, stiffness: 180, mass: 0.6 };
  const mouseX = useSpring(rawX, springConfig);
  const mouseY = useSpring(rawY, springConfig);
  const normX = useSpring(rawNormX, springConfig);
  const normY = useSpring(rawNormY, springConfig);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check touch device
    const touchCheck = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouchDevice(touchCheck);

    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    if (touchCheck) return;

    let rafId: number;
    let pendingX = 0;
    let pendingY = 0;
    let hasPendingUpdate = false;

    const onPointerMove = (e: PointerEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;

      if (!hasPendingUpdate) {
        hasPendingUpdate = true;
        rafId = requestAnimationFrame(() => {
          const halfWidth = window.innerWidth / 2;
          const halfHeight = window.innerHeight / 2;

          rawX.set(pendingX - halfWidth);
          rawY.set(pendingY - halfHeight);
          rawNormX.set((pendingX - halfWidth) / halfWidth);
          rawNormY.set((pendingY - halfHeight) / halfHeight);

          hasPendingUpdate = false;
        });
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      motionQuery.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(rafId);
    };
  }, [rawX, rawY, rawNormX, rawNormY]);

  return (
    <MotionContext.Provider
      value={{
        mouseX,
        mouseY,
        normX,
        normY,
        isTouchDevice,
        reducedMotion,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
};

export const useMotion = () => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return context;
};
