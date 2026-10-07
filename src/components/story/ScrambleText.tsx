import React, { useEffect, useState, useRef } from 'react';
import { useMotion } from '../motion/MotionProvider';

interface ScrambleTextProps {
  text: string;
  duration?: number; // In ms, default ~1200ms
  trigger?: boolean;
  className?: string;
}

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789!@#$%^&*()_+-=~';

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  duration = 1200,
  trigger = true,
  className = '',
}) => {
  const { reducedMotion } = useMotion();
  const [displayText, setDisplayText] = useState(text);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayText(text);
      return;
    }

    if (!trigger) return;

    let startTimestamp: number | null = null;
    let rafId: number;
    const length = text.length;

    const updateScramble = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Number of characters resolved from left to right
      const resolvedCount = Math.floor(progress * length);

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        const char = text[i];
        if (char === ' ' || char === '\n') {
          scrambled += char;
        } else if (i < resolvedCount) {
          scrambled += char;
        } else if (i < resolvedCount + 3) {
          // Frontier random glyph
          scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          // Unresolved trailing glyph
          scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        rafId = requestAnimationFrame(updateScramble);
      } else {
        setDisplayText(text);
        hasAnimatedRef.current = true;
      }
    };

    rafId = requestAnimationFrame(updateScramble);

    return () => cancelAnimationFrame(rafId);
  }, [text, duration, trigger, reducedMotion]);

  return <span className={className}>{displayText}</span>;
};
