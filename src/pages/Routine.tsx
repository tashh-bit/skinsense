import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinSense } from '../context/SkinSenseContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { EditorialButton } from '../components/ui/EditorialButton';
import { MaskedReveal } from '../components/motion/MaskedReveal';
import { MagneticPill } from '../components/motion/MagneticPill';
import { RoutineStep } from '../types';
import {
  Sun,
  Moon,
  Clock,
  Sparkles,
  Info,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Layers,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { MatchingProductsSection } from '../components/products/MatchingProductsSection';

export const Routine: React.FC = () => {
  const { currentAnalysis, setCurrentPage } = useSkinSense();
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  const [viewFormat, setViewFormat] = useState<'carousel' | 'list'>('carousel');
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  const steps = currentAnalysis.routine.filter(
    (s) => s.timeOfDay === activeTab || s.timeOfDay === 'both'
  );

  const toggleExpand = (id: string) => {
    setExpandedStepId(expandedStepId === id ? null : id);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselContainerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      carouselContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ================= PAGE HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/60">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="glass-warm" size="sm">
                <Sparkles className="w-3.5 h-3.5 text-[#8C6D2B]" />
                <span className="font-mono text-xs">Tailored to Scan: {currentAnalysis.headline}</span>
              </Badge>
            </motion.div>

            <MaskedReveal delay={0.15} yOffset={100}>
              <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
                Personalized Routine.
              </h1>
            </MaskedReveal>

            <MaskedReveal delay={0.3} yOffset={40}>
              <p className="font-sans text-sm sm:text-base text-[#554A42] max-w-xl leading-relaxed">
                Curated daily protocols engineered to harmonize with your dermal telemetry. Every active is chosen to restore water binding, calm capillary reactivity, and strengthen lipid architecture.
              </p>
            </MaskedReveal>
          </div>

          {/* Fluid Sliding Pill Switcher - Glass Strong */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* AM / PM Pill */}
            <div className="relative flex items-center p-1.5 rounded-full glass-strong">
              <button
                onClick={() => setActiveTab('morning')}
                className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === 'morning' ? 'text-[#FAF7F0]' : 'text-[#554A42] hover:text-[#2A2420]'
                }`}
              >
                {activeTab === 'morning' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-[#2A2420] rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Sun className={`relative z-10 w-4 h-4 ${activeTab === 'morning' ? 'text-[#E5CA8F]' : 'text-[#8C6D2B]'}`} />
                <span className="relative z-10">Morning Regimen</span>
              </button>

              <button
                onClick={() => setActiveTab('evening')}
                className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium transition-colors ${
                  activeTab === 'evening' ? 'text-[#FAF7F0]' : 'text-[#554A42] hover:text-[#2A2420]'
                }`}
              >
                {activeTab === 'evening' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-[#2A2420] rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Moon className={`relative z-10 w-4 h-4 ${activeTab === 'evening' ? 'text-[#C7B5E4]' : 'text-[#554A42]'}`} />
                <span className="relative z-10">Evening Regimen</span>
              </button>
            </div>

            {/* Carousel / List Toggle */}
            <div className="flex items-center p-1 rounded-full glass-sub">
              <button
                onClick={() => setViewFormat('carousel')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  viewFormat === 'carousel' ? 'bg-[#2A2420] text-white shadow-xs' : 'text-[#554A42]'
                }`}
              >
                Snap Carousel
              </button>
              <button
                onClick={() => setViewFormat('list')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  viewFormat === 'list' ? 'bg-[#2A2420] text-white shadow-xs' : 'text-[#554A42]'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Regimen Narrative Banner */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 rounded-[28px] glass flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl glass-sub flex items-center justify-center shrink-0">
              {activeTab === 'morning' ? (
                <Sun className="w-6 h-6 text-[#8C6D2B]" />
              ) : (
                <Moon className="w-6 h-6 text-[#432E63]" />
              )}
            </div>
            <div>
              <h2 className="font-serif text-xl font-normal text-[#2A2420]">
                {activeTab === 'morning' ? 'Daytime Shield & Hydration Phase' : 'Nocturnal Cellular Repair Phase'}
              </h2>
              <p className="font-sans text-xs text-[#554A42]">
                {activeTab === 'morning'
                  ? 'Focus on antioxidant defense, transepidermal water replenishment, and broad-spectrum mineral shielding.'
                  : 'Focus on gentle cellular turnover, lipid restoration (3:1:1 ceramides), and soothing circadian renewal.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewFormat === 'carousel' && (
              <div className="hidden sm:flex items-center gap-1.5 mr-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="p-2 rounded-full glass-btn text-[#2A2420] hover:bg-white/60"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="p-2 rounded-full glass-btn text-[#2A2420] hover:bg-white/60"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            <span className="font-mono text-xs text-[#2A2420] glass-chip">
              {steps.length} Steps
            </span>
          </div>
        </motion.div>

        {/* ================= HORIZONTAL SNAP CAROUSEL VIEW ================= */}
        {viewFormat === 'carousel' ? (
          <div className="relative">
            <div
              ref={carouselContainerRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 px-1 focus:outline-none"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(90,70,50,0.2) transparent',
              }}
            >
              {steps.map((step: RoutineStep, index: number) => (
                <div
                  key={step.id}
                  className="w-[340px] sm:w-[400px] shrink-0 snap-center"
                >
                  <GlassCard
                    variant="glass"
                    hoverEffect
                    tiltEffect
                    className="p-6 sm:p-7 rounded-[32px] h-full flex flex-col justify-between border-white/80 shadow-soft"
                  >
                    <div className="space-y-4">
                      {/* Step Top Bar: Category Pill & Step Number */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/60">
                        <span className="glass-chip font-mono text-[11px] font-semibold text-[#8C6D2B]">
                          STEP 0{index + 1} � {step.category}
                        </span>
                        <span className="glass-chip text-[10px] font-mono capitalize">
                          {step.timeOfDay}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <div className="space-y-1">
                        <h3 className="font-serif text-2xl font-light text-[#2A2420] line-clamp-1">
                          {step.productName}
                        </h3>
                        <p className="font-sans text-xs text-[#554A42] line-clamp-2">
                          {step.subtitle || step.what}
                        </p>
                      </div>

                      {/* Ingredient Chips */}
                      <div className="space-y-1.5 pt-1">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#554A42] block">
                          Key Bioactive Actives
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.keyActives.map((act, i) => (
                            <span
                              key={i}
                              className="glass-chip glass-chip-warm font-mono text-[10px]"
                            >
                              {act}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* "WHY PRESCRIBED" Block */}
                      <div className="p-3.5 rounded-2xl glass-sub space-y-1 border border-white/70">
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-[#8C6D2B]" />
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[#2A2420] font-bold">
                            Why Prescribed
                          </span>
                        </div>
                        <p className="glass-body text-xs text-[#2A2420] leading-relaxed line-clamp-3">
                          {step.why}
                        </p>
                      </div>

                      {/* How & When info */}
                      <div className="p-3 rounded-2xl glass-sub text-xs space-y-1">
                        <div className="flex items-center gap-1 font-mono text-[9px] uppercase text-[#554A42]">
                          <Clock className="w-3 h-3 text-[#85341E]" />
                          <span>Application Guidance</span>
                        </div>
                        <p className="text-[11px] text-[#2A2420] line-clamp-2">
                          {step.how}
                        </p>
                      </div>
                    </div>

                    {/* "Ritual Phase: Morning/Night" Footer */}
                    <div className="pt-4 mt-4 border-t border-white/60 flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C6D2B] font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#E5CA8F]" />
                        Ritual Phase: {activeTab === 'morning' ? 'Morning Shield' : 'Night Renewal'}
                      </span>
                      <span className="font-mono text-[10px] text-[#554A42]">
                        Order: 0{index + 1}/0{steps.length}
                      </span>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>

            {/* Carousel navigation hint on mobile */}
            <div className="flex sm:hidden justify-center items-center gap-1 text-[11px] font-mono text-[#554A42] pt-2">
              <span>Swipe horizontally to browse routine steps ?</span>
            </div>
          </div>
        ) : (
          /* ================= LIST ACCORDION VIEW ================= */
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {steps.map((step: RoutineStep, index: number) => {
                  const isExpanded = expandedStepId === step.id;

                  return (
                    <GlassCard
                      key={step.id}
                      variant="glass"
                      hoverEffect
                      tiltEffect
                      className="p-6 sm:p-8 rounded-[32px] transition-all"
                    >
                      {/* Step Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[#2A2420] text-[#FAF7F0] font-mono text-xs flex items-center justify-center shrink-0 shadow-sm">
                            0{index + 1}
                          </span>
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] font-semibold">
                              {step.category}
                            </span>
                            <h3 className="font-serif text-2xl font-light text-[#2A2420]">
                              {step.productName}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="glass-chip text-xs">
                            {step.subtitle}
                          </span>
                          <button
                            onClick={() => toggleExpand(step.id)}
                            className="p-2 rounded-full hover:bg-white/40 text-[#2A2420] transition-colors"
                            aria-label="Toggle details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Key Actives Pills (Warmer Tint) */}
                      <div className="pt-4 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#554A42] font-medium">
                          Key Actives:
                        </span>
                        {step.keyActives.map((act, i) => (
                          <span
                            key={i}
                            className="glass-chip glass-chip-warm font-mono text-xs"
                          >
                            {act}
                          </span>
                        ))}
                      </div>

                      {/* 4 Pillars: WHAT / WHY / WHEN / HOW using nested glass-sub */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                        
                        {/* WHAT */}
                        <div className="p-4 rounded-2xl glass-sub space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Droplet className="w-3.5 h-3.5 text-[#3D5440]" />
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#2A2420] font-bold">
                              What It Is
                            </span>
                          </div>
                          <p className="glass-body text-xs text-[#2A2420] leading-relaxed">
                            {step.what}
                          </p>
                        </div>

                        {/* WHY PRESCRIBED */}
                        <div className="p-4 rounded-2xl glass-sub space-y-1.5">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-3.5 h-3.5 text-[#8C6D2B]" />
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#2A2420] font-bold">
                              Why Prescribed
                            </span>
                          </div>
                          <p className="glass-body text-xs text-[#2A2420] leading-relaxed">
                            {step.why}
                          </p>
                        </div>

                        {/* WHEN */}
                        <div className="p-4 rounded-2xl glass-sub space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-[#85341E]" />
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#2A2420] font-bold">
                              When To Apply
                            </span>
                          </div>
                          <p className="glass-body text-xs text-[#2A2420] leading-relaxed">
                            {step.when}
                          </p>
                        </div>

                        {/* HOW */}
                        <div className="p-4 rounded-2xl glass-sub space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Info className="w-3.5 h-3.5 text-[#2A2420]" />
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#2A2420] font-bold">
                              How To Apply
                            </span>
                          </div>
                          <p className="glass-body text-xs text-[#2A2420] leading-relaxed">
                            {step.how}
                          </p>
                        </div>

                      </div>

                      {/* Footer: Ritual Phase */}
                      <div className="pt-4 mt-4 border-t border-white/60 flex items-center justify-between text-xs">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C6D2B] font-semibold">
                          Ritual Phase: {activeTab === 'morning' ? 'Morning Shield' : 'Night Renewal'}
                        </span>
                        <span className="font-mono text-[10px] text-[#554A42]">
                          Step 0{index + 1} of 0{steps.length}
                        </span>
                      </div>
                    </GlassCard>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Matching Skincare Products (INR) */}
        <MatchingProductsSection
          condition={currentAnalysis.detectedCondition}
          title="Recommended Indian Formulations for this Regimen"
          subtitle="Genuine products with verified INR prices to complete your morning & evening protocol."
          limit={4}
        />

        {/* Footer Navigation CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/60">
          <MagneticPill strength={0.2}>
            <EditorialButton
              variant="outline"
              size="md"
              onClick={() => setCurrentPage('results')}
              className="glass-btn"
            >
              ? Back to Skin Profile
            </EditorialButton>
          </MagneticPill>

          <div className="flex items-center gap-3">
            <MagneticPill strength={0.2}>
              <EditorialButton
                variant="secondary"
                size="md"
                onClick={() => setCurrentPage('diet')}
                className="glass-btn"
              >
                Explore Diet & Nutrition Protocol
              </EditorialButton>
            </MagneticPill>

            <MagneticPill strength={0.25}>
              <EditorialButton
                variant="primary"
                size="md"
                onClick={() => setCurrentPage('products')}
              >
                Browse Curated Products ?
              </EditorialButton>
            </MagneticPill>
          </div>
        </div>

      </div>
    </div>
  );
};
