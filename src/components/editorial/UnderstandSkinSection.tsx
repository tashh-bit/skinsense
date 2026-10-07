import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Feather, Droplets, Sun } from 'lucide-react';

export const UnderstandSkinSection: React.FC = () => {
  return (
    <section id="understand-section" className="py-20 md:py-28 border-t border-white/50 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="space-y-3">
            <Badge variant="glass" size="sm">
              Section 01 • Dermal Biology
            </Badge>
            <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
              Understand Your Skin.
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#554A42] max-w-md leading-relaxed">
            Your skin is a living, responsive ecosystem. It shifts with seasons, stress, sleep, and hydration. Traditional categories fail to capture its daily nuance.
          </p>
        </motion.div>

        {/* Editorial Magazine Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Large Visual Card (7 Cols) with Zoom & Mask Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative group rounded-[2.5rem] overflow-hidden min-h-[420px] md:min-h-[500px] glass p-2 border border-white/80 shadow-soft"
          >
            <div className="w-full h-full relative rounded-[2.25rem] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85"
                alt="Botanical skincare texture on glowing skin"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A2420]/80 via-[#2A2420]/25 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 text-[#FAF7F0] space-y-2">
                <span className="glass-chip glass-chip-warm font-mono text-[10px] uppercase tracking-wider text-[#FAF7F0] bg-white/20 border-white/40">
                  The Micro-Ecosystem
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-white">
                  Beyond Dry, Oily, or Sensitive.
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#FAF7F0]/90 max-w-lg leading-relaxed">
                  By reading surface lipid cohesion, localized thermal flush, and micro-groove depth, SkinSense interprets what your barrier actually needs today.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Complementary Pillar Cards (5 Cols) with Glass & Tilt */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard variant="glass" hoverEffect tiltEffect className="p-6 md:p-8 rounded-[28px]">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl glass-sub flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5 text-[#3D5440]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-xl font-normal text-[#2A2420]">
                      Cellular Hydration Gradient
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
                      Water reserves fluctuate hour by hour. We identify transepidermal loss before visible flaking occurs.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard variant="glass" hoverEffect tiltEffect className="p-6 md:p-8 rounded-[28px]">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl glass-sub flex items-center justify-center shrink-0">
                    <Feather className="w-5 h-5 text-[#8C6D2B]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-xl font-normal text-[#2A2420]">
                      Micro-Topography & Barrier Cohesion
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
                      Analyzing fine desquamation patterns gives you real-time insight into cellular turnover and stratum corneum health.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard variant="glass" hoverEffect tiltEffect className="p-6 md:p-8 rounded-[28px]">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl glass-sub flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5 text-[#85341E]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-xl font-normal text-[#2A2420]">
                      Vascular Reactivity & Tone
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
                      Mapping erythema and melanin concentrations allows bespoke antioxidant protection to prevent persistent hyperpigmentation.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
};
