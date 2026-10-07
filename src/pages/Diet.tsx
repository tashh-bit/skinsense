import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkinSense } from '../context/SkinSenseContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { EditorialButton } from '../components/ui/EditorialButton';
import { MagneticPill } from '../components/motion/MagneticPill';
import dietData from '../data/diet.json';
import { DetectedCondition, DietRecommendation, RoutineStep } from '../types';
import {
  Sparkles,
  Droplets,
  ShieldAlert,
  Download,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  Utensils,
  Heart,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Check,
} from 'lucide-react';

const CONDITIONS_LIST: { id: DetectedCondition; label: string }[] = [
  { id: 'acne', label: 'Acne & Breakouts' },
  { id: 'eczema', label: 'Eczema & Dermatitis' },
  { id: 'fungal_infection', label: 'Fungal / Malassezia' },
  { id: 'pigmentation', label: 'Hyperpigmentation' },
  { id: 'dryness', label: 'Dryness & Dehydration' },
  { id: 'general_barrier', label: 'Barrier Equilibrium' },
];

const ALLERGIES_LIST = ['Dairy', 'Gluten', 'Nuts', 'Shellfish', 'Soy'];

export const Diet: React.FC = () => {
  const { currentAnalysis, setCurrentPage } = useSkinSense();

  // Selected Condition (defaults to the one detected in current analysis)
  const initialCondition: DetectedCondition =
    currentAnalysis.detectedCondition || 'dryness';
  const [selectedCondition, setSelectedCondition] =
    useState<DetectedCondition>(initialCondition);

  // Preference Filters
  const [dietType, setDietType] = useState<'veg' | 'non-veg' | 'vegan'>('veg');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'eat' | 'limit' | 'plan'>('overview');

  // Interactive Hydration Tracker (8 glasses = 2.0 Liters)
  const [waterGlasses, setWaterGlasses] = useState<number>(4);

  // Active condition dataset
  const currentPlan: DietRecommendation =
    (dietData as Record<string, DietRecommendation>)[selectedCondition] ||
    dietData.general_barrier;

  const confidenceScore = currentAnalysis.confidence || 91;

  const toggleAllergy = (allergy: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  // Routine steps associated with the analysis
  const routineSteps: RoutineStep[] = currentAnalysis.routine || [];

  return (
    <div className="min-h-screen py-10 md:py-16 px-4 sm:px-6 lg:px-12 bg-transparent text-[#2A2420]">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ================= PAGE HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/60">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-2.5"
            >
              <Badge variant="glass-warm" size="sm" className="gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8C6D2B]" />
                <span className="font-mono text-xs">Nutritional Dermatology</span>
              </Badge>

              <span className="glass-chip text-xs font-mono text-[#554A42] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8C6D2B]" />
                <span>Synchronized with Scan ID: {currentAnalysis.id.slice(0, 10)}</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="editorial-heading text-4xl sm:text-5xl md:text-6xl font-light text-[#2A2420]"
            >
              Diet & Nutrition Protocol.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-sm sm:text-base text-[#554A42] max-w-2xl leading-relaxed"
            >
              Targeted nutritional biochemistry to complement your topical skincare regimen. Formulated for your detected condition: <strong className="text-[#2A2420]">{currentPlan.name}</strong> ({confidenceScore}% AI Confidence).
            </motion.p>
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3 shrink-0"
          >
            <MagneticPill strength={0.25}>
              <EditorialButton
                variant="primary"
                size="sm"
                onClick={handleDownloadPDF}
                className="gap-2"
              >
                <Download className="w-3.5 h-3.5 text-[#E5CA8F]" />
                <span>Download Plan as PDF</span>
              </EditorialButton>
            </MagneticPill>

            <MagneticPill strength={0.25}>
              <EditorialButton
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage('routine')}
                className="gap-2 glass-btn"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View Regimen</span>
              </EditorialButton>
            </MagneticPill>
          </motion.div>
        </div>

        {/* ================= CONDITION SELECTOR PILLS ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#554A42]">
            <span>EXPLORE NUTRITION BY DETECTED CONDITION:</span>
            {selectedCondition === initialCondition && (
              <span className="text-[#3D5440] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Matched to your skin scan
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CONDITIONS_LIST.map((cond) => {
              const isSelected = selectedCondition === cond.id;
              const isDetected = initialCondition === cond.id;
              return (
                <button
                  key={cond.id}
                  onClick={() => setSelectedCondition(cond.id)}
                  className={`text-xs font-sans px-3.5 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 focus:outline-none ${
                    isSelected
                      ? 'bg-[#2A2420] text-white shadow-soft scale-105'
                      : 'glass-chip hover:bg-white/50 text-[#554A42]'
                  }`}
                >
                  {isDetected && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#E5CA8F]' : 'bg-[#3D5440]'
                      }`}
                    />
                  )}
                  <span>{cond.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= USER CUSTOMIZATION BAR ================= */}
        <GlassCard variant="glass" className="p-6 rounded-[2rem] space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Diet Preference: Veg / Non-Veg / Vegan */}
            <div className="md:col-span-5 space-y-2">
              <span className="font-mono text-xs text-[#554A42] uppercase tracking-wider block">
                Dietary Preference
              </span>
              <div className="flex items-center gap-2">
                {(['veg', 'non-veg', 'vegan'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDietType(type)}
                    className={`text-xs font-medium px-3.5 py-1.5 rounded-full capitalize transition-all ${
                      dietType === type
                        ? 'bg-[#2A2420] text-white shadow-sm'
                        : 'glass-sub text-[#554A42] hover:text-[#2A2420]'
                    }`}
                  >
                    {type === 'non-veg' ? 'Non-Vegetarian' : type === 'veg' ? 'Vegetarian' : '100% Vegan'}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies / Sensitivities */}
            <div className="md:col-span-7 space-y-2">
              <span className="font-mono text-xs text-[#554A42] uppercase tracking-wider block">
                Allergies & Sensitivities (Optional)
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {ALLERGIES_LIST.map((allergy) => {
                  const active = selectedAllergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      onClick={() => toggleAllergy(allergy)}
                      className={`text-[11px] font-sans px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                        active
                          ? 'bg-[#85341E] text-white'
                          : 'glass-sub text-[#554A42] hover:text-[#2A2420]'
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                      <span>{allergy} Free</span>
                    </button>
                  );
                })}
                {selectedAllergies.length > 0 && (
                  <button
                    onClick={() => setSelectedAllergies([])}
                    className="text-[10px] font-mono text-[#85341E] underline ml-2"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

          </div>
        </GlassCard>

        {/* ================= INTERACTIVE HYDRATION TRACKER ================= */}
        <GlassCard variant="glass" className="p-6 md:p-8 rounded-[2.5rem] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-[#3D7C98]" />
                <h3 className="font-serif text-xl font-normal text-[#2A2420]">
                  Hydration & Cellular Electrolyte Tracker
                </h3>
              </div>
              <p className="font-sans text-xs text-[#554A42] max-w-xl">
                {currentPlan.hydrationTip}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono text-lg font-semibold text-[#2A2420]">
                {waterGlasses * 250} mL / 2,000 mL
              </div>
              <span className="font-sans text-[11px] text-[#554A42]">
                {waterGlasses === 8
                  ? 'Goal Achieved: Peak Dermal Turgor'
                  : `${8 - waterGlasses} glasses remaining`}
              </span>
            </div>
          </div>

          {/* 8 Interactive Glass Icons */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
              const isFilled = index <= waterGlasses;
              return (
                <button
                  key={index}
                  onClick={() => setWaterGlasses(index)}
                  className={`group relative p-3 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 focus:outline-none ${
                    isFilled
                      ? 'glass-chip bg-[#3D7C98]/15 border-[#3D7C98]/40 shadow-sm scale-105'
                      : 'glass-sub opacity-50 hover:opacity-80'
                  }`}
                  title={`Tap to log ${index * 250}ml`}
                >
                  <div
                    className={`w-7 h-9 rounded-b-xl border-2 transition-all flex items-end justify-center overflow-hidden p-0.5 ${
                      isFilled
                        ? 'border-[#3D7C98] bg-[#3D7C98]/20'
                        : 'border-[#554A42]/40 bg-white/30'
                    }`}
                  >
                    <div
                      className={`w-full transition-all duration-500 rounded-b-lg ${
                        isFilled ? 'bg-[#3D7C98] h-full' : 'bg-transparent h-0'
                      }`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[#554A42]">
                    {index * 250}ml
                  </span>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* ================= PROTOCOL NAVIGATION TABS ================= */}
        <div className="flex items-center gap-2 border-b border-white/60 pb-3">
          {[
            { id: 'overview', label: 'Clinical Overview & Nutrients' },
            { id: 'eat', label: 'Foods That Help (Eat More)' },
            { id: 'limit', label: 'Foods to Limit & Avoid' },
            { id: 'plan', label: 'Sample 1-Day Meal Plan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`text-xs sm:text-sm font-sans font-medium px-4 py-2 rounded-full transition-all duration-300 focus:outline-none ${
                activeTab === tab.id
                  ? 'bg-[#2A2420] text-white shadow-soft'
                  : 'glass-chip text-[#554A42] hover:text-[#2A2420]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: OVERVIEW & KEY NUTRIENTS ================= */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Condition Banner */}
            <GlassCard variant="glass" className="p-6 md:p-8 rounded-[2.5rem] space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="glass-warm" size="sm">
                  Dermal Strategy
                </Badge>
                <span className="font-mono text-xs text-[#554A42]">
                  Biochemical Synergy Focus
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2A2420]">
                {currentPlan.name}
              </h2>
              <p className="font-sans text-sm text-[#554A42] max-w-2xl leading-relaxed">
                {currentPlan.tagline}
              </p>
            </GlassCard>

            {/* Nutrients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentPlan.keyNutrients.map((nutrient, idx) => (
                <motion.div
                  key={nutrient.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <GlassCard variant="glass" className="p-6 rounded-3xl space-y-3 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-[#3D5440]" />
                        <h4 className="font-serif text-lg text-[#2A2420] font-normal">
                          {nutrient.name}
                        </h4>
                      </div>
                      <p className="font-sans text-xs text-[#554A42] leading-relaxed">
                        {nutrient.benefit}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl glass-sub text-xs space-y-1">
                      <span className="font-mono text-[10px] text-[#8C6D2B] uppercase tracking-wider block font-semibold">
                        Primary Food Sources
                      </span>
                      <span className="text-[#2A2420] font-medium block">
                        {nutrient.sources}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= TAB 2: FOODS TO EAT (EAT MORE) ================= */}
        {activeTab === 'eat' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentPlan.foodsToEat.map((food, idx) => (
                <motion.div
                  key={food.item}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <GlassCard variant="glass" className="p-6 rounded-3xl space-y-3 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif text-lg text-[#2A2420] font-normal">
                          {food.item}
                        </span>
                        {food.category && (
                          <Badge variant="glass-warm" size="sm">
                            {food.category}
                          </Badge>
                        )}
                      </div>
                      <p className="font-sans text-xs text-[#554A42] leading-relaxed">
                        {food.reason}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-1.5 text-[#3D5440] font-mono text-[10px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Recommended for daily integration</span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= TAB 3: FOODS TO LIMIT / AVOID ================= */}
        {activeTab === 'limit' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentPlan.foodsToLimit.map((food, idx) => (
                <motion.div
                  key={food.item}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <GlassCard variant="glass" className="p-6 rounded-3xl space-y-3 h-full flex flex-col justify-between border-[#F0D1C6]/80">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#85341E] shrink-0" />
                        <span className="font-serif text-lg text-[#85341E] font-normal">
                          {food.item}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#554A42] leading-relaxed">
                        {food.reason}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FDF2EE] border border-[#F0D1C6] text-[11px] text-[#85341E]">
                      <strong>Tip:</strong> Moderate or substitute with whole, unprocessed foods.
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= TAB 4: SAMPLE 1-DAY MEAL PLAN ================= */}
        {activeTab === 'plan' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#554A42] uppercase tracking-wider">
                Showing {dietType === 'non-veg' ? 'Non-Vegetarian' : 'Vegetarian / Plant'} Menu
              </span>
              <span className="text-xs text-[#8C6D2B] font-mono">
                Indian & Global Culinary Options Included
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  period: 'Breakfast',
                  time: '08:00 AM',
                  desc:
                    dietType === 'non-veg'
                      ? currentPlan.sampleMealPlan.breakfast.nonVeg
                      : currentPlan.sampleMealPlan.breakfast.veg,
                },
                {
                  period: 'Lunch',
                  time: '01:00 PM',
                  desc:
                    dietType === 'non-veg'
                      ? currentPlan.sampleMealPlan.lunch.nonVeg
                      : currentPlan.sampleMealPlan.lunch.veg,
                },
                {
                  period: 'Afternoon Nourishment / Snack',
                  time: '04:30 PM',
                  desc:
                    dietType === 'non-veg'
                      ? currentPlan.sampleMealPlan.snack.nonVeg
                      : currentPlan.sampleMealPlan.snack.veg,
                },
                {
                  period: 'Dinner',
                  time: '07:30 PM',
                  desc:
                    dietType === 'non-veg'
                      ? currentPlan.sampleMealPlan.dinner.nonVeg
                      : currentPlan.sampleMealPlan.dinner.veg,
                },
              ].map((meal, idx) => (
                <motion.div
                  key={meal.period}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <GlassCard variant="glass" className="p-6 md:p-7 rounded-[2rem] space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="glass-warm" size="sm">
                          {meal.period}
                        </Badge>
                        <span className="font-mono text-xs text-[#554A42] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8C6D2B]" />
                          {meal.time}
                        </span>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-[#2A2420] leading-relaxed">
                        {meal.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/60 flex items-center justify-between text-[11px] text-[#554A42]">
                      <span className="flex items-center gap-1.5 font-mono text-[10px]">
                        <Utensils className="w-3 h-3 text-[#8C6D2B]" />
                        Digestive Balance
                      </span>
                      <span className="font-semibold text-[#3D5440]">
                        Bioavailable Nutrients
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ================= CONNECTED ROUTINE SYNERGIES ================= */}
        <div className="space-y-6 pt-6 border-t border-white/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Badge variant="glass-warm" size="sm">
                Holistic Treatment Loop
              </Badge>
              <h2 className="editorial-heading text-2xl sm:text-3xl font-light text-[#2A2420]">
                Your Prescribed Regimen + Diet Synergy
              </h2>
              <p className="font-sans text-xs text-[#554A42]">
                How your topical actives (STEP 01/02/03) pair with today&apos;s nutritional protocol.
              </p>
            </div>

            <EditorialButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage('routine')}
              className="gap-2 glass-btn"
            >
              <span>Explore Full Regimen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </EditorialButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {routineSteps.slice(0, 3).map((step, idx) => (
              <GlassCard key={step.id} variant="glass" className="p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold text-[#8C6D2B]">
                    STEP 0{idx + 1} • {step.category}
                  </span>
                  <span className="glass-chip text-[10px] font-mono capitalize">
                    {step.timeOfDay}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-normal text-[#2A2420] line-clamp-1">
                    {step.productName}
                  </h3>
                  <p className="text-xs text-[#554A42] line-clamp-2">
                    {step.why}
                  </p>
                </div>

                <div className="p-3 rounded-2xl glass-sub text-[11px] space-y-0.5">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#8C6D2B] block">
                    Key Actives
                  </span>
                  <span className="text-[#2A2420] font-medium">
                    {step.keyActives.slice(0, 2).join(' • ')}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* ================= MANDATORY MEDICAL SAFETY DISCLAIMER ================= */}
        <div className="p-6 md:p-8 rounded-3xl glass-sub border border-white/80 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#85341E] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#85341E] font-semibold">
                Nutritional & Clinical Disclaimer
              </h4>
              <p className="font-sans text-xs text-[#554A42] leading-relaxed">
                These are general wellness suggestions, not medical advice. Consult a dermatologist for diagnosis and treatment. Do not use dietary suggestions as a substitute for professional medical consultation or prescription therapies. If you have known food allergies, gastrointestinal conditions, or metabolic disorders, verify adjustments with your physician or registered dietitian.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
