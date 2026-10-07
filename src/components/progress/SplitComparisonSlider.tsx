import React, { useState, useRef, useCallback } from 'react';

interface SplitComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const SplitComparisonSlider: React.FC<SplitComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Day 01 • Barrier Depleted',
  afterLabel = 'Day 28 • Barrier Restored',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-[2.5rem] shadow-editorial aspect-[4/3] md:aspect-[16/10] cursor-ew-resize border border-[#191614]/[0.08] bg-[#F5EFE6] ${className}`}
    >
      {/* After image (Underneath / Right side) */}
      <img
        src={afterImage}
        alt="Skin after treatment"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      <div className="absolute top-4 right-5 glass-pill px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#191614] shadow-sm pointer-events-none">
        {afterLabel}
      </div>

      {/* Before image (Clipped overlay / Left side) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Skin before treatment"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none filter contrast-[1.08] saturate-[1.1]"
        />
        <div className="absolute top-4 left-5 glass-pill px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-[#191614] shadow-sm pointer-events-none">
          {beforeLabel}
        </div>
      </div>

      {/* Vertical divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.4)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Center Grab Handle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-medium flex items-center justify-center border border-[#191614]/15">
          <div className="flex items-center gap-1 text-[#191614]">
            <span className="text-[10px] font-bold">‹</span>
            <span className="text-[10px] font-bold">›</span>
          </div>
        </div>
      </div>

      {/* Helper caption */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass-pill px-4 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest text-[#6B6259] pointer-events-none">
        Drag slider to compare dermal clarity
      </div>
    </div>
  );
};
