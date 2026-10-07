import React from 'react';
import { useSkinSense } from '../../context/SkinSenseContext';
import { EditorialButton } from '../ui/EditorialButton';
import { Sparkles, ArrowRight } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  const { setCurrentPage } = useSkinSense();

  return (
    <section className="py-20 md:py-28 bg-transparent border-t border-white/50">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-[3rem] bg-[#2A2420]/90 backdrop-blur-2xl text-[#FAF7F0] p-10 sm:p-14 md:p-20 shadow-2xl text-center space-y-8 border border-white/20">
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E5CA8F]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Supertitle badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-[#E5CA8F] uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complimentary Digital Skin Consultation</span>
          </div>

          {/* Heading */}
          <h2 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-balance text-white">
            Ready to understand <br className="hidden sm:inline" />
            your skin?
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#DDD5CB] max-w-xl mx-auto leading-relaxed">
            Begin your diagnostic consultation today. Upload or capture a clear photo in natural daylight to receive your clinical skin health score and bespoke daily regimen.
          </p>

          {/* CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <EditorialButton
              variant="secondary"
              size="lg"
              onClick={() => setCurrentPage('analyze')}
              className="bg-[#FAF7F0] text-[#2A2420] hover:bg-white shadow-xl hover:shadow-2xl group gap-2 px-8 py-4 rounded-full transition-all"
            >
              <span>Analyze My Skin</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </EditorialButton>
          </div>

          {/* Privacy Note */}
          <p className="font-mono text-[10px] text-[#A69B90] tracking-wider uppercase pt-4">
            Encrypted client-side computation • Zero permanent photo retention
          </p>

        </div>
      </div>
    </section>
  );
};
