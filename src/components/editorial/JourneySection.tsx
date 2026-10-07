import React from 'react';
import { Badge } from '../ui/Badge';
import { GlassCard } from '../ui/GlassCard';
import { EditorialButton } from '../ui/EditorialButton';
import { SplitComparisonSlider } from '../progress/SplitComparisonSlider';
import { useSkinSense } from '../../context/SkinSenseContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const JourneySection: React.FC = () => {
  const { setCurrentPage } = useSkinSense();

  const milestones = [
    { metric: 'Hydration Reserve', delta: '+19%', note: 'Stratum corneum water volume replenished' },
    { metric: 'Micro-Relief Smoothness', delta: '+13%', note: 'Refined pore topography and texture' },
    { metric: 'Vascular Flushing', delta: '-28%', note: 'Cheek erythema calm and contained' },
    { metric: 'Luminosity & Clarity', delta: '+15%', note: 'Even tone and restored radiance' },
  ];

  return (
    <section className="py-20 md:py-28 bg-transparent border-t border-white/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <Badge variant="glass" size="sm">
              Section 05 • Visual Progression
            </Badge>
            <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
              Your Skin Journey.
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#554A42] max-w-md leading-relaxed">
            Real skin transformation happens progressively. We track dermal evolution over time through visual storytelling and comparative telemetry.
          </p>
        </div>

        {/* Content Layout: Interactive Slider + Telemetry Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Slider Container (7 Cols) */}
          <div className="lg:col-span-7 glass p-3 rounded-[32px] border border-white/80 shadow-soft">
            <SplitComparisonSlider
              beforeImage="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85"
              afterImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85"
              beforeLabel="Week 01 • Reactive Erythema"
              afterLabel="Week 04 • Restored Equilibrium"
            />
          </div>

          {/* Telemetry Insights (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#8C6D2B] font-semibold">
                4-Week Longitudinal Telemetry
              </span>
              <h3 className="font-serif text-3xl font-light text-[#2A2420]">
                Visible Transformation, Documented.
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
                Rather than relying on memory, compare any two consultation dates side-by-side to witness how your tailored barrier protocol is healing your skin.
              </p>
            </div>

            {/* Milestones List */}
            <div className="space-y-3 pt-2">
              {milestones.map((m, idx) => (
                <GlassCard key={idx} variant="glass" hoverEffect tiltEffect className="p-4 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5440]" />
                      <span className="font-sans text-xs font-semibold text-[#2A2420]">{m.metric}</span>
                    </div>
                    <p className="font-sans text-[11px] text-[#554A42] pl-5.5">{m.note}</p>
                  </div>
                  <span className="glass-chip font-mono text-xs font-bold text-[#3D5440]">
                    {m.delta}
                  </span>
                </GlassCard>
              ))}
            </div>

            <div className="pt-2">
              <EditorialButton
                variant="outline"
                size="md"
                onClick={() => setCurrentPage('history')}
                className="gap-2 w-full sm:w-auto glass-btn"
              >
                <span>View Full Scan History</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
