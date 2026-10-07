import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { EditorialButton } from '../ui/EditorialButton';
import { useSkinSense } from '../../context/SkinSenseContext';
import { Sun, Moon, ArrowRight, Sparkles } from 'lucide-react';

export const PersonalizedCareSection: React.FC = () => {
  const { currentAnalysis, setCurrentPage } = useSkinSense();
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');

  const filteredSteps = currentAnalysis.routine.filter(
    (step) => step.timeOfDay === activeTab || step.timeOfDay === 'both'
  );

  return (
    <section className="py-20 md:py-28 bg-transparent border-t border-white/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 glass-chip glass-chip-lavender px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 text-[#5B3E84]" />
              <span className="font-mono text-xs uppercase tracking-wider">
                Section 04 • Curated Formulation
              </span>
            </div>
            <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
              Personalized Care.
            </h2>
            <p className="glass-muted text-sm sm:text-base max-w-xl">
              Precision skincare protocol formulated to match your unique barrier metrics, pH dynamics, and cellular renewal rate.
            </p>
          </div>

          {/* Morning / Evening Toggle: Glass Strong Pill */}
          <div className="glass-strong flex items-center gap-1.5 p-1.5 rounded-full shadow-sm">
            <button
              onClick={() => setActiveTab('morning')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 ${
                activeTab === 'morning'
                  ? 'bg-[#2A2420] text-[#FAF7F0] shadow-md scale-[1.02]'
                  : 'text-[#554A42] hover:text-[#2A2420]'
              }`}
            >
              <Sun className={`w-3.5 h-3.5 ${activeTab === 'morning' ? 'text-[#E5CA8F]' : ''}`} />
              <span>Morning Ritual</span>
            </button>
            <button
              onClick={() => setActiveTab('evening')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-all duration-300 ${
                activeTab === 'evening'
                  ? 'bg-[#2A2420] text-[#FAF7F0] shadow-md scale-[1.02]'
                  : 'text-[#554A42] hover:text-[#2A2420]'
              }`}
            >
              <Moon className={`w-3.5 h-3.5 ${activeTab === 'evening' ? 'text-[#C7B5E4]' : ''}`} />
              <span>Evening Ritual</span>
            </button>
          </div>
        </div>

        {/* Horizontal Carousel on mobile / Responsive Grid on desktop with snap */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 scrollbar-none">
          {filteredSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, filter: 'blur(12px)', y: 24 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.7,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="min-w-[285px] sm:min-w-[320px] md:min-w-0 snap-start flex-1"
            >
              <GlassCard
                variant="glass"
                hoverEffect
                tiltEffect
                className="p-7 rounded-[32px] h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Step header with Step # and Category Pill */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#554A42] font-semibold">
                      Step 0{step.stepNumber}
                    </span>
                    <span className="glass-chip text-xs">
                      {step.category}
                    </span>
                  </div>

                  {/* Product title and subtitle with WCAG AA compliant contrast */}
                  <div className="space-y-1 pt-1">
                    <h3 className="font-serif text-2xl font-light text-[#2A2420] leading-snug">
                      {step.productName}
                    </h3>
                    <p className="font-sans text-xs text-[#554A42] font-medium">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Key Actives / Ingredients tags (slightly warmer tint) */}
                  <div className="space-y-1.5 pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#554A42]">
                      Key Actives:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {step.keyActives.map((active, i) => (
                        <span
                          key={i}
                          className="glass-chip glass-chip-warm font-mono text-[11px]"
                        >
                          {active}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* "Why Prescribed" block - nested glass sub-panel */}
                  <div className="glass-sub p-4 space-y-1.5 mt-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#8C6D2B] font-bold block">
                      Why Prescribed
                    </span>
                    <p className="glass-body text-xs text-[#2A2420] leading-relaxed">
                      {step.why}
                    </p>
                  </div>
                </div>

                {/* "Ritual Phase" footer row - nested glass sub-panel */}
                <div className="glass-sub px-4 py-2.5 mt-6 flex items-center justify-between font-mono text-xs text-[#554A42]">
                  <span className="tracking-wide">Ritual Phase</span>
                  <span className="capitalize font-semibold text-[#2A2420]">
                    {step.timeOfDay}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA to full routine */}
        <div className="mt-14 text-center">
          <EditorialButton
            variant="outline"
            size="md"
            onClick={() => setCurrentPage('routine')}
            className="gap-2 glass-btn"
          >
            <span>Explore Complete AM / PM Protocol</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </div>

      </div>
    </section>
  );
};
