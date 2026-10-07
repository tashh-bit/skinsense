import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinSense } from '../context/SkinSenseContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { EditorialButton } from '../components/ui/EditorialButton';
import { MagneticPill } from '../components/motion/MagneticPill';
import { sendPredictionRequest } from '../lib/analyzer';
import { CameraCapture } from '../components/camera/CameraCapture';
import {
  Upload,
  Camera,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sun,
  Smile,
  Shield,
  Scan,
} from 'lucide-react';

type AnalysisStep = 'upload' | 'preview' | 'analyzing';

const SCAN_STAGES = [
  { name: 'Preparing optical matrix', region: 'Full Frame' },
  { name: 'Mapping stratum corneum', region: 'Epidermal Barrier' },
  { name: 'Evaluating micro-texture & roughness', region: 'Forehead & Cheeks' },
  { name: 'Measuring moisture reflectivity', region: 'Lateral Cheek Planes' },
  { name: 'Isolating vascular erythema', region: 'Bilateral Malar Zone' },
  { name: 'Synthesizing clinical skin profile', region: 'Multi-Vector Fusion' },
  { name: 'Curating personalized AM/PM regimen', region: 'Formulation Engine' },
];

const SAMPLE_PHOTOS = [
  {
    name: 'Natural Glow (Balanced)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sun-Kissed (Mild Pigment)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sensitive Complexion',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
];

export const Analyze: React.FC = () => {
  const { saveNewAnalysis, setCurrentPage } = useSkinSense();
  const [step, setStep] = useState<AnalysisStep>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        setStep('preview');
        setIsCameraActive(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setStep('preview');
          setIsCameraActive(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    setStep('analyzing');
    setCurrentStageIndex(0);
    setAnalysisError(null);

    let stage = 0;
    const interval = window.setInterval(() => {
      stage++;
      if (stage < SCAN_STAGES.length) {
        setCurrentStageIndex(stage);
      } else {
        clearInterval(interval);
      }
    }, 700);
    scanIntervalRef.current = interval;

    try {
      const result = await sendPredictionRequest(selectedImage);
      
      setTimeout(() => {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        saveNewAnalysis(result);
        setCurrentPage('results');
      }, 5200);
    } catch (err) {
      console.error('Analysis execution failed:', err);
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      setAnalysisError('Unable to complete optical telemetry. Please try again with a clearer photo.');
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-transparent">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 'preview') setStep('upload');
              else if (step === 'analyzing') setStep('preview');
              else setCurrentPage('home');
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#554A42] hover:text-[#2A2420] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 'upload' ? 'Back to Overview' : 'Change Image'}</span>
          </button>

          <Badge variant="glass-warm" size="sm">
            Step {step === 'upload' ? '01' : step === 'preview' ? '02' : '03'} • {step === 'upload' ? 'Upload Image' : step === 'preview' ? 'Verify Framing' : 'AI Optical Scan'}
          </Badge>
        </div>

        {/* ================= STEP 1: UPLOAD & CAPTURE ================= */}
        {step === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]">
                Show us your skin.
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#554A42] leading-relaxed">
                Upload a clear image or use your live camera for AI skin analysis. For the most accurate optical telemetry, use natural soft daylight.
              </p>
            </div>

            {/* Camera Viewfinder */}
            {isCameraActive ? (
              <CameraCapture
                onCapture={(_blob, dataUrl) => {
                  setSelectedImage(dataUrl);
                  setIsCameraActive(false);
                  setStep('preview');
                }}
                onCancel={() => setIsCameraActive(false)}
                onFallbackUpload={() => {
                  setIsCameraActive(false);
                  fileInputRef.current?.click();
                }}
              />
            ) : (
              /* Dropzone */
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer rounded-[2.5rem] p-10 sm:p-16 text-center border-2 border-dashed border-white/80 hover:border-[#8C6D2B] glass hover:bg-white/40 transition-all duration-300 shadow-soft"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="max-w-md mx-auto space-y-5">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-16 h-16 mx-auto rounded-3xl glass-sub flex items-center justify-center shadow-sm"
                  >
                    <Upload className="w-7 h-7 text-[#2A2420] group-hover:text-[#8C6D2B] transition-colors" />
                  </motion.div>

                  <div className="space-y-1.5">
                    <h2 className="font-serif text-2xl font-normal text-[#2A2420]">
                      Drag and drop your photo here
                    </h2>
                    <p className="font-sans text-xs text-[#554A42]">
                      Supports high-resolution JPG, PNG, and WebP (Up to 15MB)
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <MagneticPill strength={0.25}>
                      <EditorialButton
                        variant="primary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image</span>
                      </EditorialButton>
                    </MagneticPill>

                    <MagneticPill strength={0.25}>
                      <EditorialButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsCameraActive(true)}
                        className="gap-2 glass-btn"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Open Camera</span>
                      </EditorialButton>
                    </MagneticPill>
                  </div>
                </div>
              </div>
            )}


            {/* Instant Sample Photos */}
            <div className="space-y-4 pt-4">
              <div className="text-center space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#554A42]">
                  Instant Exploration
                </span>
                <p className="font-sans text-xs text-[#554A42]">
                  No photo on hand? Test with an authentic high-resolution diagnostic portrait:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SAMPLE_PHOTOS.map((sample, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    onClick={() => {
                      setSelectedImage(sample.url);
                      setStep('preview');
                    }}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] glass p-1 shadow-soft transition-all text-left focus:outline-none"
                  >
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[11px] font-sans text-white font-medium">
                          {sample.name}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Photography Guidance Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/60">
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-sub">
                <Sun className="w-4 h-4 text-[#8C6D2B] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-[#2A2420] block">Natural Daylight</span>
                  <span className="text-[#554A42]">Face a window to illuminate skin micro-relief without glare.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-sub">
                <Smile className="w-4 h-4 text-[#3D5440] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-[#2A2420] block">Bare Complexion</span>
                  <span className="text-[#554A42]">Clear skin reveals accurate capillary flush and pore structure.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl glass-sub">
                <Shield className="w-4 h-4 text-[#85341E] shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-[#2A2420] block">Private & Local</span>
                  <span className="text-[#554A42]">Pixels are analyzed in your browser memory and never uploaded.</span>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ================= STEP 2: PREVIEW & CONFIRM ================= */}
        {step === 'preview' && selectedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-2xl mx-auto text-center"
          >
            <div className="space-y-2">
              <h1 className="editorial-heading text-4xl sm:text-5xl font-light text-[#2A2420]">
                Confirm Framing.
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#554A42]">
                Ensure your full facial contours and natural cheek planes are visible.
              </p>
            </div>

            <GlassCard variant="glass" className="p-4 sm:p-6 rounded-[2.5rem]">
              <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative mx-auto max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-soft border border-white/60 bg-[#2A2420]"
              >
                <img
                  src={selectedImage}
                  alt="Selected skin scan preview"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Optical alignment frame overlay */}
                <div className="absolute inset-4 rounded-2xl border border-white/40 pointer-events-none" />

                <div className="absolute top-4 right-4 glass-chip text-[10px] font-mono uppercase tracking-wider text-[#2A2420]">
                  High Resolution
                </div>
              </motion.div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <MagneticPill strength={0.35}>
                  <EditorialButton
                    variant="primary"
                    size="lg"
                    onClick={startAnalysis}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#E5CA8F]" />
                    <span>Begin AI Analysis</span>
                  </EditorialButton>
                </MagneticPill>

                <EditorialButton
                  variant="secondary"
                  size="md"
                  onClick={() => setStep('upload')}
                  className="gap-2 glass-btn"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose Different Photo</span>
                </EditorialButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ================= STEP 3: CALM SCIENTIFIC AI SCAN ================= */}
        {step === 'analyzing' && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 max-w-2xl mx-auto text-center"
          >
            <div className="space-y-2">
              <Badge variant="glass-warm" size="sm">
                Live Computer Vision Telemetry
              </Badge>
              <h1 className="editorial-heading text-4xl sm:text-5xl font-light text-[#2A2420]">
                Analyzing Your Skin.
              </h1>
              <p className="font-sans text-xs sm:text-sm text-[#554A42]">
                Extracting optical reflectance and micro-topography without noise.
              </p>
            </div>

            {/* Premium Scanning HUD */}
            <GlassCard variant="glass" className="p-8 rounded-[2.5rem] space-y-8">
              
              {/* Image with subtle luminous aperture & scan line */}
              <div className="relative mx-auto max-w-xs aspect-[4/5] rounded-3xl overflow-hidden shadow-medium border border-white/40 bg-[#2A2420]">
                <img
                  src={selectedImage}
                  alt="Scanning portrait"
                  className="w-full h-full object-cover object-center opacity-90 filter contrast-105"
                />

                {/* Concentric Golden Aperture Rings Breathing */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div
                    animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-48 h-48 rounded-full border border-[#E5CA8F]/60"
                  />
                  <motion.div
                    animate={{ scale: [1.05, 0.94, 1.05], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-36 h-36 rounded-full border border-white/60"
                  />
                  <div className="w-20 h-20 rounded-full border border-dashed border-[#E5CA8F]/80" />
                </div>

                {/* Sub-region Diagnostic Reticle */}
                <motion.div
                  key={currentStageIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 glass-chip px-2.5 py-1 text-[9px] font-mono text-[#2A2420]"
                >
                  <Scan className="w-3 h-3 text-[#8C6D2B]" />
                  <span>{SCAN_STAGES[currentStageIndex].region}</span>
                </motion.div>

                {/* Subtle horizontal scanning line */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E5CA8F] to-transparent shadow-[0_0_15px_#E5CA8F]"
                />

                {/* Current Stage Pill overlay */}
                <div className="absolute bottom-4 left-4 right-4 glass-chip px-3 py-1.5 text-center justify-center">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#2A2420] font-medium flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D2B] animate-pulse" />
                    {SCAN_STAGES[currentStageIndex].name}...
                  </span>
                </div>
              </div>

              {/* Progress Pipeline */}
              <div className="space-y-3 max-w-md mx-auto text-left glass-sub p-5 rounded-2xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[#554A42] uppercase tracking-wider font-semibold">
                    Diagnostic Pipeline
                  </span>
                  <span className="font-mono font-semibold text-[#2A2420]">
                    {Math.round(((currentStageIndex + 1) / SCAN_STAGES.length) * 100)}%
                  </span>
                </div>

                <div className="w-full bg-white/50 h-1.5 rounded-full overflow-hidden border border-white/30">
                  <motion.div
                    className="bg-[#2A2420] h-full rounded-full"
                    animate={{
                      width: `${((currentStageIndex + 1) / SCAN_STAGES.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  {SCAN_STAGES.map((stage, idx) => {
                    const isPassed = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                          isCurrent
                            ? 'text-[#2A2420] font-medium'
                            : isPassed
                            ? 'text-[#3D5440] font-medium'
                            : 'text-[#554A42] opacity-40'
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5440] shrink-0" />
                        ) : isCurrent ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#8C6D2B] border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-white/60 shrink-0" />
                        )}
                        <span>{stage.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {analysisError && (
                <div className="p-4 rounded-2xl bg-[#F9EDE8] border border-[#E8C6BB] text-xs text-[#934029] flex items-center justify-between">
                  <span>{analysisError}</span>
                  <EditorialButton
                    variant="outline"
                    size="sm"
                    onClick={() => setStep('preview')}
                  >
                    Retry
                  </EditorialButton>
                </div>
              )}

            </GlassCard>

          </motion.div>
        )}

      </div>
    </div>
  );
};
