import React, { useState } from 'react';
import { useSkinSense } from '../context/SkinSenseContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { EditorialButton } from '../components/ui/EditorialButton';
import { SplitComparisonSlider } from '../components/progress/SplitComparisonSlider';
import {
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const History: React.FC = () => {
  const { analyses, navigateToScan, setCurrentPage } = useSkinSense();

  // Selected indices for comparison slider
  const [beforeIndex, setBeforeIndex] = useState<number>(
    analyses.length > 1 ? analyses.length - 1 : 0
  );
  const [afterIndex, setAfterIndex] = useState<number>(0);

  const beforeAnalysis = analyses[beforeIndex] || analyses[0];
  const afterAnalysis = analyses[afterIndex] || analyses[0];

  // Calculate score difference
  const scoreDiff = afterAnalysis.overallScore - beforeAnalysis.overallScore;

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-transparent">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/60">
          <div className="space-y-3">
            <Badge variant="glass-warm" size="sm">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D2B]" />
              <span className="font-mono text-xs">Longitudinal Telemetry Archive</span>
            </Badge>

            <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
              Skin Evolution & History.
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#554A42] max-w-xl leading-relaxed">
              Witness your skin’s transformation across days and weeks. Compare any two consultation milestones to evaluate dermal recovery, texture smoothing, and barrier cohesion.
            </p>
          </div>

          <EditorialButton
            variant="primary"
            size="md"
            onClick={() => setCurrentPage('analyze')}
            className="shrink-0 gap-2 shadow-md"
          >
            <span>Scan Today’s Skin</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </div>

        {/* Section 1: Interactive Progress Comparison */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="editorial-heading text-3xl font-light text-[#2A2420]">
                Interactive Progress Comparison
              </h2>
              <p className="font-sans text-xs text-[#554A42]">
                Drag the divider handle to compare micro-relief and clarity between dates.
              </p>
            </div>

            {/* Date Selectors with Glass Inputs */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-mono text-[#554A42] text-[10px] uppercase">Base:</span>
                <select
                  value={beforeIndex}
                  onChange={(e) => setBeforeIndex(Number(e.target.value))}
                  className="glass-input px-3.5 py-1.5 text-xs font-sans text-[#2A2420] focus:outline-none cursor-pointer"
                >
                  {analyses.map((a, i) => (
                    <option key={a.id} value={i} className="text-[#2A2420] bg-white">
                      {a.formattedDate} ({a.overallScore})
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[#554A42] font-semibold">vs</span>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-mono text-[#554A42] text-[10px] uppercase">Target:</span>
                <select
                  value={afterIndex}
                  onChange={(e) => setAfterIndex(Number(e.target.value))}
                  className="glass-input px-3.5 py-1.5 text-xs font-sans text-[#2A2420] focus:outline-none cursor-pointer"
                >
                  {analyses.map((a, i) => (
                    <option key={a.id} value={i} className="text-[#2A2420] bg-white">
                      {a.formattedDate} ({a.overallScore})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Split Comparison Component */}
          <div className="glass p-3 rounded-[32px] border border-white/80 shadow-soft">
            <SplitComparisonSlider
              beforeImage={beforeAnalysis.imageUrl}
              afterImage={afterAnalysis.imageUrl}
              beforeLabel={`${beforeAnalysis.formattedDate} • ${beforeAnalysis.overallScore} Score`}
              afterLabel={`${afterAnalysis.formattedDate} • ${afterAnalysis.overallScore} Score`}
            />
          </div>

          {/* Visual Storytelling Metric Delta Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <GlassCard variant="glass" hoverEffect tiltEffect className="p-4 rounded-2xl text-center space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] block">
                Composite Delta
              </span>
              <span className={`font-serif text-2xl font-medium ${scoreDiff >= 0 ? 'text-[#3D5440]' : 'text-[#85341E]'}`}>
                {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} pts
              </span>
              <span className="text-[10px] font-sans text-[#554A42] block">
                Overall score change
              </span>
            </GlassCard>

            <GlassCard variant="glass" hoverEffect tiltEffect className="p-4 rounded-2xl text-center space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] block">
                Hydration Delta
              </span>
              <span className="font-serif text-2xl font-medium text-[#3D5440]">
                +19%
              </span>
              <span className="text-[10px] font-sans text-[#554A42] block">
                Intercellular water holding
              </span>
            </GlassCard>

            <GlassCard variant="glass" hoverEffect tiltEffect className="p-4 rounded-2xl text-center space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] block">
                Texture Smoothness
              </span>
              <span className="font-serif text-2xl font-medium text-[#3D5440]">
                +13%
              </span>
              <span className="text-[10px] font-sans text-[#554A42] block">
                Micro-relief uniformity
              </span>
            </GlassCard>

            <GlassCard variant="glass" hoverEffect tiltEffect className="p-4 rounded-2xl text-center space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42] block">
                Capillary Calming
              </span>
              <span className="font-serif text-2xl font-medium text-[#3D5440]">
                -28%
              </span>
              <span className="text-[10px] font-sans text-[#554A42] block">
                Reduced malar flush
              </span>
            </GlassCard>
          </div>
        </div>

        {/* Section 2: Chronological Timeline Archive */}
        <div className="space-y-6 pt-6 border-t border-white/60">
          <div className="space-y-1">
            <h2 className="editorial-heading text-3xl font-light text-[#2A2420]">
              Consultation Timeline
            </h2>
            <p className="font-sans text-xs text-[#554A42]">
              Every archived consultation contains full telemetry, clinical scores, and prescribed formulations.
            </p>
          </div>

          <div className="space-y-4">
            {analyses.map((item, idx) => (
              <GlassCard
                key={item.id}
                variant="glass"
                hoverEffect
                tiltEffect
                className="p-6 rounded-[28px] flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                onClick={() => navigateToScan(item)}
              >
                {/* Left: Thumbnail & Date Info */}
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden glass p-1 shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.headline}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute bottom-2 right-2 glass-chip px-1.5 py-0.5 text-[9px] font-mono">
                      #{analyses.length - idx}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#554A42] uppercase tracking-wider">
                        {item.formattedDate}
                      </span>
                      {idx === 0 && (
                        <Badge variant="sage" size="sm">
                          Latest Scan
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-serif text-2xl font-normal text-[#2A2420]">
                      {item.headline}
                    </h3>

                    <p className="font-sans text-xs text-[#554A42] max-w-md line-clamp-1">
                      {item.summary}
                    </p>

                    {/* Identified concerns tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.concerns.map((c) => (
                        <span
                          key={c.id}
                          className="glass-chip glass-chip-warm text-[10px] font-mono"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Score Pill & Action CTA */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-white/60">
                  <div className="text-right">
                    <span className="font-serif text-3xl font-light text-[#2A2420]">
                      {item.overallScore}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#554A42] block font-semibold">
                      Health Score
                    </span>
                  </div>

                  <EditorialButton
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToScan(item);
                    }}
                    className="gap-2 glass-btn"
                  >
                    <span>Open Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </EditorialButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
