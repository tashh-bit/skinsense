import React from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from './ScrambleText';
import { useMotion } from '../motion/MotionProvider';
import { Sparkles, ArrowRight } from 'lucide-react';

interface StoryScene1Props {
  progress?: number; // 0 to 1 scroll progress from parent
  isActive?: boolean;
}

export const StoryScene1: React.FC<StoryScene1Props> = ({ progress = 0, isActive = true }) => {
  const { reducedMotion } = useMotion();

  // Ken Burns zoom calculation (scale 1.0 -> 1.15 as progress increases)
  const kenBurnsScale = reducedMotion ? 1 : 1 + Math.min(progress, 1) * 0.16;

  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center px-6 sm:px-12 lg:px-20 bg-gradient-to-br from-[#FAF7F2] via-[#F5EFE6] to-[#ECE4D8] overflow-hidden select-none">
      
      {/* Subtle background luxury radial glow */}
      <div className="absolute top-1/2 right-1/4 w-[36rem] h-[36rem] rounded-full bg-[#C5A059]/[0.08] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10 py-16">
        
        {/* Left: Large Portrait with Ken Burns Push-In */}
        <div className="lg:col-span-6 flex justify-center">
          <div
            data-cursor="scan"
            className="relative w-full max-w-[440px] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-card-lavender border-2 border-white/80 bg-[#FAF7F2]"
          >
            {/* The Portrait Image with Ken Burns Scale */}
            <motion.img
              src="/assets/face-1.jpg"
              alt="Personalized Skincare Consultation"
              style={{
                scale: kenBurnsScale,
              }}
              transition={{ ease: 'easeOut', duration: 0.8 }}
              className="w-full h-full object-cover object-center filter contrast-[1.02] saturate-[0.98]"
              loading="eager"
            />

            {/* Subtle Vignette & Frame Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#191614]/40 via-transparent to-transparent pointer-events-none" />

            {/* Lens Tag */}
            <div className="absolute top-6 left-6 glass-pill px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#191614] flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8264B8] animate-ping" />
              <span>Diagnostic Focus 01</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[#FAF7F0] text-xs font-mono">
              <span className="opacity-90">Micro-Relief Analysis</span>
              <span className="bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                50mm Macro
              </span>
            </div>
          </div>
        </div>

        {/* Right: Headline with Text Scramble Effect */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#191614]/[0.06] text-xs font-mono text-[#8264B8] uppercase tracking-widest shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Scene 01 • Cellular Calibration</span>
          </div>

          {/* Scramble Headline: "Skincare. Personalized." */}
          <div className="space-y-2">
            <h2 className="editorial-heading text-5xl sm:text-6xl lg:text-7xl font-light text-[#191614] leading-[1.05] tracking-tight">
              <ScrambleText
                text="Skincare."
                duration={900}
                trigger={isActive}
                className="block font-serif text-[#191614]"
              />
              <ScrambleText
                text="Personalized."
                duration={1300}
                trigger={isActive}
                className="block italic font-serif text-[#8264B8]"
              />
            </h2>
          </div>

          <p className="font-sans text-base sm:text-lg text-[#6B6259] max-w-lg leading-relaxed pt-2">
            No two complexions share the exact same desquamation cycle or lipid profile. True dermatological efficacy begins when formulas adapt to your dermal telemetry.
          </p>

          <div className="pt-4 flex items-center gap-4 text-xs font-mono text-[#8F857B]">
            <span className="px-3 py-1.5 rounded-full bg-white/60 border border-[#191614]/[0.06]">
              Scroll to explore transition ↓
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
