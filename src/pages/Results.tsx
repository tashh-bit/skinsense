import React from 'react';
import { motion } from 'framer-motion';
import { useSkinSense } from '../context/SkinSenseContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { MetricGauge } from '../components/ui/MetricGauge';
import { EditorialButton } from '../components/ui/EditorialButton';
import { MagneticPill } from '../components/motion/MagneticPill';
import { MaskedReveal } from '../components/motion/MaskedReveal';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  CheckCircle2,
  RefreshCw,
  Share2,
  Utensils,
} from 'lucide-react';
import { MatchingProductsSection } from '../components/products/MatchingProductsSection';

export const Results: React.FC = () => {
  const { currentAnalysis, setCurrentPage } = useSkinSense();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SkinSense AI — Consultation Dossier',
        text: `My Skin Health Score is ${currentAnalysis.overallScore}/100. Analyzed with SkinSense AI.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Consultation link copied to clipboard.');
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-transparent overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Dossier Header with Masked Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/60">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <Badge variant="glass-warm" size="sm">
                <Sparkles className="w-3.5 h-3.5 text-[#8C6D2B]" />
                <span className="font-mono text-xs">Verified Optical Telemetry</span>
              </Badge>
              <span className="font-mono text-xs text-[#554A42] flex items-center gap-1.5 glass-chip">
                <Calendar className="w-3.5 h-3.5 text-[#8C6D2B]" />
                {currentAnalysis.formattedDate}
              </span>
            </motion.div>

            <MaskedReveal delay={0.2} yOffset={100}>
              <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
                Your Skin Profile.
              </h1>
            </MaskedReveal>

            <MaskedReveal delay={0.35} yOffset={40}>
              <p className="font-sans text-sm sm:text-base text-[#554A42] max-w-xl leading-relaxed">
                {currentAnalysis.headline}. A comprehensive digital dermatological consultation synthesizing 6 clinical dimensions.
              </p>
            </MaskedReveal>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <MagneticPill strength={0.2}>
              <EditorialButton
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2 glass-btn"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Dossier</span>
              </EditorialButton>
            </MagneticPill>

            <MagneticPill strength={0.2}>
              <EditorialButton
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage('analyze')}
                className="gap-2 glass-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New Analysis</span>
              </EditorialButton>
            </MagneticPill>
          </motion.div>
        </div>

        {/* Primary Dossier Score & Photo Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Diagnostic Portrait Anchor Card (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative rounded-[2.5rem] overflow-hidden glass p-2.5 border border-white/80 shadow-soft min-h-[380px]"
          >
            <div className="w-full h-full relative rounded-[2.25rem] overflow-hidden">
              <img
                src={currentAnalysis.imageUrl}
                alt="Consultation skin subject"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A2420]/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="glass-chip glass-chip-warm font-mono text-[10px] uppercase tracking-wider text-white bg-white/20 border-white/40">
                  Consultation Record
                </span>
                <p className="font-serif text-lg text-white">
                  ID: {currentAnalysis.id.toUpperCase()}
                </p>
                <p className="text-xs text-[#FAF7F0]/90">
                  Predominant Dermal Classification: <span className="font-medium text-white">{currentAnalysis.skinType}</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Primary Score & Core Metrics (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            
            {/* Health Score Main Card with Animated Number Counter */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard variant="glass" hoverEffect tiltEffect className="p-8 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-8">
                <MetricGauge
                  score={currentAnalysis.overallScore}
                  label="Skin Health Score"
                  subtext="Clinical composite"
                  size={160}
                  strokeWidth={9}
                />

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <Badge variant="sage" size="md">
                    Optimal Physiological Index
                  </Badge>
                  <h3 className="font-serif text-2xl font-light text-[#2A2420]">
                    {currentAnalysis.headline}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
                    Composite score of{' '}
                    <strong className="text-[#2A2420]">
                      <AnimatedCounter value={currentAnalysis.overallScore} duration={1200} />
                      /100
                    </strong>{' '}
                    shows strong cellular resilience. Targeted hydration and gentle barrier sealing will optimize micro-relief.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* AI Insights Pillbox */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-3xl glass-sub border border-white/70 space-y-2"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C6D2B]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#2A2420] font-semibold">
                  AI Skin Insights
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#2A2420] leading-relaxed">
                "{currentAnalysis.summary}"
              </p>
            </motion.div>

          </div>

        </div>

        {/* 6 Elegant Metrics Grid Cascading Outward */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="editorial-heading text-3xl font-light text-[#2A2420]">
              Diagnostic Metric Matrix
            </h2>
            <span className="font-mono text-xs text-[#554A42] uppercase tracking-wider">
              6 Optical Dimensions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentAnalysis.metrics.map((metric, idx) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.5 + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <GlassCard
                  variant="glass"
                  hoverEffect
                  tiltEffect
                  className="p-6 rounded-3xl space-y-4 h-full flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] font-semibold">
                        {metric.category}
                      </span>
                      <Badge
                        variant={
                          metric.status === 'optimal' || metric.status === 'low'
                            ? 'sage'
                            : metric.status === 'balanced'
                            ? 'glass-warm'
                            : 'terracotta'
                        }
                        size="sm"
                      >
                        {metric.status}
                      </Badge>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-2xl font-light text-[#2A2420]">
                        {metric.name}
                      </h3>
                      <span className="font-mono text-xl font-medium text-[#2A2420]">
                        {metric.displayValue}
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden border border-white/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.score}%` }}
                        transition={{ duration: 1.1, delay: 0.7 + idx * 0.08, ease: 'easeOut' }}
                        className="bg-[#2A2420] h-full rounded-full"
                      />
                    </div>

                    <p className="font-sans text-xs text-[#554A42] leading-relaxed">
                      {metric.description}
                    </p>
                  </div>

                  {metric.optimalRange && (
                    <div className="pt-3 border-t border-white/50 flex justify-between text-[10px] font-mono text-[#554A42]">
                      <span>Clinical Target</span>
                      <span className="font-semibold text-[#2A2420]">{metric.optimalRange}</span>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Identified Concerns & Actionable Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Key Concerns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <GlassCard variant="glass" hoverEffect={false} className="p-8 rounded-3xl space-y-5 h-full">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#85341E]" />
                <h2 className="editorial-heading text-2xl font-light text-[#2A2420]">
                  Identified Dermal Focus
                </h2>
              </div>

              <div className="space-y-4">
                {currentAnalysis.concerns.map((concern) => (
                  <div
                    key={concern.id}
                    className="p-4 rounded-2xl glass-sub space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-semibold text-[#2A2420]">
                        {concern.name}
                      </span>
                      <Badge variant="terracotta" size="sm">
                        {concern.severity}
                      </Badge>
                    </div>
                    <p className="font-sans text-xs text-[#554A42]">
                      {concern.description}
                    </p>
                    <span className="font-mono text-[10px] text-[#554A42] block pt-1">
                      Affected Region: {concern.area}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recommended Next Steps with Magnetic CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <GlassCard variant="glass" hoverEffect={false} className="p-8 rounded-3xl space-y-5 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3D5440]" />
                  <h2 className="editorial-heading text-2xl font-light text-[#2A2420]">
                    Recommended Next Steps
                  </h2>
                </div>

                <div className="space-y-3 text-xs text-[#554A42]">
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl glass-sub">
                    <span className="w-5 h-5 rounded-full bg-[#2A2420] text-white flex items-center justify-center shrink-0 font-mono text-[10px]">
                      1
                    </span>
                    <span className="leading-relaxed text-[#2A2420]">
                      Initiate morning moisture binding with multi-molecular hyaluronic acid to resolve the cheek water deficit.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl glass-sub">
                    <span className="w-5 h-5 rounded-full bg-[#2A2420] text-white flex items-center justify-center shrink-0 font-mono text-[10px]">
                      2
                    </span>
                    <span className="leading-relaxed text-[#2A2420]">
                      Seal the acid mantle with biomimetic ceramides (3:1:1 lipid ratio) before bedtime.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl glass-sub">
                    <span className="w-5 h-5 rounded-full bg-[#2A2420] text-white flex items-center justify-center shrink-0 font-mono text-[10px]">
                      3
                    </span>
                    <span className="leading-relaxed text-[#2A2420]">
                      Apply daily mineral SPF 50+ to protect micro-pigment clusters from UV excitation.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/60 space-y-3">
                <MagneticPill strength={0.25} className="w-full">
                  <EditorialButton
                    variant="primary"
                    size="md"
                    onClick={() => setCurrentPage('routine')}
                    className="w-full gap-2 justify-center"
                  >
                    <span>View Prescribed Routine</span>
                    <ArrowRight className="w-4 h-4" />
                  </EditorialButton>
                </MagneticPill>

                <MagneticPill strength={0.25} className="w-full">
                  <EditorialButton
                    variant="secondary"
                    size="md"
                    onClick={() => setCurrentPage('diet')}
                    className="w-full gap-2 justify-center glass-btn"
                  >
                    <Utensils className="w-4 h-4 text-[#8C6D2B]" />
                    <span>View Diet & Nutrition Protocol</span>
                  </EditorialButton>
                </MagneticPill>
              </div>
            </GlassCard>
          </motion.div>

        </div>

        {/* Nutritional Biochemistry Synergy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <GlassCard variant="glass" className="p-7 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border-white/90 shadow-soft">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl glass-sub flex items-center justify-center shrink-0 shadow-sm">
                <Utensils className="w-8 h-8 text-[#8C6D2B]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="glass-warm" size="sm">
                    Nutritional Biochemistry
                  </Badge>
                  <span className="font-mono text-xs text-[#3D5440] font-semibold">
                    {currentAnalysis.confidence || 91}% AI Matched
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#2A2420]">
                  Targeted Nutrition for {currentAnalysis.conditionLabel || 'Barrier Equilibrium'}
                </h3>
                <p className="font-sans text-xs text-[#554A42] max-w-xl">
                  Fuel cellular barrier healing from within. Explore recommended whole foods, foods to limit, hydration tracking, and a sample 1-day meal plan.
                </p>
              </div>
            </div>

            <MagneticPill strength={0.3} className="shrink-0 w-full md:w-auto">
              <EditorialButton
                variant="primary"
                size="md"
                onClick={() => setCurrentPage('diet')}
                className="w-full md:w-auto gap-2 justify-center"
              >
                <span>View Diet Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
            </MagneticPill>
          </GlassCard>
        </motion.div>

        {/* Condition-Matched Real Skincare Products (INR) */}
        <MatchingProductsSection
          condition={currentAnalysis.detectedCondition}
          title={`Topical Formulations for ${currentAnalysis.conditionLabel || 'Your Complexion'}`}
          subtitle="Genuine products with INR pricing verified on Nykaa, brand stores, and authorised retailers."
          limit={4}
        />

        {/* Clear Medical Disclaimer */}
        <div className="p-6 rounded-3xl glass-sub border border-white/70 flex items-start gap-3 text-xs text-[#554A42]">
          <ShieldAlert className="w-4 h-4 text-[#85341E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[#2A2420] uppercase tracking-wider text-[10px] block">
              Dermatological & Clinical Advisory
            </span>
            <p className="leading-relaxed">
              {currentAnalysis.disclaimer} This analysis is informational and is not a medical diagnosis. For persistent or concerning skin conditions, consult a qualified healthcare professional.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
