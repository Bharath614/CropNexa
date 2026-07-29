/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Filter, CheckCircle2, AlertTriangle, Info, Droplet } from 'lucide-react';

export interface NutrientDetail {
  name: string;
  symbol: string;
  category: 'Macronutrient' | 'Secondary Nutrient' | 'Micronutrient';
  role: string;
  deficiencySymptoms: string;
  toxicitySymptoms: string;
  recommendedFertilizers: string;
  organicSources: string;
  recommendedDosage: string;
  bestApplicationMethod: string;
  imageBadge: string;
}

export const NUTRIENT_GUIDE_DATA: NutrientDetail[] = [
  // Macronutrients
  {
    name: 'Nitrogen',
    symbol: 'N',
    category: 'Macronutrient',
    role: 'Essential for vegetative growth, chlorophyll synthesis, protein formation, and leaf development.',
    deficiencySymptoms: 'Yellowing of older lower leaves (chlorosis), stunted growth, thin stems.',
    toxicitySymptoms: 'Excess dark green foliage, delayed flowering/fruit set, weak stems prone to lodging.',
    recommendedFertilizers: 'Urea (46% N), Ammonium Sulphate (21% N), DAP (18% N).',
    organicSources: 'Farm Yard Manure, Vermicompost, Neem Cake, Poultry Manure, Leguminous Green Manures.',
    recommendedDosage: '100 – 150 kg/ha N equivalent depending on crop stage.',
    bestApplicationMethod: 'Split basal application followed by topdressing or fertigation during vegetative peak.',
    imageBadge: '🟡 Lower Leaf Chlorosis'
  },
  {
    name: 'Phosphorus',
    symbol: 'P',
    category: 'Macronutrient',
    role: 'Critical for early root elongation, seed germination, flowering, ATP energy transfer, and cell division.',
    deficiencySymptoms: 'Purplish or reddish discoloration on underside of mature leaves, poor root systems, stunted growth.',
    toxicitySymptoms: 'Rare directly, but induces secondary Zinc and Iron micro-deficiencies.',
    recommendedFertilizers: 'Single Super Phosphate (SSP 16% P₂O₅), Triple Super Phosphate (TSP), DAP (46% P₂O₅).',
    organicSources: 'Bone Meal, Rock Phosphate, Poultry Litter, Biofertilizer PSB (Phosphate Solubilizing Bacteria).',
    recommendedDosage: '40 – 80 kg/ha P₂O₅ equivalent.',
    bestApplicationMethod: 'Basal placement at 5-10 cm soil depth near root zone prior to planting.',
    imageBadge: '🟣 Purple Leaf Under-Foliage'
  },
  {
    name: 'Potassium',
    symbol: 'K',
    category: 'Macronutrient',
    role: 'Regulates stomatal opening, drought tolerance, fruit size, disease resistance, and carbohydrate transport.',
    deficiencySymptoms: 'Marginal leaf scorch (browning/burning of leaf margins), weak stalks, spotty fruit ripening.',
    toxicitySymptoms: 'Suppresses uptake of Calcium and Magnesium leading to blossom end rot.',
    recommendedFertilizers: 'Muriate of Potash (MOP 60% K₂O), Sulphate of Potash (SOP 50% K₂O).',
    organicSources: 'Wood Ash, Compost, Banana Peel Meal, Kelp/Seaweed Extracts.',
    recommendedDosage: '50 – 100 kg/ha K₂O equivalent.',
    bestApplicationMethod: 'Basal application with half dose applied at flowering/fruit enlargement.',
    imageBadge: '🔥 Marginal Leaf Tip Scorch'
  },

  // Secondary Nutrients
  {
    name: 'Calcium',
    symbol: 'Ca',
    category: 'Secondary Nutrient',
    role: 'Forms cell wall middle lamella, drives shoot apex expansion, and stabilizes root structure.',
    deficiencySymptoms: 'Blossom end rot in fruit (tomatoes/peppers), cupped young leaves, tip burn in lettuce.',
    toxicitySymptoms: 'High soil Ca raises soil pH and reduces Magnesium and Iron bioavailability.',
    recommendedFertilizers: 'Calcium Nitrate (15.5% N, 19% Ca), Agricultural Lime, Gypsum.',
    organicSources: 'Crushed Eggshells, Bone Meal, Gypsum, Dolomitic Limestone.',
    recommendedDosage: '20 – 50 kg/ha elemental Ca.',
    bestApplicationMethod: 'Foliar spray during early fruit set or soil lime/gypsum pre-incorporation.',
    imageBadge: '🍅 Blossom End Rot'
  },
  {
    name: 'Magnesium',
    symbol: 'Mg',
    category: 'Secondary Nutrient',
    role: 'Central atom in chlorophyll molecule; activates enzyme reactions for carbohydrate translocation.',
    deficiencySymptoms: 'Interveinal chlorosis (yellowing between green leaf veins) starting on older lower leaves.',
    toxicitySymptoms: 'Imbalances Potassium levels and impairs root moisture absorption.',
    recommendedFertilizers: 'Magnesium Sulphate (Epsom Salt - 9.6% Mg), Kieserite.',
    organicSources: 'Dolomite Limestone, Compost, Wood Ash.',
    recommendedDosage: '15 – 30 kg/ha Epsom salt.',
    bestApplicationMethod: 'Foliar spray (1-2% solution) or soil incorporation during soil prep.',
    imageBadge: '🟢 Interveinal Leaf Vein Stripes'
  },
  {
    name: 'Sulphur',
    symbol: 'S',
    category: 'Secondary Nutrient',
    role: 'Essential component of methionine/cysteine amino acids, oil synthesis, and nodule formation in legumes.',
    deficiencySymptoms: 'General uniform pale yellowing starting on NEW young leaves first (unlike N).',
    toxicitySymptoms: 'Causes root zone acidification and leaf edge burn.',
    recommendedFertilizers: 'Elemental Sulphur (90% S), Single Super Phosphate (12% S), Ammonium Sulphate.',
    organicSources: 'Gypsum, Compost, Animal Manures.',
    recommendedDosage: '20 – 40 kg/ha elemental S.',
    bestApplicationMethod: 'Broadcast and soil incorporation 3 weeks prior to sowing.',
    imageBadge: '🟡 New Growth Pale Yellowing'
  },

  // Micronutrients
  {
    name: 'Zinc',
    symbol: 'Zn',
    category: 'Micronutrient',
    role: 'Synthesis of indole acetic acid (auxin growth hormone), internode expansion, and enzyme activation.',
    deficiencySymptoms: 'Little leaf disease, severely shortened internodes (rosetting), interveinal bleaching.',
    toxicitySymptoms: 'Leaf chlorosis resembling Iron deficiency.',
    recommendedFertilizers: 'Zinc Sulphate Heptahydrate (21% Zn), Chelated Zn-EDTA (12% Zn).',
    organicSources: 'Compost, Poultry Litter, Farmyard Manure.',
    recommendedDosage: '10 – 25 kg/ha Zinc Sulphate or 0.5% foliar spray.',
    bestApplicationMethod: 'Soil application at basal stage or 2 foliar sprays at 30 & 45 days after sowing.',
    imageBadge: '🍃 Rosetting & Little Leaf'
  },
  {
    name: 'Iron',
    symbol: 'Fe',
    category: 'Micronutrient',
    role: 'Electron transport catalyst in photosynthesis, respiration, and chlorophyll creation.',
    deficiencySymptoms: 'Interveinal chlorosis on youngest emerging leaves turning almost ivory white.',
    toxicitySymptoms: 'Bronzing of rice/crop leaves with tiny brown necrotic spots.',
    recommendedFertilizers: 'Ferrous Sulphate (19% Fe), Chelated Fe-EDDHA / Fe-EDTA (6-12% Fe).',
    organicSources: 'Vermicompost, Humic Acid, Well-rotted FYM.',
    recommendedDosage: '5 – 10 kg/ha Fe-EDTA or 0.5% foliar spray.',
    bestApplicationMethod: 'Foliar spray during early morning hours to prevent leaf scorching.',
    imageBadge: '⚪ Ivory Emerging Leaves'
  },
  {
    name: 'Boron',
    symbol: 'B',
    category: 'Micronutrient',
    role: 'Cell wall cross-linking, pollen tube growth, seed fertilization, and sugar translocation.',
    deficiencySymptoms: 'Hollow heart in root crops/cabbage, poor fruit set, brittle growing tips, fruit cracking.',
    toxicitySymptoms: 'Leaf margin yellowing followed by rapid tip necrosis and leaf dropping.',
    recommendedFertilizers: 'Borax (10.5% B), Solubor (20% B).',
    organicSources: 'Compost, Wood Ash, Organic Matter Mulches.',
    recommendedDosage: '5 – 10 kg/ha Borax or 0.2% foliar spray at pre-flowering.',
    bestApplicationMethod: 'Foliar spray at pre-flowering stage for maximum pollination.',
    imageBadge: '🕳️ Hollow Stem & Fruit Crack'
  },
  {
    name: 'Copper',
    symbol: 'Cu',
    category: 'Micronutrient',
    role: 'Lignin synthesis for cell structural strength, grain formation, and photosynthesis reduction.',
    deficiencySymptoms: 'Wilting young leaves, dieback of terminal shoots, bluish-green leaf discoloration.',
    toxicitySymptoms: 'Restricted root growth and iron deficiency symptoms.',
    recommendedFertilizers: 'Copper Sulphate (25% Cu), Cu-EDTA.',
    organicSources: 'Farmyard Manure, Bio-compost.',
    recommendedDosage: '2.5 – 5 kg/ha Copper Sulphate.',
    bestApplicationMethod: 'Basal soil incorporation or 0.1% foliar spray.',
    imageBadge: '🌱 Terminal Shoot Dieback'
  },
  {
    name: 'Manganese',
    symbol: 'Mn',
    category: 'Micronutrient',
    role: 'Drives water-splitting reaction (photolysis) in photosynthesis and nitrogen assimilation.',
    deficiencySymptoms: 'Interveinal chlorosis on middle leaves with small necrotic spots (grey speck in oats).',
    toxicitySymptoms: 'Crinkle leaf in cotton/legumes with dark brown spots on leaves.',
    recommendedFertilizers: 'Manganese Sulphate (30% Mn), Mn-EDTA.',
    organicSources: 'Compost, Farmyard Manure.',
    recommendedDosage: '5 – 10 kg/ha Manganese Sulphate.',
    bestApplicationMethod: 'Foliar application at early vegetative stage.',
    imageBadge: '🩶 Grey Spotting & Chlorosis'
  },
  {
    name: 'Molybdenum',
    symbol: 'Mo',
    category: 'Micronutrient',
    role: 'Constituent of nitrate reductase enzyme; essential for nitrogen fixation in legumes.',
    deficiencySymptoms: 'Whiptail in cauliflower/brassicas (narrow cupped leaves), nitrogen deficiency symptoms.',
    toxicitySymptoms: 'Bright yellow/orange leaves; golden foliage color in tomatoes.',
    recommendedFertilizers: 'Sodium Molybdate (39% Mo), Ammonium Molybdate (54% Mo).',
    organicSources: 'Compost, Wood Ash, Lime application.',
    recommendedDosage: '0.5 – 1 kg/ha Sodium Molybdate.',
    bestApplicationMethod: 'Seed treatment or foliar spray at seedling stage.',
    imageBadge: '🥬 Whiptail Leaf Distortion'
  }
];

interface NutrientGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NutrientGuideModal: React.FC<NutrientGuideModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Macronutrient' | 'Secondary Nutrient' | 'Micronutrient'>('All');
  const [activeNutrientName, setActiveNutrientName] = useState<string>('Nitrogen');

  if (!isOpen) return null;

  const filteredNutrients = NUTRIENT_GUIDE_DATA.filter(n => {
    if (selectedCategory === 'All') return true;
    return n.category === selectedCategory;
  });

  const activeNutrient = NUTRIENT_GUIDE_DATA.find(n => n.name === activeNutrientName) || NUTRIENT_GUIDE_DATA[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-900/60 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950/80 border-b border-emerald-950/80 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950 text-emerald-400 p-2.5 rounded-2xl border border-emerald-800">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                CropNexa Plant Nutrient Field Encyclopedia
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-400">Complete 12-Nutrient Diagnostic Guide: Functions, Deficiency, Toxicity, Dosage & Sources.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors focus:outline-none cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="bg-slate-950/40 border-b border-slate-900 px-6 py-3 flex items-center gap-3 overflow-x-auto">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold shrink-0">Filter Category:</span>
          {(['All', 'Macronutrient', 'Secondary Nutrient', 'Micronutrient'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                text-[10px] px-3.5 py-1.5 rounded-full font-extrabold uppercase tracking-wider border shrink-0 transition-colors cursor-pointer
                ${selectedCategory === cat 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800 shadow-sm' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Body Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 custom-scrollbar">
          {/* Left Nutrient List (1 Column) */}
          <div className="space-y-2.5">
            {filteredNutrients.map(nut => {
              const isSelected = nut.name === activeNutrient.name;
              return (
                <div
                  key={nut.name}
                  onClick={() => setActiveNutrientName(nut.name)}
                  className={`
                    p-3.5 border rounded-2xl cursor-pointer transition-all duration-150 flex items-center justify-between
                    ${isSelected 
                      ? 'bg-emerald-950/80 border-emerald-500 text-slate-100 shadow-md ring-1 ring-emerald-500/30' 
                      : 'bg-slate-950/40 border-slate-900 hover:bg-slate-900/60 text-slate-400'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-extrabold text-xs border ${isSelected ? 'bg-emerald-900 text-emerald-300 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                      {nut.symbol}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{nut.name}</h4>
                      <span className="text-[9px] text-slate-500 font-semibold">{nut.category}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
                    {nut.imageBadge.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Nutrient Detail Panel (2 Columns) */}
          <div className="lg:col-span-2 bg-slate-950/60 border border-slate-900 rounded-3xl p-6 space-y-5">
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-widest">{activeNutrient.category}</span>
                <h3 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  {activeNutrient.name} ({activeNutrient.symbol})
                </h3>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-900/50 px-3 py-1 rounded-full text-emerald-400 text-xs font-extrabold">
                {activeNutrient.imageBadge}
              </div>
            </div>

            {/* Role in Plant Growth */}
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Role in Plant Growth</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">{activeNutrient.role}</p>
            </div>

            {/* Symptoms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-950/15 border border-rose-900/30 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Deficiency Symptoms
                </span>
                <p className="text-xs text-rose-200 leading-relaxed">{activeNutrient.deficiencySymptoms}</p>
              </div>

              <div className="bg-purple-950/15 border border-purple-900/30 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> Toxicity Symptoms
                </span>
                <p className="text-xs text-purple-200 leading-relaxed">{activeNutrient.toxicitySymptoms}</p>
              </div>
            </div>

            {/* Fertilizer & Organic Sources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Recommended Chemical Fertilizers</span>
                <p className="text-xs text-slate-300">{activeNutrient.recommendedFertilizers}</p>
              </div>

              <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Organic & Biological Sources</span>
                <p className="text-xs text-slate-300">{activeNutrient.organicSources}</p>
              </div>
            </div>

            {/* Dosage & Application Method */}
            <div className="bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-900/40 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Recommended Dosage:</span>
                <span className="text-emerald-400 font-extrabold">{activeNutrient.recommendedDosage}</span>
              </div>
              <div className="border-t border-slate-900 pt-2 text-xs">
                <span className="text-slate-400 font-bold block mb-0.5">Best Application Method:</span>
                <span className="text-slate-200">{activeNutrient.bestApplicationMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NutrientGuideModal;
