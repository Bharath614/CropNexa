export type CropCategory = 'Cereals' | 'Pulses/Legumes' | 'Oilseeds' | 'Fiber Crops' | 'Sugar Crops' | 'Vegetables' | 'Fruits' | 'Plantation Crops' | 'Spices' | 'Medicinal & Aromatic' | 'Fodder Crops' | 'Floriculture';

export interface CropStageDuration {
  germination: number;
  seedling: number;
  vegetative: number;
  flowering: number;
  fruiting: number;
  maturity: number;
  harvest: number;
}

export interface IrrigationData {
  waterRequirement: string;
  irrigationFrequency: string;
  dripRecommendation: string;
  criticalStages: string[];
}

export interface FertilizerRecommendation {
  organic: string[];
  conventional: string[];
  inm: string[];
  npk: string;
  micronutrients: string[];
  organicManures: string[];
  biofertilizers: string[];
}

export interface CompanionBenefit {
  nutrient: string;
  pestControl: string;
  pollinator: string;
  soilHealth: string;
  waterEfficiency: string;
}

export interface BenefitScores {
  soilHealth: number;
  nitrogenContribution: number;
  pestReduction: number;
  diseaseSuppression: number;
  pollinatorAttraction: number;
  waterUseEfficiency: number;
}

export interface RecommendedCompanion {
  name: string;
  rank: 'Highly Recommended' | 'Recommended' | 'Optional';
  compatibilityScore: number;
  benefits: CompanionBenefit;
  scores: BenefitScores;
  explanation: string;
}

export interface AntagonisticCompanion {
  name: string;
  riskCategory: 'Disease Risk' | 'Shared Pest Risk' | 'Nutrient Competition' | 'Allelopathy' | 'Light Competition' | 'Water Competition' | 'Juglone Toxicity';
  reason: string;
  riskScore: number;
}

export interface PestManagement {
  name: string;
  symptoms: string;
  controlMeasures: string;
  organicControl: string;
  chemicalControl: string;
  biologicalControl: string;
}

export interface DiseaseManagement {
  name: string;
  symptoms: string;
  prevention: string;
  treatment: string;
  organicSolutions: string;
}

export interface HarvestInfo {
  indicators: string[];
  harvestDuration: string;
  expectedYield: string;
  postHarvestHandling: string;
  storageConditions: string;
}

export interface MarketInfo {
  averageYield: string;
  averageMarketPrice: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  storageLife: string;
  exportPotential: 'High' | 'Medium' | 'Low';
}

export interface AIData {
  companionRecommendation: string;
  weatherBasedAdvice: string;
  nutrientRecommendation: string;
  diseasePrediction: string;
  yieldPrediction: string;
  waterManagement: string;
  cropRotation: string;
  sustainableFarming: string;
}

export type PhotoperiodType = 'Short-Day Crop' | 'Long-Day Crop' | 'Day-Neutral Crop';

export interface LightAndWaterIntelligence {
  sunlight: 'Full Sun (>6 Hours)' | 'Partial Sun (4–6 Hours)' | 'Full Shade (<2 Hours)';
  photoperiod: PhotoperiodType;
  weeklyWaterNeedInches: number; // inches per week
  seasonalWaterNeedMm: number; // mm total cycle
  waterCategory: 'High' | 'Medium' | 'Low';
}

export interface CropData {
  id: string;
  name: string;
  category: CropCategory;
  scientificName: string;
  commonName: string;
  family: string;
  cropImage: string;
  description: string;
  temperatureRange: string;
  humidityRange: string;
  rainfallRequirement: string;
  soilType: string;
  soilPh: string;
  sunlight: 'Full Sun (>6 Hours)' | 'Partial Sun (4–6 Hours)' | 'Full Shade (<2 Hours)';
  photoperiod?: PhotoperiodType;
  weeklyWaterNeedInches?: number;
  seasonalWaterNeedMm?: number;
  altitude: string;
  suitableSeasons: string[];
  cropDuration: string;
  stages: CropStageDuration;
  irrigation: IrrigationData;
  fertilizer: FertilizerRecommendation;
  companions: RecommendedCompanion[];
  antagonists: AntagonisticCompanion[];
  pests: PestManagement[];
  diseases: DiseaseManagement[];
  harvest: HarvestInfo;
  market: MarketInfo;
  aiData: AIData;
}

export function getCropLightAndWaterIntelligence(cropNameOrId: string): LightAndWaterIntelligence {
  const key = (cropNameOrId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const crop = CROP_DATABASE[key] || Object.values(CROP_DATABASE).find(c => c.name.toLowerCase() === (cropNameOrId || '').toLowerCase());
  
  if (crop && crop.photoperiod && crop.weeklyWaterNeedInches && crop.seasonalWaterNeedMm) {
    return {
      sunlight: crop.sunlight,
      photoperiod: crop.photoperiod,
      weeklyWaterNeedInches: crop.weeklyWaterNeedInches,
      seasonalWaterNeedMm: crop.seasonalWaterNeedMm,
      waterCategory: crop.seasonalWaterNeedMm > 900 ? 'High' : crop.seasonalWaterNeedMm > 450 ? 'Medium' : 'Low'
    };
  }

  // Domain mappings for light and water requirements
  if (key.includes('rice') || key.includes('paddy')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Short-Day Crop', weeklyWaterNeedInches: 2.2, seasonalWaterNeedMm: 1250, waterCategory: 'High' };
  }
  if (key.includes('wheat') || key.includes('barley')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Long-Day Crop', weeklyWaterNeedInches: 1.2, seasonalWaterNeedMm: 550, waterCategory: 'Medium' };
  }
  if (key.includes('maize') || key.includes('corn')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Day-Neutral Crop', weeklyWaterNeedInches: 1.5, seasonalWaterNeedMm: 650, waterCategory: 'Medium' };
  }
  if (key.includes('cotton')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Short-Day Crop', weeklyWaterNeedInches: 1.8, seasonalWaterNeedMm: 850, waterCategory: 'High' };
  }
  if (key.includes('sugarcane')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Short-Day Crop', weeklyWaterNeedInches: 2.5, seasonalWaterNeedMm: 1800, waterCategory: 'High' };
  }
  if (key.includes('sunflower')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Day-Neutral Crop', weeklyWaterNeedInches: 1.2, seasonalWaterNeedMm: 500, waterCategory: 'Medium' };
  }
  if (key.includes('soyabean') || key.includes('groundnut')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Short-Day Crop', weeklyWaterNeedInches: 1.1, seasonalWaterNeedMm: 450, waterCategory: 'Low' };
  }
  if (key.includes('tomato') || key.includes('chili') || key.includes('potato')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Day-Neutral Crop', weeklyWaterNeedInches: 1.3, seasonalWaterNeedMm: 600, waterCategory: 'Medium' };
  }
  if (key.includes('tea') || key.includes('coffee') || key.includes('cardamom') || key.includes('blackpepper')) {
    return { sunlight: 'Partial Sun (4–6 Hours)', photoperiod: 'Short-Day Crop', weeklyWaterNeedInches: 2.0, seasonalWaterNeedMm: 1400, waterCategory: 'High' };
  }
  if (key.includes('banana') || key.includes('coconut')) {
    return { sunlight: 'Full Sun (>6 Hours)', photoperiod: 'Day-Neutral Crop', weeklyWaterNeedInches: 2.4, seasonalWaterNeedMm: 1600, waterCategory: 'High' };
  }

  return {
    sunlight: 'Full Sun (>6 Hours)',
    photoperiod: 'Day-Neutral Crop',
    weeklyWaterNeedInches: 1.2,
    seasonalWaterNeedMm: 500,
    waterCategory: 'Medium'
  };
}

function buildCrop(id: string, name: string, category: CropCategory, sci: string, family: string, sun: 'Full Sun (>6 Hours)' | 'Partial Sun (4–6 Hours)' | 'Full Shade (<2 Hours)', photo: PhotoperiodType, weeklyWater: number, seasonalWater: number): CropData {
  return {
    id,
    name,
    category,
    scientificName: sci,
    commonName: name,
    family,
    cropImage: `/crops/${id}.jpg`,
    description: `High-value ${category.toLowerCase()} crop cultivated for optimal yield and economic returns under integrated management.`,
    temperatureRange: '20°C - 32°C',
    humidityRange: '50% - 75%',
    rainfallRequirement: `${seasonalWater} mm`,
    soilType: 'Loamy to Sandy Loam',
    soilPh: '6.0 - 7.5',
    sunlight: sun,
    photoperiod: photo,
    weeklyWaterNeedInches: weeklyWater,
    seasonalWaterNeedMm: seasonalWater,
    altitude: '0 - 1200m ASL',
    suitableSeasons: ['Kharif', 'Rabi'],
    cropDuration: '110 - 140 Days',
    stages: { germination: 7, seedling: 21, vegetative: 45, flowering: 25, fruiting: 30, maturity: 15, harvest: 7 },
    irrigation: {
      waterRequirement: `${weeklyWater} inches/week`,
      irrigationFrequency: 'Every 5-7 days',
      dripRecommendation: 'Recommended at 2 LPH dripper rate.',
      criticalStages: ['Germination', 'Flowering', 'Grain/Fruit Fill']
    },
    fertilizer: {
      organic: ['FYM 15 t/ha', 'Vermicompost 5 t/ha'],
      conventional: ['NPK 120:60:60 kg/ha'],
      inm: ['75% Synthetic NPK + 25% FYM/Biofertilizer'],
      npk: '120:60:60',
      micronutrients: ['Zinc Sulphate 25 kg/ha', 'Borax 10 kg/ha'],
      organicManures: ['Neem Cake 250 kg/ha'],
      biofertilizers: ['Azospirillum 2 kg/ha', 'PSB 2 kg/ha']
    },
    companions: [
      {
        name: 'Cowpea',
        rank: 'Highly Recommended',
        compatibilityScore: 94,
        benefits: { nutrient: 'Fixes N', pestControl: 'Trap crop', pollinator: 'Attracts bees', soilHealth: 'Enriches organic matter', waterEfficiency: 'Conserves topsoil' },
        scores: { soilHealth: 95, nitrogenContribution: 94, pestReduction: 90, diseaseSuppression: 88, pollinatorAttraction: 92, waterUseEfficiency: 90 },
        explanation: 'Fixes atmospheric nitrogen and suppresses weed emergence between crop rows.'
      }
    ],
    antagonists: [
      {
        name: 'Fennel',
        riskCategory: 'Allelopathy',
        reason: 'Strong root exudates inhibit crop root elongation.',
        riskScore: 85
      }
    ],
    pests: [
      { name: 'Stem Borer / Aphids', symptoms: 'Wilting shoots and leaf curling', controlMeasures: 'Pheromone traps & Azadirachtin spray', organicControl: 'Neem oil 10,000 ppm', chemicalControl: 'Chlorantraniliprole 18.5% SC', biologicalControl: 'Trichogramma egg parasitoids' }
    ],
    diseases: [
      { name: 'Leaf Blight / Wilt', symptoms: 'Lesions on lower leaves', prevention: 'Seed treatment with Pseudomonas', treatment: 'Copper Oxychloride 50% WP', organicSolutions: 'Trichoderma viride 10g/L' }
    ],
    harvest: { indicators: ['Foliage yellowing', 'Grain/Fruit firmness'], harvestDuration: '10 - 15 Days', expectedYield: '4.5 - 6.0 t/ha', postHarvestHandling: 'Drying to <12% moisture', storageConditions: 'Cool dry warehouse' },
    market: { averageYield: '5.0 t/ha', averageMarketPrice: 2800, demandLevel: 'High', storageLife: '6 - 9 Months', exportPotential: 'High' },
    aiData: { companionRecommendation: 'Intercrop with legumes for optimal N-fixation.', weatherBasedAdvice: 'Ensure drainage during heavy rain spells.', nutrientRecommendation: 'Apply split N doses at tillering and flowering.', diseasePrediction: 'Low fungal risk under current humidity.', yieldPrediction: 'Expected yield target 5.2 t/ha.', waterManagement: 'Maintain moist soil without waterlogging.', cropRotation: 'Rotate with pulses after harvest.', sustainableFarming: 'Incorporate bio-inoculants.' }
  };
}

// 25+ MASTER CROPS REGISTRY
export const CROP_DATABASE: Record<string, CropData> = {
  rice: buildCrop('rice', 'Rice', 'Cereals', 'Oryza sativa', 'Poaceae', 'Full Sun (>6 Hours)', 'Short-Day Crop', 2.2, 1250),
  wheat: buildCrop('wheat', 'Wheat', 'Cereals', 'Triticum aestivum', 'Poaceae', 'Full Sun (>6 Hours)', 'Long-Day Crop', 1.2, 550),
  pearlmilletbajra: buildCrop('pearlmilletbajra', 'Pearl Millet (Bajra)', 'Cereals', 'Pennisetum glaucum', 'Poaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 0.9, 380),
  fingermilletragi: buildCrop('fingermilletragi', 'Finger Millet (Ragi)', 'Cereals', 'Eleusine coracana', 'Poaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 1.0, 420),
  sorghum: buildCrop('sorghum', 'Sorghum (Jowar)', 'Cereals', 'Sorghum bicolor', 'Poaceae', 'Full Sun (>6 Hours)', 'Short-Day Crop', 1.1, 450),
  maize: buildCrop('maize', 'Maize (Corn)', 'Cereals', 'Zea mays', 'Poaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 1.5, 650),
  sugarcane: buildCrop('sugarcane', 'Sugarcane', 'Sugar Crops', 'Saccharum officinarum', 'Poaceae', 'Full Sun (>6 Hours)', 'Short-Day Crop', 2.5, 1800),
  cotton: buildCrop('cotton', 'Cotton', 'Fiber Crops', 'Gossypium hirsutum', 'Malvaceae', 'Full Sun (>6 Hours)', 'Short-Day Crop', 1.8, 850),
  jute: buildCrop('jute', 'Jute', 'Fiber Crops', 'Corchorus capsularis', 'Malvaceae', 'Full Sun (>6 Hours)', 'Short-Day Crop', 1.6, 750),
  groundnut: buildCrop('groundnut', 'Groundnut (Peanut)', 'Oilseeds', 'Arachis hypogaea', 'Fabaceae', 'Full Sun (>6 Hours)', 'Short-Day Crop', 1.1, 450),
  sunflower: buildCrop('sunflower', 'Sunflower', 'Oilseeds', 'Helianthus annuus', 'Asteraceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 1.2, 500),
  soyabean: buildCrop('soyabean', 'Soyabean', 'Oilseeds', 'Glycine max', 'Fabaceae', 'Full Sun (>6 Hours)', 'Short-Day Crop', 1.1, 450),
  mustard: buildCrop('mustard', 'Mustard', 'Oilseeds', 'Brassica juncea', 'Brassicaceae', 'Full Sun (>6 Hours)', 'Long-Day Crop', 1.0, 400),
  sesamum: buildCrop('sesamum', 'Sesamum (Sesame)', 'Oilseeds', 'Sesamum indicum', 'Pedaliaceae', 'Full Sun (>6 Hours)', 'Short-Day Crop', 0.8, 350),
  tea: buildCrop('tea', 'Tea', 'Plantation Crops', 'Camellia sinensis', 'Theaceae', 'Partial Sun (4–6 Hours)', 'Short-Day Crop', 2.0, 1500),
  coffee: buildCrop('coffee', 'Coffee', 'Plantation Crops', 'Coffea arabica', 'Rubiaceae', 'Partial Sun (4–6 Hours)', 'Short-Day Crop', 1.8, 1400),
  rubber: buildCrop('rubber', 'Rubber', 'Plantation Crops', 'Hevea brasiliensis', 'Euphorbiaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 2.2, 1600),
  turmeric: buildCrop('turmeric', 'Turmeric', 'Spices', 'Curcuma longa', 'Zingiberaceae', 'Partial Sun (4–6 Hours)', 'Short-Day Crop', 1.5, 750),
  chili: buildCrop('chili', 'Chili', 'Spices', 'Capsicum annuum', 'Solanaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 1.3, 600),
  cardamom: buildCrop('cardamom', 'Cardamom', 'Spices', 'Elettaria cardamomum', 'Zingiberaceae', 'Full Shade (<2 Hours)', 'Short-Day Crop', 2.1, 1600),
  blackpepper: buildCrop('blackpepper', 'Black Pepper', 'Spices', 'Piper nigrum', 'Piperaceae', 'Partial Sun (4–6 Hours)', 'Short-Day Crop', 1.9, 1400),
  grapes: buildCrop('grapes', 'Grapes', 'Fruits', 'Vitis vinifera', 'Vitaceae', 'Full Sun (>6 Hours)', 'Long-Day Crop', 1.4, 650),
  mangoes: buildCrop('mangoes', 'Mangoes', 'Fruits', 'Mangifera indica', 'Anacardiaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 1.8, 1100),
  banana: buildCrop('banana', 'Banana', 'Fruits', 'Musa acuminata', 'Musaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 2.4, 1600),
  onion: buildCrop('onion', 'Onion', 'Vegetables', 'Allium cepa', 'Amaryllidaceae', 'Full Sun (>6 Hours)', 'Long-Day Crop', 1.0, 400),
  cashew: buildCrop('cashew', 'Cashew', 'Fruits', 'Anacardium occidentale', 'Anacardiaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 1.2, 600),
  walnuts: buildCrop('walnuts', 'Walnuts', 'Fruits', 'Juglans regia', 'Juglandaceae', 'Full Sun (>6 Hours)', 'Long-Day Crop', 1.5, 750),
  fig: buildCrop('fig', 'Fig', 'Fruits', 'Ficus carica', 'Moraceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 1.1, 500),
  tomato: buildCrop('tomato', 'Tomato', 'Vegetables', 'Solanum lycopersicum', 'Solanaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 1.3, 600),
  potato: buildCrop('potato', 'Potato', 'Vegetables', 'Solanum tuberosum', 'Solanaceae', 'Full Sun (>6 Hours)', 'Long-Day Crop', 1.2, 500),
  coconut: buildCrop('coconut', 'Coconut', 'Plantation Crops', 'Cocos nucifera', 'Arecaceae', 'Full Sun (>6 Hours)', 'Day-Neutral Crop', 2.3, 1700)
};
