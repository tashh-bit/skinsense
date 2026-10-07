import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../motion/AnimatedCounter';
import { Sparkles, Activity, CalendarCheck } from 'lucide-react';

interface StatItem {
  numericValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const STATS: StatItem[] = [
  {
    numericValue: 96,
    suffix: '%',
    label: 'model validation accuracy',
    sublabel: 'Rigorous dermatological CNN benchmark',
    icon: Sparkles,
  },
  {
    numericValue: 5,
    label: 'clinical conditions classified',
    sublabel: 'Acne, Eczema, Pigmentation, Fungal & Healthy',
    icon: Activity,
  },
  {
    numericValue: 7,
    suffix: '-day',
    label: 'personalized routine',
    sublabel: 'Clinically adaptive AM / PM care protocols',
    icon: CalendarCheck,
  },
];

export const StatsColumn: React.FC = () => {
  return (
    <div className="flex flex-col justify-center space-y-6 lg:space-y-8 h-full py-4 lg:py-8 lg:pl-4">
      {STATS.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{
              duration: 0.7,
              delay: 0.3 + index * 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl glass glass-interactive transition-all duration-300"
          >
            {/* Icon badge with glass-sub styling */}
            <div className="w-11 h-11 rounded-2xl glass-sub flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Icon className="w-5 h-5 text-[#5B3E84]" />
            </div>

            {/* Metric content with animated counter */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#2A2420] tracking-tight">
                  <AnimatedCounter
                    value={stat.numericValue}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={1200 + index * 200}
                  />
                </span>
                <span className="font-sans text-xs sm:text-sm font-medium text-[#2A2420]">
                  {stat.label}
                </span>
              </div>

              <p className="font-sans text-[11px] text-[#554A42] leading-relaxed">
                {stat.sublabel}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
