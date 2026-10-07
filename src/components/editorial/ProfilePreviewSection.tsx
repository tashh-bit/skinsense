import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { MetricGauge } from '../ui/MetricGauge';
import { EditorialButton } from '../ui/EditorialButton';
import { useSkinSense } from '../../context/SkinSenseContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const ProfilePreviewSection: React.FC = () => {
  const { currentAnalysis, setCurrentPage } = useSkinSense();

  return (
    <section className="py-20 md:py-28 bg-transparent border-t border-white/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <Badge variant="glass" size="sm">
              Section 03 • The Clinical Dossier
            </Badge>
            <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
              Your Skin Profile.
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#554A42] max-w-md leading-relaxed">
            Every scan translates optical data into a personalized consultation dossier. Review your composite score alongside 6 critical health markers.
          </p>
        </div>

        {/* Profile Glass Card Container */}
        <GlassCard variant="glass" hoverEffect={false} className="p-8 md:p-12 rounded-[2.5rem]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Overall Score Meter */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-white/60">
              <MetricGauge
                score={currentAnalysis.overallScore}
                label="Overall Skin Health"
                subtext={`Dermal Type: ${currentAnalysis.skinType}`}
                size={160}
                strokeWidth={8}
              />

              <div className="mt-6 text-center max-w-xs space-y-2">
                <Badge variant="glass-warm" size="sm">
                  <Sparkles className="w-3 h-3 text-[#8C6D2B]" />
                  <span>Verified Optical Telemetry</span>
                </Badge>
                <p className="font-sans text-xs text-[#554A42]">
                  Calculated from 102,400 facial sub-pixel vectors
                </p>
              </div>

              <div className="mt-6 w-full pt-4 border-t border-white/60 flex justify-center">
                <EditorialButton
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage('results')}
                  className="gap-1.5 glass-btn"
                >
                  <span>Open Full Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </EditorialButton>
              </div>
            </div>

            {/* Right Column: 6 Detailed Clinical Metrics */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-light text-[#2A2420]">
                  Clinical Metric Breakdown
                </h3>
                <span className="font-mono text-xs text-[#554A42] uppercase tracking-wider">
                  Target Range 75% - 90%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentAnalysis.metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-4 rounded-2xl glass-sub space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-sans font-medium text-[#2A2420]">
                        {metric.name}
                      </span>
                      <span className="font-mono font-semibold text-[#2A2420]">
                        {metric.displayValue}
                      </span>
                    </div>

                    <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden border border-white/40">
                      <div
                        className="bg-[#2A2420] h-full rounded-full transition-all duration-700"
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>

                    <p className="font-sans text-[11px] text-[#554A42] leading-snug line-clamp-2">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* AI Skin Insight Pill */}
              <div className="p-4 rounded-2xl glass-sub flex items-start gap-3 border border-white/70">
                <Sparkles className="w-4 h-4 text-[#8C6D2B] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-sans font-semibold text-[#2A2420] uppercase tracking-wider text-[10px]">
                    Today's AI Clinical Insight
                  </span>
                  <p className="font-sans text-[#2A2420] leading-relaxed">
                    {currentAnalysis.summary}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </GlassCard>

      </div>
    </section>
  );
};
