import React from 'react';
import { useSkinSense } from '../context/SkinSenseContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { EditorialButton } from '../components/ui/EditorialButton';
import { ShieldCheck, Eye, Sparkles, HeartHandshake, Award } from 'lucide-react';

export const About: React.FC = () => {
  const { setCurrentPage } = useSkinSense();

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-transparent">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Editorial Header */}
        <div className="space-y-4 max-w-2xl">
          <Badge variant="glass-warm" size="sm">
            Ethical AI & Clinical Dermatology
          </Badge>
          <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
            AI that sees your skin differently.
          </h1>
          <p className="font-sans text-base sm:text-lg text-[#554A42] leading-relaxed">
            SkinSense AI was founded on a simple premise: skin health should never be reduced to generic product marketing or cold, impersonal SaaS matrices.
          </p>
        </div>

        {/* Visual Spread Banner with Frosted Glass Frame */}
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[16/8] glass p-2 border border-white/80 shadow-soft">
          <div className="w-full h-full relative rounded-[2.25rem] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=85"
              alt="Botanical formulation and serene laboratory"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A2420]/80 via-transparent to-transparent flex items-end p-8 md:p-12">
              <div className="text-white space-y-2 max-w-xl">
                <span className="glass-chip glass-chip-warm font-mono text-xs uppercase tracking-wider text-white bg-white/20 border-white/40">
                  Our Philosophy
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-light text-white">
                  Intelligent optical telemetry paired with restorative botanical nourishment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="glass" hoverEffect tiltEffect className="p-8 rounded-3xl space-y-4">
            <div className="w-11 h-11 rounded-2xl glass-sub flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#3D5440]" />
            </div>
            <h3 className="font-serif text-2xl font-light text-[#2A2420]">
              Optical Fidelity
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
              We sample high-contrast facial regions for vascular redness, melanin dispersion, and surface roughness with zero generative hallucination.
            </p>
          </GlassCard>

          <GlassCard variant="glass" hoverEffect tiltEffect className="p-8 rounded-3xl space-y-4">
            <div className="w-11 h-11 rounded-2xl glass-sub flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#8C6D2B]" />
            </div>
            <h3 className="font-serif text-2xl font-light text-[#2A2420]">
              Zero-Cloud Privacy
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
              Your biometric face photos are processed locally on your device’s GPU/Canvas pipeline. We never store or sell your facial likeness.
            </p>
          </GlassCard>

          <GlassCard variant="glass" hoverEffect tiltEffect className="p-8 rounded-3xl space-y-4">
            <div className="w-11 h-11 rounded-2xl glass-sub flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-[#85341E]" />
            </div>
            <h3 className="font-serif text-2xl font-light text-[#2A2420]">
              Restorative Rituals
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#554A42] leading-relaxed">
              Every prescribed regimen focuses on barrier repair, non-stripping surfactants, and lipid-balancing hydration.
            </p>
          </GlassCard>
        </div>

        {/* Ethical Standards & Advisory */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] glass space-y-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#8C6D2B]" />
            <h2 className="editorial-heading text-3xl font-light text-[#2A2420]">
              Ethical Advisory Standards
            </h2>
          </div>
          <p className="font-sans text-sm text-[#554A42] leading-relaxed">
            SkinSense AI is designed exclusively for informational cosmetic skin health optimization. It is engineered with strict ethical guardrails: our algorithm flags vascular sensitivity and recommends consulting certified medical professionals whenever persistent erythema or suspicious melanocytic asymmetry is detected.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-6 pt-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2A2420]">
            Experience SkinSense for yourself.
          </h2>
          <EditorialButton
            variant="primary"
            size="lg"
            onClick={() => setCurrentPage('analyze')}
            className="gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-[#E5CA8F]" />
            <span>Start Free Digital Consultation</span>
          </EditorialButton>
        </div>

      </div>
    </div>
  );
};
