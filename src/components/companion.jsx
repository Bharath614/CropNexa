'use client';
import React, { useState } from 'react';
import { useFarm } from '@/context/farm-context';
import { MASTER_CROPS, getEngineRecommendations, getEngineNutrientGuidance } from '@/utils/companion-engine';
import { Check, AlertTriangle, ChevronDown } from 'lucide-react';
export const Companion = () => {
    const { profile, soilReport, showToast } = useFarm();
    // Engine State Inputs
    const [targetCrop, setTargetCrop] = useState(profile.currentCrop || 'Maize');
    const [growthStage, setGrowthStage] = useState(profile.currentStage || 'Growth');
    const [farmingMode, setFarmingMode] = useState(profile.farmingPractice || 'Integrated');
    const [landAreaHa, setLandAreaHa] = useState(profile.totalLandArea || 1.0);
    const [useSoilTestOverride, setUseSoilTestOverride] = useState(true);
    const [addedCompanions, setAddedCompanions] = useState([]);
    const [activeMainTab, setActiveMainTab] = useState('Recommendations');
    // Query Relational Recommendation Engine!
    const recs = getEngineRecommendations(targetCrop, growthStage, farmingMode, landAreaHa);
    // Query Nutrient Engine!
    const nutrients = getEngineNutrientGuidance(targetCrop, farmingMode, useSoilTestOverride ? soilReport : undefined);
    // Helper for crop emojis
    const getCropEmoji = (name) => {
        const n = name.toLowerCase();
        if (n.includes('cowpea') || n.includes('bean') || n.includes('gram') || n.includes('lupin') || n.includes('pea'))
            return '🫘';
        if (n.includes('sunflower'))
            return '🌻';
        if (n.includes('marigold'))
            return '🌼';
        if (n.includes('sesame') || n.includes('mustard') || n.includes('wheat') || n.includes('sorghum') || n.includes('azolla'))
            return '🌾';
        if (n.includes('onion') || n.includes('garlic'))
            return '🧅';
        if (n.includes('cucumber') || n.includes('squash') || n.includes('nasturtium'))
            return '🥒';
        if (n.includes('basil') || n.includes('thyme') || n.includes('clover') || n.includes('grass'))
            return '🌿';
        if (n.includes('carrot') || n.includes('radish'))
            return '🥕';
        if (n.includes('turmeric') || n.includes('pepper') || n.includes('chili'))
            return '🌶️';
        return '🌱';
    };
    // Popular quick-select crops
    const popularCrops = ['Maize', 'Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Tomato', 'Potato', 'Coconut', 'Banana', 'Groundnut', 'Soyabean', 'Turmeric'];
    const handleAddCompanion = (name) => {
        if (addedCompanions.includes(name)) {
            setAddedCompanions(prev => prev.filter(c => c !== name));
            showToast(`Removed ${name} from companion plan.`, 'info');
        }
        else {
            setAddedCompanions(prev => [...prev, name]);
            showToast(`Added ${name} to companion plan for ${targetCrop}!`, 'success');
        }
    };
    return (<div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16 text-slate-200">
      
      {/* 1. HEADER & CROP SELECTOR BAR (Image 4 Design) */}
      <div className="bg-[#111625]/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Companion Planner</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Recommended companion pairings for <span className="text-emerald-400 font-extrabold">{targetCrop}</span>
            </p>
          </div>

          {/* Target Crop Selector Dropdown */}
          <div className="relative">
            <select value={targetCrop} onChange={(e) => setTargetCrop(e.target.value)} className="appearance-none bg-slate-950 border border-emerald-950 text-emerald-400 font-bold text-xs rounded-2xl px-4 py-3 pr-9 focus:outline-none focus:border-emerald-500 shadow-inner cursor-pointer">
              {MASTER_CROPS.map(crop => (<option key={crop.id} value={crop.name}>Target Crop: {crop.name}</option>))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-emerald-500 pointer-events-none"/>
          </div>
        </div>

        {/* Quick Select Crop Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-slate-800/80 pt-3">
          <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">Quick Switch:</span>
          {popularCrops.map(c => (<button key={c} onClick={() => setTargetCrop(c)} className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${targetCrop === c
                ? 'bg-emerald-900 text-white border border-emerald-700 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'}`}>
              {c}
            </button>))}
        </div>

        {/* Engine Input Controls Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Growth Stage</label>
            <select value={growthStage} onChange={(e) => setGrowthStage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-bold text-slate-300 focus:outline-none">
              <option value="Germination">1. Germination</option>
              <option value="Growth">2. Growth / Maturation</option>
              <option value="Harvesting">3. Harvesting</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mode of Practice</label>
            <select value={farmingMode} onChange={(e) => setFarmingMode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-bold text-slate-300 focus:outline-none">
              <option value="Conventional">Conventional</option>
              <option value="Organic">Organic</option>
              <option value="Integrated">Integrated (INM)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Land Area (Ha)</label>
            <input type="number" step="0.5" value={landAreaHa} onChange={(e) => setLandAreaHa(parseFloat(e.target.value) || 1.0)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-bold text-slate-300 focus:outline-none"/>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Soil Report Override</label>
            <button onClick={() => setUseSoilTestOverride(!useSoilTestOverride)} className={`w-full p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${useSoilTestOverride
            ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
            : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              {useSoilTestOverride ? 'Soil Report Active ✓' : 'Use Default NPK'}
            </button>
          </div>
        </div>

        {/* Main View Tabs */}
        <div className="flex gap-2 text-xs pt-1">
          <button onClick={() => setActiveMainTab('Recommendations')} className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${activeMainTab === 'Recommendations'
            ? 'bg-emerald-900 text-white border border-emerald-700 shadow-md'
            : 'bg-slate-950 text-slate-400 hover:bg-slate-900 border border-slate-800'}`}>
            Companion Recommendations ({recs.companions.length})
          </button>
          <button onClick={() => setActiveMainTab('Nutrients')} className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${activeMainTab === 'Nutrients'
            ? 'bg-emerald-900 text-white border border-emerald-700 shadow-md'
            : 'bg-slate-950 text-slate-400 hover:bg-slate-900 border border-slate-800'}`}>
            Nutrient Protocol
          </button>
        </div>
      </div>

      {/* 2. ENGINE RECOMMENDATIONS VIEW */}
      {activeMainTab === 'Recommendations' && (<div className="space-y-6 animate-fadeIn">
          {/* RULE 5: Large Plot Monocropping Advisory Banner */}
          {recs.isMonocropAdvisory ? (<div className="bg-amber-950/40 border border-amber-800/80 p-5 rounded-3xl space-y-3 text-xs shadow-xl">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0"/>
                Large Commercial Plot Monocropping Advisory ({landAreaHa} Hectares)
              </div>
              <p className="text-amber-200/90 leading-relaxed text-[11px]">
                Because your plot area exceeds 10 hectares, dense multi-crop companion suggestions are suppressed to avoid machinery interference. Instead, focus on <strong>structured crop rotation</strong> and <strong>border trap cropping</strong>.
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-900/60 space-y-2">
                <strong className="text-xs text-amber-300 font-bold block">Recommended Rotation Schedule:</strong>
                <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1">
                  {recs.rotationAdvice.map((adv, idx) => (<li key={idx}>{adv}</li>))}
                </ul>
              </div>
            </div>) : (
            /* Good Companion Recommendations Cards (Image 4 Design) */
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2">
                  <Check className="h-4.5 w-4.5 text-emerald-400"/>
                  Recommended Companions for <span className="text-emerald-400 font-extrabold">{targetCrop}</span> ({recs.companions.length})
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Filtered by {growthStage} stage</span>
              </div>

              {recs.companions.map((comp, idx) => {
                    const isAdded = addedCompanions.includes(comp.cropName);
                    return (<div key={idx} className="bg-[#111625]/90 border border-slate-800/80 rounded-3xl p-5 shadow-xl hover:border-emerald-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Left Icon in Soft Background */}
                      <div className="h-14 w-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                        {getCropEmoji(comp.cropName)}
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-white">{comp.cropName}</h4>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${comp.confidence === 'High'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
                            {comp.confidence === 'High' ? 'Excellent' : 'Good'}
                          </span>
                          <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                            {comp.mechanismTag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          {comp.mechanism}
                        </p>
                        <span className="text-[10px] text-slate-500 block italic">Source: {comp.source}</span>
                      </div>
                    </div>

                    <button onClick={() => handleAddCompanion(comp.cropName)} className={`px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer shrink-0 self-end sm:self-center ${isAdded
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'bg-emerald-900 hover:bg-emerald-800 text-white border border-emerald-700'}`}>
                      {isAdded ? 'Added ✓' : 'Add'}
                    </button>
                  </div>);
                })}
            </div>)}

          {/* Prohibited Antagonistic Crops to Avoid Card */}
          <div className="bg-rose-950/40 border border-rose-900/60 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-rose-900/60 pb-3">
              <h3 className="text-base font-extrabold text-rose-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-400"/>
                Crops to Avoid with {targetCrop} ({recs.avoids.length})
              </h3>
              <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2.5 py-0.5 rounded-full font-bold uppercase">
                Prohibited Pairs
              </span>
            </div>

            <div className="space-y-3">
              {recs.avoids.length > 0 ? recs.avoids.map((ant, idx) => (<div key={idx} className="bg-slate-950/80 border border-rose-950 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-slate-100">{ant.cropName}</strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800">
                      {ant.confidence} Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{ant.reason}</p>
                </div>)) : (<p className="text-xs text-slate-500 italic">No antagonistic pairings documented for {targetCrop}.</p>)}
            </div>
          </div>
        </div>)}

      {/* 3. NUTRIENT GUIDANCE VIEW */}
      {activeMainTab === 'Nutrients' && (<div className="bg-[#111625]/90 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white">Nutrient Protocol Engine for {targetCrop}</h3>
              <p className="text-xs text-slate-400">Mode of Practice: <span className="text-emerald-400 font-bold">{farmingMode}</span></p>
            </div>
            {nutrients.isSoilReportOverridden && (<span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                Soil Report Active ✓
              </span>)}
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 text-xs space-y-1">
            <strong className="text-slate-400 font-bold block">NPK Protocol Summary:</strong>
            <p className="text-emerald-400 font-extrabold text-sm">{nutrients.npkSummary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
              <strong className="text-slate-200 font-bold block">Basal Dosing Application</strong>
              <ul className="list-disc pl-4 text-slate-400 space-y-1">
                {nutrients.details.basalDose.map((item, idx) => (<li key={idx}>{item}</li>))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
              <strong className="text-slate-200 font-bold block">Bio-Fertilizer Inoculants</strong>
              <ul className="list-disc pl-4 text-slate-400 space-y-1">
                {nutrients.details.biofertilizers.map((item, idx) => (<li key={idx}>{item}</li>))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
              <strong className="text-slate-200 font-bold block">Micronutrients & Bio-Stimulants</strong>
              <ul className="list-disc pl-4 text-slate-400 space-y-1">
                {nutrients.details.foliarMicronutrients.map((item, idx) => (<li key={idx}>{item}</li>))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
              <strong className="text-slate-200 font-bold block">Phenophase Split Schedule</strong>
              <ul className="list-disc pl-4 text-slate-400 space-y-1">
                {nutrients.details.stageSplits.map((item, idx) => (<li key={idx}>{item}</li>))}
              </ul>
            </div>
          </div>
        </div>)}
    </div>);
};
export default Companion;
