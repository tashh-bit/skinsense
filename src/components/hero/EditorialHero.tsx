import React from 'react';
import { motion } from 'framer-motion';
import { useSkinSense } from '../../context/SkinSenseContext';
import { EditorialButton } from '../ui/EditorialButton';
import { Badge } from '../ui/Badge';
import { MaskedReveal } from '../motion/MaskedReveal';
import { ParallaxPlane } from '../motion/ParallaxPlane';
import { MagneticPill } from '../motion/MagneticPill';
import { SpecularCard } from '../motion/SpecularCard';
import { Sparkles, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export const EditorialHero: React.FC = () => {
  const { setCurrentPage } = useSkinSense();

  return (
    <section className="relative pt-6 pb-20 md:py-20 lg:py-24 overflow-hidden">
      
      {/* Layer 2: Subtle Ambient Diffusion Glow (Parallax Layer) */}
      <ParallaxPlane
        depthX={-10}
        depthY={-10}
        className="absolute top-1/4 right-1/4 w-[32rem] h-[32rem] bg-[#C5A059]/[0.08] rounded-full blur-[100px] pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Masked Typography & Narrative */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 z-10">
            
            {/* Supertitle badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2"
            >
              <Badge variant="champagne" size="md">
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Next-Generation Digital Dermatology</span>
              </Badge>
            </motion.div>

            {/* Masked Editorial Headline (Line-by-Line Reveal) */}
            <div className="space-y-1">
              <MaskedReveal delay={0.15} yOffset={110}>
                <h1 className="editorial-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-light text-[#191614]">
                  Your skin,
                </h1>
              </MaskedReveal>
              <MaskedReveal delay={0.3} yOffset={110}>
                <h1 className="editorial-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-light text-[#78644E] italic font-serif">
                  understood.
                </h1>
              </MaskedReveal>
            </div>

            {/* Supporting Copy */}
            <MaskedReveal delay={0.45} yOffset={60}>
              <p className="font-sans text-base sm:text-lg text-[#6B6259] max-w-xl leading-relaxed">
                Understand your skin with intelligent optical analysis and personalized clinical care recommendations. An intimate consultation designed to decode your barrier, hydration, and micro-texture.
              </p>
            </MaskedReveal>

            {/* Action Buttons with Magnetic Pull */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <MagneticPill strength={0.3}>
                <EditorialButton
                  variant="primary"
                  size="lg"
                  onClick={() => setCurrentPage('analyze')}
                  className="group relative overflow-hidden"
                >
                  {/* Subtle specular sweep on hover */}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Analyze My Skin</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </EditorialButton>
              </MagneticPill>

              <MagneticPill strength={0.2}>
                <EditorialButton
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('understand-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Explore SkinSense</span>
                </EditorialButton>
              </MagneticPill>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="pt-6 border-t border-[#191614]/[0.07] flex flex-wrap items-center gap-6 text-xs text-[#8F857B]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#526E55]" />
                <span>Private & Client-Side Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C5A059]" />
                <span>6 Clinical Diagnostic Dimensions</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Layered 3D Stereoscopic Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Layer 3: Central Portrait Frame (Negative Inverted Parallax) */}
              <ParallaxPlane depthX={-12} depthY={-8} className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative rounded-[2.5rem] overflow-hidden shadow-editorial aspect-[4/5] border border-[#191614]/[0.08] bg-[#F5EFE6]"
                >
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85"
                    alt="Luminous natural skin portrait"
                    className="w-full h-full object-cover object-center filter saturate-[0.95] contrast-[1.02] transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Atmospheric overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191614]/40 via-transparent to-transparent pointer-events-none" />

                  {/* Subtitle tag at base of photo */}
                  <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[#FAF7F0]">
                    <span className="font-mono text-[10px] uppercase tracking-widest opacity-90">
                      Spectral Skin Scan
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#FAF7F0] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                      Live Telemetry
                    </span>
                  </div>
                </motion.div>
              </ParallaxPlane>

              {/* Layer 4: Floating Skin Health Score Card (Positive Parallax + 3D Tilt) */}
              <ParallaxPlane
                depthX={26}
                depthY={20}
                rotateDepth={3}
                className="absolute -top-6 -right-4 sm:-right-6 z-20"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SpecularCard variant="light" className="p-4 rounded-3xl shadow-editorial">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF5EA] border border-[#E8DAC0] flex items-center justify-center">
                        <span className="font-serif text-2xl font-semibold text-[#191614]">82</span>
                      </div>
                      <div>
                        <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#191614]">
                          Skin Score
                        </p>
                        <p className="font-sans text-[10px] text-[#526E55] font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#526E55] animate-ping" />
                          Optimal Equilibrium
                        </p>
                      </div>
                    </div>
                  </SpecularCard>
                </motion.div>
              </ParallaxPlane>

              {/* Layer 5: Floating Hydration Metric Capsule (Deep Positive Parallax) */}
              <ParallaxPlane
                depthX={32}
                depthY={26}
                rotateDepth={-3}
                className="absolute -bottom-6 -left-4 sm:-left-6 z-20 max-w-[210px]"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SpecularCard variant="light" className="p-4 rounded-3xl shadow-editorial">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-sans text-[11px] uppercase tracking-wider text-[#6B6259]">
                          Hydration
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#191614]">78%</span>
                      </div>
                      <div className="w-full bg-[#EBE4D8] h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '78%' }}
                          transition={{ duration: 1.2, delay: 1.2, ease: 'easeOut' }}
                          className="bg-[#C5A059] h-full rounded-full"
                        />
                      </div>
                      <p className="font-sans text-[9px] text-[#8F857B] leading-tight">
                        Healthy intercellular moisture reserves
                      </p>
                    </div>
                  </SpecularCard>
                </motion.div>
              </ParallaxPlane>

              {/* Layer 6: Micro-Smoothness Pill (Mid Positive Parallax) */}
              <ParallaxPlane
                depthX={18}
                depthY={14}
                className="hidden sm:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-20"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  className="glass-pill px-4 py-2 rounded-full shadow-soft text-xs text-[#191614] backdrop-blur-md"
                >
                  <span className="font-mono text-[10px] text-[#526E55] mr-1.5 font-bold">●</span>
                  <span className="font-medium text-[11px]">84% Micro-Smoothness</span>
                </motion.div>
              </ParallaxPlane>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
