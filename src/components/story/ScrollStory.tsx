import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { StoryScene1 } from './StoryScene1';
import { StoryScene2 } from './StoryScene2';
import { useMotion } from '../motion/MotionProvider';

export const ScrollStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotion();
  const [activeScene, setActiveScene] = useState<1 | 2>(1);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Track scroll progress through the pinned container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Scene 1 parallax upward shift while covered
  const scene1Y = useTransform(scrollYProgress, [0.3, 0.7], ['0%', '-18%']);
  const scene1Opacity = useTransform(scrollYProgress, [0.45, 0.7], [1, 0.2]);

  // Skewed angled wipe transition (wipes up from bottom to top)
  const wipeClipPath = useTransform(
    scrollYProgress,
    [0.32, 0.52, 0.72],
    [
      'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      'polygon(0% 24%, 100% 4%, 100% 100%, 0% 100%)',
      'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    ]
  );

  // Monitor progress for scene activation
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setCurrentProgress(latest);
    if (latest >= 0.5) {
      if (activeScene !== 2) setActiveScene(2);
    } else {
      if (activeScene !== 1) setActiveScene(1);
    }
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[240vh] bg-[#3B2A24]"
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Subtle SVG Cinematic Film Grain Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-40 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Scene Indicator Navigation Dots */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3">
          <button
            onClick={() => {
              if (containerRef.current) {
                const top = containerRef.current.offsetTop;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeScene === 1
                ? 'bg-[#191614] scale-125'
                : 'bg-[#191614]/30 hover:bg-[#191614]/60'
            }`}
            aria-label="Scene 1"
          />
          <button
            onClick={() => {
              if (containerRef.current) {
                const top = containerRef.current.offsetTop + containerRef.current.offsetHeight * 0.65;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeScene === 2
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label="Scene 2"
          />
        </div>

        {/* LAYER 1: Scene 1 ("Skincare. Personalized.") */}
        <motion.div
          style={{
            y: reducedMotion ? '0%' : scene1Y,
            opacity: reducedMotion ? (activeScene === 1 ? 1 : 0) : scene1Opacity,
          }}
          className="absolute inset-0 w-full h-full z-10"
        >
          <StoryScene1 progress={currentProgress * 2.2} isActive={activeScene === 1} />
        </motion.div>

        {/* LAYER 2: Scene 2 ("One size does not fit all.") with Angled Skewed Wipe */}
        <motion.div
          style={{
            clipPath: reducedMotion
              ? activeScene === 2
                ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
              : wipeClipPath,
          }}
          className="absolute inset-0 w-full h-full z-20 overflow-hidden"
        >
          <StoryScene2 isActive={activeScene === 2} />
        </motion.div>

      </div>
    </section>
  );
};
