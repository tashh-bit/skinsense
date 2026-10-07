import React from 'react';
import { motion } from 'framer-motion';
import { useSkinSense } from '../context/SkinSenseContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { MetricGauge } from '../components/ui/MetricGauge';
import { EditorialButton } from '../components/ui/EditorialButton';
import { MaskedReveal } from '../components/motion/MaskedReveal';
import { MagneticPill } from '../components/motion/MagneticPill';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import {
  CheckCircle2,
  Droplets,
  Sun,
  Moon,
  Clock,
  ArrowRight,
  Heart,
} from 'lucide-react';

export const Skin: React.FC = () => {
  const { currentAnalysis, analyses, habits, toggleHabit, setCurrentPage, navigateToScan } = useSkinSense();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-transparent overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Personal Greeting Header */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="glass-warm" size="sm">
              Personal Skin Journal • Daily Ritual
            </Badge>
          </motion.div>

          <div className="space-y-2">
            <MaskedReveal delay={0.15} yOffset={100}>
              <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
                {greeting}
              </h1>
            </MaskedReveal>

            <MaskedReveal delay={0.3} yOffset={40}>
              <p className="font-serif text-2xl sm:text-3xl text-[#554A42] font-light italic">
                Here’s how your skin is responding today.
              </p>
            </MaskedReveal>
          </div>

          <p className="font-sans text-xs sm:text-sm text-[#554A42] max-w-xl leading-relaxed">
            Continuously informed by your latest consultation from {currentAnalysis.formattedDate}.
          </p>
        </div>

        {/* Primary Journal Dossier Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Score Card (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <GlassCard variant="glass" hoverEffect tiltEffect className="p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between space-y-8 h-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <MetricGauge
                  score={currentAnalysis.overallScore}
                  label="Current Skin Health Score"
                  subtext={`Status: ${currentAnalysis.skinType} Balance`}
                  size={170}
                  strokeWidth={9}
                />

                <div className="space-y-3 text-center sm:text-left flex-1">
                  <Badge variant="sage" size="md">
                    Barrier Equilibrium Verified
                  </Badge>
                  <h3 className="font-serif text-2xl font-light text-[#2A2420]">
                    {currentAnalysis.headline}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
                    Composite score of{' '}
                    <strong className="text-[#2A2420]">
                      <AnimatedCounter value={currentAnalysis.overallScore} />
                      /100
                    </strong>. Your epidermal hydration ratio is progressing positively. Maintain targeted evening ceramide sealing to sustain stratum corneum moisture reserves.
                  </p>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/60 text-center">
                <div className="p-3 rounded-2xl glass-sub">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] block">
                    Hydration
                  </span>
                  <span className="font-serif text-xl font-medium text-[#2A2420]">
                    {currentAnalysis.metrics.find((m) => m.id === 'hydration')?.displayValue || '78%'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl glass-sub">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] block">
                    Texture
                  </span>
                  <span className="font-serif text-xl font-medium text-[#2A2420]">
                    {currentAnalysis.metrics.find((m) => m.id === 'texture')?.displayValue || '84%'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl glass-sub">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] block">
                    Clarity
                  </span>
                  <span className="font-serif text-xl font-medium text-[#2A2420]">
                    {currentAnalysis.metrics.find((m) => m.id === 'clarity')?.displayValue || '76%'}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Daily Habits & Care Log (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <GlassCard variant="glass" hoverEffect={false} className="p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#554A42] font-semibold">
                    Daily Skin Ritual
                  </span>
                  <Heart className="w-4 h-4 text-[#85341E]" />
                </div>

                <h2 className="font-serif text-2xl font-light text-[#2A2420]">
                  Today’s Check-In
                </h2>

                <p className="font-sans text-xs text-[#554A42] leading-relaxed">
                  Log today’s environmental exposures and routine adherence to correlate with your score progression:
                </p>

                {/* Habit Toggles with Glass Pill styling */}
                <div className="space-y-2.5 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleHabit('waterIntake')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs transition-all ${
                      habits.waterIntake
                        ? 'bg-[#EEF3EE]/80 text-[#3D5440] border border-[#C5D8C8] shadow-sm'
                        : 'glass-sub text-[#554A42] hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Droplets className="w-4 h-4 text-[#3D5440]" />
                      <span className="font-medium">Hydration Goal (2.5L Water)</span>
                    </div>
                    <CheckCircle2
                      className={`w-4 h-4 ${habits.waterIntake ? 'text-[#3D5440]' : 'opacity-25'}`}
                    />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleHabit('sunProtection')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs transition-all ${
                      habits.sunProtection
                        ? 'bg-[#FAF5EA]/85 text-[#8C6D2B] border border-[#E8DAC0] shadow-sm'
                        : 'glass-sub text-[#554A42] hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="w-4 h-4 text-[#8C6D2B]" />
                      <span className="font-medium">Mineral SPF 50+ Applied</span>
                    </div>
                    <CheckCircle2
                      className={`w-4 h-4 ${habits.sunProtection ? 'text-[#8C6D2B]' : 'opacity-25'}`}
                    />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleHabit('restfulSleep')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs transition-all ${
                      habits.restfulSleep
                        ? 'bg-[#EEF3EE]/80 text-[#3D5440] border border-[#C5D8C8] shadow-sm'
                        : 'glass-sub text-[#554A42] hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Moon className="w-4 h-4 text-[#554A42]" />
                      <span className="font-medium">8 Hours Restful Sleep</span>
                    </div>
                    <CheckCircle2
                      className={`w-4 h-4 ${habits.restfulSleep ? 'text-[#3D5440]' : 'opacity-25'}`}
                    />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleHabit('eveningCleanse')}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-xs transition-all ${
                      habits.eveningCleanse
                        ? 'bg-[#EEF3EE]/80 text-[#3D5440] border border-[#C5D8C8] shadow-sm'
                        : 'glass-sub text-[#554A42] hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#85341E]" />
                      <span className="font-medium">Double Cleanse Completed</span>
                    </div>
                    <CheckCircle2
                      className={`w-4 h-4 ${habits.eveningCleanse ? 'text-[#3D5440]' : 'opacity-25'}`}
                    />
                  </motion.button>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono text-[#554A42] block text-center">
                  Habits logged locally • Auto-saved to device
                </span>
              </div>
            </GlassCard>
          </motion.div>

        </div>

        {/* Current Active Routine Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 rounded-[2.5rem] bg-[#2A2420]/90 backdrop-blur-2xl text-[#FAF7F0] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/20"
        >
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#E5CA8F]">
              Prescribed Care Routine
            </span>
            <h2 className="font-serif text-3xl font-light text-white">
              Your Daily Regimen is Ready.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#DDD5CB] max-w-lg leading-relaxed">
              Explore formulation details, active ingredient spotlights, and targeted application techniques for Morning & Evening.
            </p>
          </div>

          <MagneticPill strength={0.3}>
            <EditorialButton
              variant="secondary"
              size="md"
              onClick={() => setCurrentPage('routine')}
              className="bg-[#FAF7F0] text-[#2A2420] hover:bg-white shrink-0 gap-2 shadow-md"
            >
              <span>Review Regimen ({currentAnalysis.routine.length} Steps)</span>
              <ArrowRight className="w-4 h-4" />
            </EditorialButton>
          </MagneticPill>
        </motion.div>

        {/* Recent Analyses Quick Carousel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="editorial-heading text-3xl font-light text-[#2A2420]">
                Recent Consultations
              </h2>
              <p className="font-sans text-xs text-[#554A42]">
                Revisit your previous diagnostic dossiers and tracks.
              </p>
            </div>

            <EditorialButton
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage('history')}
              className="gap-1.5 glass-btn"
            >
              <span>View Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </EditorialButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {analyses.slice(0, 3).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <GlassCard
                  variant="glass"
                  hoverEffect
                  tiltEffect
                  className="p-5 rounded-3xl cursor-pointer space-y-4 h-full flex flex-col justify-between"
                  onClick={() => navigateToScan(item)}
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass p-1">
                      <img
                        src={item.imageUrl}
                        alt={item.headline}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 rounded-xl"
                      />
                      <div className="absolute top-3 right-3 glass-chip text-[10px] font-mono font-semibold text-[#2A2420]">
                        {item.overallScore} Score
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-[#554A42] uppercase tracking-wider block">
                        {item.formattedDate}
                      </span>
                      <h3 className="font-serif text-lg font-normal text-[#2A2420] line-clamp-1">
                        {item.headline}
                      </h3>
                      <p className="font-sans text-xs text-[#554A42] line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/60 flex items-center justify-between text-xs text-[#2A2420] font-medium">
                    <span>Open Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8C6D2B]" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
