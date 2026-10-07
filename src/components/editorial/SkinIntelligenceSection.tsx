import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Eye, Layers, Sparkles, Sliders, Shield, Zap } from 'lucide-react';

export const SkinIntelligenceSection: React.FC = () => {
  const vectors = [
    {
      icon: Layers,
      title: 'Epidermal Moisture Mapping',
      tag: 'Vector 01',
      desc: 'Samples specular reflectivity across cheek and nasal planes to estimate intracellular hydration levels.',
    },
    {
      icon: Sliders,
      title: 'Sebaceous Lipid Profiling',
      tag: 'Vector 02',
      desc: 'Assesses sebum emission balance to determine whether barrier lipids are over-compensating or depleted.',
    },
    {
      icon: Eye,
      title: 'Micro-Relief & Pore Analysis',
      tag: 'Vector 03',
      desc: 'Evaluates high-frequency surface gradients to map pore architecture, tactile roughness, and desquamation.',
    },
    {
      icon: Zap,
      title: 'Vascular Flushing & Erythema',
      tag: 'Vector 04',
      desc: 'Isolates hemoglobin chromatic channels to distinguish acute environmental redness from chronic capillary sensitivity.',
    },
    {
      icon: Sparkles,
      title: 'Melanin Dispersion Mapping',
      tag: 'Vector 05',
      desc: 'Detects UV-induced photo-pigment clusters and post-inflammatory marks across high-exposure zones.',
    },
    {
      icon: Shield,
      title: 'Barrier Integrity Synthesis',
      tag: 'Vector 06',
      desc: 'Fuses all telemetry vectors into a singular clinical Skin Health Score out of 100 with actionable next steps.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-transparent border-t border-white/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center mb-16 space-y-4"
        >
          <Badge variant="glass-warm" size="sm">
            Section 02 • Intelligent Optical Diagnostic
          </Badge>
          <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
            AI-Powered Skin Intelligence.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#554A42] leading-relaxed">
            Not guesswork. Our computer vision pipeline measures actual optical light scattering, chromatic micro-contrast, and texture vectors to decode your barrier in seconds.
          </p>
        </motion.div>

        {/* 6 Vectors Grid with Frosted Glass & 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vectors.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard
                  variant="glass"
                  hoverEffect
                  tiltEffect
                  className="p-7 rounded-[32px] flex flex-col justify-between h-full group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-[#554A42] font-semibold">
                        {v.tag}
                      </span>
                      <div className="w-10 h-10 rounded-2xl glass-sub flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-4 h-4 text-[#8C6D2B]" />
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-normal text-[#2A2420]">
                      {v.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>

                  <div className="glass-sub px-4 py-2.5 mt-6 flex items-center justify-between text-xs font-mono text-[#554A42]">
                    <span>Sampling fidelity</span>
                    <span className="text-[#3D5440] font-semibold">Sub-pixel 99.4%</span>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
