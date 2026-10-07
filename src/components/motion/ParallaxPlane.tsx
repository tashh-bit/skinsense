import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { useMotion } from './MotionProvider';

interface ParallaxPlaneProps {
  children?: React.ReactNode;
  depthX?: number;
  depthY?: number;
  rotateDepth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ParallaxPlane: React.FC<ParallaxPlaneProps> = ({
  children,
  depthX = 15,
  depthY = 15,
  rotateDepth = 0,
  className = '',
  style = {},
}) => {
  const { normX, normY, isTouchDevice, reducedMotion } = useMotion();

  const x = useTransform(normX, [-1, 1], [-depthX, depthX]);
  const y = useTransform(normY, [-1, 1], [-depthY, depthY]);
  const rotateX = useTransform(normY, [-1, 1], [rotateDepth, -rotateDepth]);
  const rotateY = useTransform(normX, [-1, 1], [-rotateDepth, rotateDepth]);

  if (isTouchDevice || reducedMotion || (depthX === 0 && depthY === 0 && rotateDepth === 0)) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
