import { AnalysisResult, RoutineStep } from '../types';

export const DEFAULT_ROUTINE: RoutineStep[] = [
  // Morning
  {
    id: 'am-1',
    stepNumber: 1,
    timeOfDay: 'morning',
    category: 'Cleanser',
    productName: 'Botanical Amino Cleansing Emulsion',
    subtitle: 'Ultra-gentle pH 5.5 restorative wash',
    keyActives: ['Oat Amino Acids', 'Centella Asiatica', 'Colloidal Ceramides'],
    what: 'A velvety non-foaming emulsion that sweeps away overnight cellular debris while preserving the skin\'s delicate acid mantle.',
    why: 'Harsh morning cleansers strip essential barrier ceramides. This preserves hydration reserves ahead of daytime environmental exposure.',
    when: 'Morning — First step upon waking.',
    how: 'Dispense two pumps onto slightly damp skin. Massage in gentle outward circular sweeps for 45 seconds, then rinse with lukewarm water.',
    textureNote: 'Milky, silk-like fluid with a subtle natural chamomile aroma',
  },
  {
    id: 'am-2',
    stepNumber: 2,
    timeOfDay: 'morning',
    category: 'Treatment',
    productName: 'Cellular Multi-Molecular Hyaluronic Serum',
    subtitle: 'Quad-weight deep dermal infusion',
    keyActives: ['Low & High MW Hyaluronate', 'Ectoin 1.5%', 'Polyglutamic Acid'],
    what: 'A concentrated multi-tier humectant serum designed to bind hydration across both stratum corneum and deeper epidermal layers.',
    why: 'Replenishes the 22% trans-epidermal hydration deficit identified in your AI skin scan.',
    when: 'Morning — Apply immediately after cleansing to damp skin.',
    how: 'Press 3-4 drops gently across the face, neck, and décolletage. Pat lightly with fingertips rather than rubbing.',
    textureNote: 'Lightweight water-gel that absorbs within seconds without stickiness',
  },
  {
    id: 'am-3',
    stepNumber: 3,
    timeOfDay: 'morning',
    category: 'Moisturizer',
    productName: 'Lipid Replenishing Barrier Soufflé',
    subtitle: 'Biomimetic squalane & ceramide complex',
    keyActives: ['Phytosqualane 5%', 'Ceramide NP/AP/EOP', 'Panthenol B5 3%'],
    what: 'A featherweight barrier-reinforcing cream engineered to seal in water molecules while bolstering lipid resilience.',
    why: 'Forms an invisible breathable matrix preventing daytime moisture evaporation and soothing localized cheek redness.',
    when: 'Morning — Following treatment serums.',
    how: 'Warm a dime-sized portion between warm fingertips, then gently press into the skin starting from the center of the face outwards.',
    textureNote: 'Whipped cloud-like soufflé that melts upon contact',
  },
  {
    id: 'am-4',
    stepNumber: 4,
    timeOfDay: 'morning',
    category: 'SPF',
    productName: 'Mineral Fluid Shield Broad Spectrum SPF 50+',
    subtitle: 'Invisible non-nano zinc with antioxidant ectoin',
    keyActives: ['Non-Nano Zinc Oxide 18.5%', 'Niacinamide 2%', 'Alpine Edelweiss'],
    what: 'An ethereal mineral shield defending against UVA/UVB, blue light, and oxidative pollution without chalkiness.',
    why: 'Protects fragile newly hydrated cells and prevents the exacerbation of detected mild pigment clusters.',
    when: 'Morning — Final step, at least 15 minutes prior to sun exposure.',
    how: 'Apply two full finger-lengths evenly across face, ears, and neck. Reapply every two hours if outdoors.',
    textureNote: 'Translucent satin fluid with zero white cast or greasy sheen',
  },

  // Evening
  {
    id: 'pm-1',
    stepNumber: 1,
    timeOfDay: 'evening',
    category: 'Cleanser',
    productName: 'Balancing Micro-Oil to Milk Cleanser',
    subtitle: 'First cleanse lipid dissolution',
    keyActives: ['Camellia Seed Oil', 'Squalane', 'Vitamin E'],
    what: 'A sumptuous botanical oil that effortlessly dissolves SPF, airborne micro-particulates, and excess surface sebum.',
    why: 'Prevents pore congestion in the T-Zone without triggering rebound oiliness.',
    when: 'Evening — First step of two-phase evening purification.',
    how: 'Massage dry onto dry skin for 60 seconds. Add a splash of warm water to transform into milk, then rinse thoroughly.',
    textureNote: 'Silky golden nectar that emulsifies into a pure white veil',
  },
  {
    id: 'pm-2',
    stepNumber: 2,
    timeOfDay: 'evening',
    category: 'Treatment',
    productName: 'Phyto-Retinol & Peptide Resurfacing Elixir',
    subtitle: 'Encapsulated gentle cell turnover catalyst',
    keyActives: ['Bakuchiol 1%', 'Copper Tripeptide-1', 'Niacinamide 3%'],
    what: 'A gentle nightly corrective treatment accelerating cellular renewal, smoothing dermal texture, and clarifying subtle tone variance.',
    why: 'Refines texture irregularities and minimizes subtle cheek erythema without inflammatory irritation.',
    when: 'Evening — 3 to 4 evenings weekly on clean, dry skin.',
    how: 'Dispense 1 dropper full. Smooth evenly avoiding the immediate eye contours. Allow 2 minutes to absorb before moisturizing.',
    textureNote: 'Opalescent serum with a soothing herbal profile',
  },
  {
    id: 'pm-3',
    stepNumber: 3,
    timeOfDay: 'evening',
    category: 'Moisturizer',
    productName: 'Overnight Recovery Ceramide Balm-Cream',
    subtitle: 'Nocturnal physiological barrier recovery',
    keyActives: ['Cholesterol & Fatty Acid Matrix (3:1:1)', 'Madecassoside', 'Beta-Glucan'],
    what: 'An intensive nightly cocoon that works in harmony with the body\'s natural circadian healing rhythms.',
    why: 'Restores the epidermal lipid ratio while you sleep, waking to plumper, calmed, and visibly luminous skin.',
    when: 'Evening — Final night ritual step.',
    how: 'Smooth an almond-sized dollop over face and throat using upward lymphatic draining strokes.',
    textureNote: 'Cushiony rich cream that envelops skin in continuous hydration',
  }
];

export const INITIAL_ANALYSES: AnalysisResult[] = [
  {
    id: 'scan-1',
    date: '2026-10-04T10:30:00Z',
    formattedDate: 'October 4, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    overallScore: 82,
    skinType: 'Combination',
    headline: 'Harmonious Barrier with Mild Dehydration',
    summary: 'Your dermal barrier displays strong cellular integrity with 84% structural smoothness. A slight moisture differential was detected across the lateral cheek zones, while sebum balance remains well-regulated in the central T-zone.',
    metrics: [
      {
        id: 'hydration',
        name: 'Hydration',
        score: 78,
        status: 'optimal',
        displayValue: '78%',
        description: 'Epidermal water reserves are healthy, with mild localized deficit on lateral cheek planes.',
        category: 'barrier',
        optimalRange: '75% - 90%'
      },
      {
        id: 'oilBalance',
        name: 'Oil Balance',
        score: 71,
        status: 'balanced',
        displayValue: '71%',
        description: 'Sebaceous gland activity is harmonized with minor noon shine in the central T-zone.',
        category: 'barrier',
        optimalRange: '65% - 80%'
      },
      {
        id: 'texture',
        name: 'Texture',
        score: 84,
        status: 'optimal',
        displayValue: '84%',
        description: 'Micro-relief is exceptionally refined with minimal pore dilation or roughness.',
        category: 'texture',
        optimalRange: '80% - 95%'
      },
      {
        id: 'clarity',
        name: 'Clarity',
        score: 76,
        status: 'balanced',
        displayValue: '76%',
        description: 'Luminance is uniform with isolated faint post-inflammatory marks.',
        category: 'tone',
        optimalRange: '75% - 90%'
      },
      {
        id: 'redness',
        name: 'Redness',
        score: 88,
        status: 'low',
        displayValue: 'Low',
        description: 'Vascular reactivity is subdued; low presence of transient erythema.',
        category: 'tone',
        optimalRange: 'Low'
      },
      {
        id: 'pigmentation',
        name: 'Pigmentation',
        score: 69,
        status: 'moderate',
        displayValue: 'Moderate',
        description: 'Faint localized photo-melanin clusters observed across the bridge of the nose.',
        category: 'tone',
        optimalRange: 'Low - Minimal'
      }
    ],
    concerns: [
      {
        id: 'c-1',
        name: 'Localized Dehydration',
        severity: 'mild',
        description: 'Slight depletion of intercellular water holding capacity in cheek areas.',
        area: 'Lateral Cheeks'
      },
      {
        id: 'c-2',
        name: 'Micro-Pigment Clusters',
        severity: 'mild',
        description: 'Scattered superficial melanin concentration typical of UV sun exposure.',
        area: 'Nasal Bridge & High Cheeks'
      }
    ],
    routine: DEFAULT_ROUTINE,
    disclaimer: 'This analysis is informational and generated via computer vision telemetry. It does not constitute medical diagnosis. For persistent or concerning skin conditions, consult a board-certified dermatologist.',
    detectedCondition: 'dryness',
    confidence: 89,
    conditionLabel: 'Dryness & Barrier Dehydration'
  },
  {
    id: 'scan-2',
    date: '2026-09-27T11:15:00Z',
    formattedDate: 'September 27, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    overallScore: 78,
    skinType: 'Dry',
    headline: 'Transient Moisture Depletion',
    summary: 'Surface hydration showed a dip following seasonal weather shifts, accompanied by heightened sensitivity around the lower cheek contour.',
    metrics: [
      {
        id: 'hydration',
        name: 'Hydration',
        score: 68,
        status: 'moderate',
        displayValue: '68%',
        description: 'Sub-optimal stratum corneum moisture with fine thirst lines.',
        category: 'barrier'
      },
      {
        id: 'oilBalance',
        name: 'Oil Balance',
        score: 65,
        status: 'moderate',
        displayValue: '65%',
        description: 'Reduced protective lipid secretion.',
        category: 'barrier'
      },
      {
        id: 'texture',
        name: 'Texture',
        score: 79,
        status: 'balanced',
        displayValue: '79%',
        description: 'Minor superficial flaking observed.',
        category: 'texture'
      },
      {
        id: 'clarity',
        name: 'Clarity',
        score: 72,
        status: 'balanced',
        displayValue: '72%',
        description: 'Subtle dullness from dehydrated corneocytes.',
        category: 'tone'
      },
      {
        id: 'redness',
        name: 'Redness',
        score: 74,
        status: 'moderate',
        displayValue: 'Moderate',
        description: 'Mild windburn flushed appearance.',
        category: 'tone'
      },
      {
        id: 'pigmentation',
        name: 'Pigmentation',
        score: 68,
        status: 'moderate',
        displayValue: 'Moderate',
        description: 'Steady superficial pigment spots.',
        category: 'tone'
      }
    ],
    concerns: [
      {
        id: 'c-1',
        name: 'Transepidermal Water Loss',
        severity: 'moderate',
        description: 'Barrier evaporation requiring rich ceramide sealing.',
        area: 'Cheeks & Jawline'
      }
    ],
    routine: DEFAULT_ROUTINE,
    disclaimer: 'This analysis is informational and generated via computer vision telemetry.'
  },
  {
    id: 'scan-3',
    date: '2026-09-20T09:45:00Z',
    formattedDate: 'September 20, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    overallScore: 74,
    skinType: 'Sensitive',
    headline: 'Reactive Sensitivity & Compromised Barrier',
    summary: 'Heightened vascular reactivity was registered along with lowered hydration thresholds, calling for soothing botanical calming agents.',
    metrics: [
      {
        id: 'hydration',
        name: 'Hydration',
        score: 59,
        status: 'attention',
        displayValue: '59%',
        description: 'Marked moisture deficiency.',
        category: 'barrier'
      },
      {
        id: 'oilBalance',
        name: 'Oil Balance',
        score: 62,
        status: 'moderate',
        displayValue: '62%',
        description: 'Imbalanced sebum barrier ratio.',
        category: 'barrier'
      },
      {
        id: 'texture',
        name: 'Texture',
        score: 71,
        status: 'moderate',
        displayValue: '71%',
        description: 'Roughness from accelerated desquamation.',
        category: 'texture'
      },
      {
        id: 'clarity',
        name: 'Clarity',
        score: 68,
        status: 'moderate',
        displayValue: '68%',
        description: 'Reduced luminosity.',
        category: 'tone'
      },
      {
        id: 'redness',
        name: 'Redness',
        score: 60,
        status: 'attention',
        displayValue: 'Pronounced',
        description: 'Visible flushed patches on cheeks.',
        category: 'tone'
      },
      {
        id: 'pigmentation',
        name: 'Pigmentation',
        score: 67,
        status: 'moderate',
        displayValue: 'Moderate',
        description: 'Typical superficial melanin.',
        category: 'tone'
      }
    ],
    concerns: [
      {
        id: 'c-1',
        name: 'Heightened Erythema',
        severity: 'pronounced',
        description: 'Reactive redness requiring soothing centella asiatica.',
        area: 'Bilateral Malar Region'
      }
    ],
    routine: DEFAULT_ROUTINE,
    disclaimer: 'This analysis is informational and generated via computer vision telemetry.'
  }
];
