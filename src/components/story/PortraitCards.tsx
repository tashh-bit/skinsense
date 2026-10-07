import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMotion } from '../motion/MotionProvider';
import { Sparkles } from 'lucide-react';

interface SkinCard {
  id: string;
  image: string;
  title: string;
  tag: string;
  clinicalFeature: string;
  rotation: number;
  heightClass: string;
  delayOffset: number;
}

const CARDS: SkinCard[] = [
  {
    id: 'type-1',
    image: '/assets/skin-type-1.jpg',
    title: 'Rich & Resilient',
    tag: 'Oily / Balanced',
    clinicalFeature: 'Dense melanin matrix with high natural ceramide cohesion.',
    rotation: -4.5,
    heightClass: 'h-[370px] sm:h-[440px]',
    delayOffset: 0,
  },
  {
    id: 'type-2',
    image: '/assets/skin-type-2.jpg',
    title: 'Glass & Luminous',
    tag: 'Normal / Dewy',
    clinicalFeature: 'High intracellular water volume with low trans-epidermal loss.',
    rotation: 1.5,
    heightClass: 'h-[410px] sm:h-[480px]',
    delayOffset: 0.15,
  },
  {
    id: 'type-3',
    image: '/assets/skin-type-3.jpg',
    title: 'Sun-Kissed & Delicate',
    tag: 'Dry / Sensitive',
    clinicalFeature: 'Subtle photo-reactivity requiring rich antioxidant buffering.',
    rotation: -2.5,
    heightClass: 'h-[360px] sm:h-[420px]',
    delayOffset: 0.3,
  },
];

export const PortraitCards: React.FC = () => {
  const { reducedMotion } = useMotion();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  return (
    <div className="relative flex items-center justify-center w-full max-w-lg mx-auto py-8">
      <div className="flex items-center justify-center -space-x-12 sm:-space-x-16">
        {CARDS.map((card, index) => {
          const isHovered = hoveredCardId === card.id;

          return (
            <motion.div
              key={card.id}
              initial={reducedMotion ? false : { opacity: 0, x: 70, rotate: 0 }}
              whileInView={{ opacity: 1, x: 0, rotate: card.rotation }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.9,
                delay: card.delayOffset,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              data-cursor="scan"
              style={{
                zIndex: isHovered ? 40 : index === 1 ? 20 : 10,
              }}
              className="relative cursor-pointer transition-all duration-300"
            >
              {/* Card container with floating respiration */}
              <motion.div
                animate={
                  reducedMotion
                    ? {}
                    : {
                        y: isHovered ? -8 : [-5, 5, -5],
                      }
                }
                transition={
                  reducedMotion
                    ? {}
                    : {
                        y: {
                          duration: 4.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 1.2,
                        },
                      }
                }
                whileHover={{ scale: 1.05, rotate: 0 }}
                className={`relative w-[180px] sm:w-[220px] ${card.heightClass} rounded-[2rem] overflow-hidden bg-[#2C1F1A] border-2 border-white/20 shadow-editorial transition-shadow duration-300 ${
                  isHovered ? 'shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-white/60' : ''
                }`}
              >
                {/* Portrait photograph */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover filter contrast-[1.03] select-none"
                  loading="lazy"
                />

                {/* Soft gradient bottom scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Top Corner Pill: Tag Badge */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FAF7F0] border border-white/20">
                    {card.tag}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                </div>

                {/* Bottom Content Area */}
                <div className="absolute bottom-5 left-4 right-4 text-[#FAF7F0] space-y-1">
                  <h4 className="font-serif text-lg font-light text-white">
                    {card.title}
                  </h4>
                  <p className="font-sans text-[10px] text-[#DDD5CB] leading-tight line-clamp-2">
                    {card.clinicalFeature}
                  </p>
                </div>

                {/* Hover Glow Highlight */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 border-2 border-[#C5B2E3] rounded-[2rem] pointer-events-none"
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
