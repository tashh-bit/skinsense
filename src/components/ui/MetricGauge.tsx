import React from 'react';
import { formatScoreColor } from '../../lib/utils';

interface MetricGaugeProps {
  score: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  subtext?: string;
  className?: string;
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({
  score,
  label = 'Skin Health Score',
  size = 140,
  strokeWidth = 7,
  subtext,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;
  const colors = formatScoreColor(score);

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EAE4DA"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.ring}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-3xl md:text-4xl text-[#191614] font-medium tracking-tight">
            {score}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#8F857B]">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <span className="mt-3 font-sans text-xs tracking-wider uppercase text-[#6B6259] font-medium">
          {label}
        </span>
      )}

      {subtext && (
        <span className="mt-0.5 font-sans text-[11px] text-[#8F857B]">
          {subtext}
        </span>
      )}
    </div>
  );
};
