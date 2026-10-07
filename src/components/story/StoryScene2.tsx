import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSkinSense } from '../../context/SkinSenseContext';
import { useMotion } from '../motion/MotionProvider';
import { PortraitCards } from './PortraitCards';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface StoryScene2Props {
  isActive?: boolean;
}

export const StoryScene2: React.FC<StoryScene2Props> = ({ isActive = true }) => {
  const { setCurrentPage } = useSkinSense();
  const { reducedMotion } = useMotion();
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const sceneNavLinks = [
    { label: 'Skin Types', action: () => {} },
    { label: 'Conditions', action: () => setCurrentPage('results') },
    { label: 'AI Scan', action: () => setCurrentPage('analyze') },
    { label: 'About', action: () => setCurrentPage('about') },
  ];

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-20 bg-[#3B2A24] text-[#FAF7F0] overflow-hidden select-none py-8">
      
      {/* Subtle warm chocolate-brown radial highlight */}
      <div className="absolute top-1/3 left-1/4 w-[40rem] h-[40rem] rounded-full bg-[#5C4033]/30 blur-[130px] pointer-events-none" />

      {/* Small Top Nav in Scene 2 with animated underline */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-20 pt-2 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xl text-white font-light">SkinSense</span>
          <span className="font-mono text-[8px] uppercase tracking-widest bg-white/15 px-2 py-0.5 rounded-full text-[#C5B2E3]">
            Spectrum
          </span>
        </div>

        <nav className="flex items-center gap-6 sm:gap-8">
          {sceneNavLinks.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="relative py-1 text-xs font-sans text-[#DDD5CB] hover:text-white transition-colors group focus:outline-none"
            >
              <span>{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C5B2E3] rounded-full transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10 my-auto py-8">
        
        {/* Left Column: Headline, Subtext & Self-Drawing Pill Button (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-[#C5B2E3] uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Scene 02 • Individual Diversity</span>
          </motion.div>

          {/* Headline: "One size does not fit all" (Line-by-line reveal) */}
          <div className="space-y-1">
            <div className="overflow-hidden">
              <motion.h3
                initial={reducedMotion ? false : { y: '100%', opacity: 0 }}
                animate={isActive ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="editorial-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-white leading-tight"
              >
                One size does
              </motion.h3>
            </div>
            <div className="overflow-hidden">
              <motion.h3
                initial={reducedMotion ? false : { y: '100%', opacity: 0 }}
                animate={isActive ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="editorial-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-[#C5B2E3] italic font-serif leading-tight"
              >
                not fit all.
              </motion.h3>
            </div>
          </div>

          {/* Subtext */}
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="font-sans text-sm sm:text-base text-[#D4CDC5] max-w-md leading-relaxed"
          >
            Every barrier possesses a unique cellular fingerprint requiring targeted lipid ratios, custom humectants, and bespoke antioxidant defense.
          </motion.p>

          {/* Outlined Pill Button "Find your skin type" (Border draws itself on entry, fills on hover) */}
          <div className="pt-4">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="inline-block"
            >
              <button
                onClick={() => setCurrentPage('analyze')}
                onMouseEnter={() => setIsBtnHovered(true)}
                onMouseLeave={() => setIsBtnHovered(false)}
                className="relative group px-8 py-4 rounded-full font-sans font-medium text-sm text-[#FAF7F0] hover:text-[#191614] overflow-hidden transition-colors duration-300 flex items-center gap-2.5 focus:outline-none"
              >
                {/* SVG Animated Self-Drawing Border */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
                  viewBox="0 0 240 56"
                  preserveAspectRatio="none"
                >
                  <motion.rect
                    x="1.5"
                    y="1.5"
                    width="237"
                    height="53"
                    rx="26.5"
                    fill={isBtnHovered ? '#FAF7F0' : 'transparent'}
                    stroke="rgba(250, 247, 240, 0.85)"
                    strokeWidth="1.5"
                    initial={{ pathLength: reducedMotion ? 1 : 0 }}
                    animate={{ pathLength: isActive ? 1 : 0 }}
                    transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="transition-colors duration-300"
                  />
                </svg>

                {/* Button Content */}
                <span className="relative z-10 flex items-center gap-2 font-medium tracking-wide">
                  <span>Find your skin type</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </motion.div>
          </div>

        </div>

        {/* Right Column: 3 Overlapping Rotated Portrait Cards (7 Cols) */}
        <div className="lg:col-span-7">
          <PortraitCards />
        </div>

      </div>

      {/* Bottom Scene Indicator */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-[#A89F96] pt-4 border-t border-white/10 z-10">
        <span>SkinSense AI • Optical Barrier Profiling</span>
        <span>Scroll to continue ↓</span>
      </div>

    </div>
  );
};
