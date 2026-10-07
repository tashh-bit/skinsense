import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotion } from '../motion/MotionProvider';

interface ScanBox {
  id: string;
  name: string;
  confidence: string;
  severity: string;
  description: string;
  topPct: number; // Percentage from top
  leftPct: number; // Percentage from left
  width: number;
  height: number;
  scanTriggerDelay: number; // In seconds within the 6s loop
}

const DETECTION_BOXES: ScanBox[] = [
  {
    id: 'box-forehead',
    name: 'Fine Lines',
    confidence: '92%',
    severity: 'Early stage',
    description: 'Minimal superficial expression crease on upper forehead plane.',
    topPct: 20,
    leftPct: 40,
    width: 88,
    height: 72,
    scanTriggerDelay: 0.9,
  },
  {
    id: 'box-cheek',
    name: 'Pigmentation',
    confidence: '87%',
    severity: 'Mild cluster',
    description: 'Scattered photo-melanin concentration on upper zygomatic cheek.',
    topPct: 42,
    leftPct: 62,
    width: 96,
    height: 82,
    scanTriggerDelay: 2.1,
  },
  {
    id: 'box-pores',
    name: 'Enlarged Pores',
    confidence: '84%',
    severity: 'Normal follicular',
    description: 'Mild micro-texture dilation in central paranasal region.',
    topPct: 52,
    leftPct: 26,
    width: 90,
    height: 76,
    scanTriggerDelay: 3.1,
  },
  {
    id: 'box-chin',
    name: 'Acne / Barrier',
    confidence: '78%',
    severity: 'Calm surface',
    description: 'Minor localized erythema with low sebaceous congestion.',
    topPct: 70,
    leftPct: 42,
    width: 86,
    height: 74,
    scanTriggerDelay: 4.2,
  },
];

export const ScanOverlay: React.FC = () => {
  const { reducedMotion, normX, normY, isTouchDevice } = useMotion();
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  const [unlockedBoxes, setUnlockedBoxes] = useState<Record<string, boolean>>({});

  // Cycle lock-on boxes during initial scan
  useEffect(() => {
    if (reducedMotion) {
      // In reduced motion, lock all boxes immediately
      const all: Record<string, boolean> = {};
      DETECTION_BOXES.forEach((b) => (all[b.id] = true));
      setUnlockedBoxes(all);
      return;
    }

    DETECTION_BOXES.forEach((b) => {
      const timer = setTimeout(() => {
        setUnlockedBoxes((prev) => ({ ...prev, [b.id]: true }));
      }, b.scanTriggerDelay * 1000);
      return () => clearTimeout(timer);
    });
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 pointer-events-auto select-none overflow-visible">
      {/* 1. Horizontal Glowing Scan Line (Sweeps top-to-bottom every 6s) */}
      {!reducedMotion && (
        <motion.div
          animate={{
            top: ['-5%', '105%'],
            opacity: [0, 1, 1, 0.9, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0.5,
          }}
          className="absolute left-0 right-0 h-[2.5px] pointer-events-none z-30"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(139,116,188,0.2) 15%, rgba(197,178,227,0.95) 45%, rgba(56,189,248,0.95) 55%, rgba(139,116,188,0.2) 85%, transparent 100%)',
            boxShadow: '0 0 16px 2px rgba(197,178,227,0.7), 0 0 30px 4px rgba(56,189,248,0.4)',
          }}
        >
          {/* Subtle trailing soft glow field */}
          <div className="absolute -top-6 left-0 right-0 h-12 bg-gradient-to-b from-transparent via-[#C5B2E3]/15 to-transparent pointer-events-none blur-sm" />
        </motion.div>
      )}

      {/* 2. Detection Boxes positioned on face */}
      {DETECTION_BOXES.map((box) => {
        const isUnlocked = unlockedBoxes[box.id] ?? false;
        const isHovered = activeBoxId === box.id;

        return (
          <div
            key={box.id}
            onMouseEnter={() => setActiveBoxId(box.id)}
            onMouseLeave={() => setActiveBoxId(null)}
            className="absolute z-20 transition-transform duration-300"
            style={{
              top: `${box.topPct}%`,
              left: `${box.leftPct}%`,
              width: `${box.width}px`,
              height: `${box.height}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Box container with spring scale & gentle floating animation */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, scale: 0.7 }}
              animate={
                isUnlocked
                  ? {
                      opacity: 1,
                      scale: isHovered ? 1.08 : 1,
                      y: reducedMotion ? 0 : [0, -3, 0, 3, 0],
                    }
                  : { opacity: 0, scale: 0.7 }
              }
              transition={
                isUnlocked
                  ? {
                      scale: { duration: 0.3, ease: 'easeOut' },
                      y: {
                        duration: 4.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: box.scanTriggerDelay * 0.4,
                      },
                      opacity: { duration: 0.5 },
                    }
                  : {}
              }
              className={`relative w-full h-full cursor-pointer rounded-lg transition-colors duration-300 ${
                isHovered
                  ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.6)] backdrop-blur-[2px]'
                  : 'bg-white/[0.04]'
              }`}
            >
              {/* Corner Brackets "Lock-on" Effect */}
              {/* Top-Left */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white/95 rounded-tl-sm shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              {/* Top-Right */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white/95 rounded-tr-sm shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              {/* Bottom-Left */}
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white/95 rounded-bl-sm shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              {/* Bottom-Right */}
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white/95 rounded-br-sm shadow-[0_0_6px_rgba(255,255,255,0.8)]" />

              {/* Thin hairline perimeter with subtle breathing pulse */}
              <motion.div
                animate={
                  reducedMotion
                    ? {}
                    : {
                        opacity: [0.4, 0.85, 0.4],
                        borderColor: [
                          'rgba(255,255,255,0.45)',
                          'rgba(197,178,227,0.9)',
                          'rgba(255,255,255,0.45)',
                        ],
                      }
                }
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-lg border border-dashed border-white/60 pointer-events-none"
              />

              {/* Tiny Label Badge typing/sliding in */}
              <div className="absolute -top-6 left-0 flex items-center gap-1 bg-[#191614]/85 text-white backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 shadow-sm pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-wider font-medium text-white/90">
                  {box.name}
                </span>
              </div>

              {/* Hover Tooltip Card */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.94 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-52 p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#191614]/10 shadow-editorial text-left z-40 pointer-events-none"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#191614]/[0.06]">
                      <span className="font-sans font-semibold text-xs text-[#191614]">
                        {box.name}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#8264B8] bg-[#F3EEF9] px-2 py-0.5 rounded-full">
                        {box.confidence} match
                      </span>
                    </div>
                    <div className="pt-1.5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#6B6259]">
                        <span>Classification</span>
                        <span className="font-medium text-[#191614]">{box.severity}</span>
                      </div>
                      <p className="font-sans text-[10px] text-[#8F857B] leading-tight pt-0.5">
                        {box.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
