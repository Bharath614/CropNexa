'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MASTER_CROPS, getEngineRecommendations } from '@/utils/companion-engine';
import { ArrowLeft, Star, CheckCircle2, AlertTriangle, Droplet, Sun, Thermometer, Cloud, ChevronRight, Search } from 'lucide-react';
export const Crops = () => {
    const { t } = useTranslation();
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = [
        'All', 'cereal', 'millet', 'oilseed', 'fiber', 'sugar',
        'vegetable', 'fruit', 'plantation', 'spice'
    ];
    const filteredCrops = MASTER_CROPS.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
        return matchesSearch && matchesCat;
    });
    // Helper for crop emojis
    const getCropEmoji = (name) => {
        const n = name.toLowerCase();
        if (n.includes('rice') || n.includes('wheat') || n.includes('millet') || n.includes('sesamum'))
            return '🌾';
        if (n.includes('maize') || n.includes('corn'))
            return '🌽';
        if (n.includes('sugarcane'))
            return '🎋';
        if (n.includes('cotton'))
            return '🌸';
        if (n.includes('groundnut'))
            return '🥜';
        if (n.includes('sunflower'))
            return '🌻';
        if (n.includes('soyabean'))
            return '🫘';
        if (n.includes('tomato'))
            return '🍅';
        if (n.includes('potato'))
            return '🥔';
        if (n.includes('chili') || n.includes('pepper'))
            return '🌶️';
        if (n.includes('onion'))
            return '🧅';
        if (n.includes('banana'))
            return '🍌';
        if (n.includes('mango'))
            return '🥭';
        if (n.includes('coconut'))
            return '🥥';
        if (n.includes('grapes'))
            return '🍇';
        if (n.includes('fig'))
            return '🫐';
        return '🌿';
    };
    // Detailed View
    if (selectedCrop) {
        const engineRes = getEngineRecommendations(selectedCrop.name, 'Growth', 'Integrated', 1.0);
        const companions = engineRes.companions.slice(0, 4);
        const avoids = engineRes.avoids.slice(0, 3);
        return (<div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16 text-slate-200">
        {/* Top Hero Banner */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <img src={`/crops/${selectedCrop.id}.jpg`} alt={selectedCrop.name} className="w-full h-full object-cover" onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=1200&q=80';
            }}/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30"/>
          
          <button onClick={() => setSelectedCrop(null)} className="absolute top-4 left-4 h-10 w-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-800 shadow-md transition-all cursor-pointer">
            <ArrowLeft className="h-5 w-5"/>
          </button>

          <span className="absolute top-4 right-4 bg-emerald-600/90 border border-emerald-400/40 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-lg backdrop-blur-md">
            Recommended Now
          </span>

          <div className="absolute bottom-6 left-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight">{selectedCrop.name}</h1>
              <span className="text-xs font-bold uppercase bg-emerald-950 border border-emerald-800 text-emerald-400 px-3 py-0.5 rounded-full">
                {selectedCrop.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 italic">Daylength: {selectedCrop.daylength_sensitivity} • Light: {selectedCrop.light_requirement.toUpperCase()}</p>
            <div className="flex items-center gap-1 text-amber-400 text-xs pt-1">
              <Star className="h-4 w-4 fill-amber-400"/>
              <Star className="h-4 w-4 fill-amber-400"/>
              <Star className="h-4 w-4 fill-amber-400"/>
              <Star className="h-4 w-4 fill-amber-400"/>
              <Star className="h-4 w-4 fill-amber-400 text-slate-600"/>
              <span className="text-slate-200 ml-1 font-bold">(4.5 Score)</span>
            </div>
          </div>
        </div>

        {/* Companion Plants Card */}
        <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
            <h3 className="text-sm font-extrabold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400"/>
              Research-Backed Companion Crops
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold uppercase">Mechanism Verified</span>
          </div>

          <div className="space-y-3">
            {companions.length > 0 ? companions.map((comp, idx) => (<div key={idx} className="bg-slate-950/80 border border-emerald-950 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-100 font-bold">{comp.cropName}</strong>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {comp.confidence} Confidence
                    </span>
                  </div>
                  <span className="text-[9px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full font-bold">
                    {comp.source}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400 block text-[10px] uppercase font-bold">Mechanism ({comp.mechanismTag}):</strong>
                  {comp.mechanism}
                </p>
              </div>)) : (<p className="text-xs text-slate-500 italic">No specific companion pairings documented.</p>)}
          </div>
        </div>

        {/* Plants to Avoid Card */}
        <div className="bg-rose-950/40 border border-rose-900/60 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-rose-900/60 pb-3">
            <h3 className="text-sm font-extrabold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400"/>
              Prohibited Antagonists (Avoid Table)
            </h3>
            <span className="text-[10px] text-rose-500 font-bold uppercase">Strict Safety Filter</span>
          </div>

          <div className="space-y-3">
            {avoids.length > 0 ? avoids.map((ant, idx) => (<div key={idx} className="bg-slate-950/80 border border-rose-950 p-4 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-slate-100">{ant.cropName}</strong>
                  <span className="text-[9px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full font-bold">
                    {ant.confidence} Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{ant.reason}</p>
              </div>)) : (<p className="text-xs text-slate-500 italic">No antagonistic pairings documented.</p>)}
          </div>
        </div>

        {/* Environmental Requirements */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">Environmental Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <Droplet className="h-5 w-5 text-sky-400 shrink-0"/>
              <div>
                <strong className="text-slate-300 font-bold block">Soil Type</strong>
                <span className="text-slate-400">Loamy, well-drained, pH 6.0-6.8</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <Droplet className="h-5 w-5 text-teal-400 shrink-0"/>
              <div>
                <strong className="text-slate-300 font-bold block">Water Requirement</strong>
                <span className="text-teal-300 font-bold">{selectedCrop.water_requirement}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <Sun className="h-5 w-5 text-amber-400 shrink-0"/>
              <div>
                <strong className="text-slate-300 font-bold block">Sunlight</strong>
                <span className="text-amber-300 font-bold">{selectedCrop.light_requirement.toUpperCase()} SUN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Climate Conditions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider">Climate Conditions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <Cloud className="h-5 w-5 text-slate-400 mb-1"/>
              <strong className="text-slate-300 font-bold block">Season</strong>
              <span className="text-slate-400">{selectedCrop.suitableSeasons.join(', ')}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <Thermometer className="h-5 w-5 text-rose-400 mb-1"/>
              <strong className="text-slate-300 font-bold block">Temperature</strong>
              <span className="text-rose-300 font-bold">21-29°C</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <Droplet className="h-5 w-5 text-sky-400 mb-1"/>
              <strong className="text-slate-300 font-bold block">Rainfall</strong>
              <span className="text-sky-300 font-bold">Moderate 500-750mm</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <Sun className="h-5 w-5 text-amber-400 mb-1"/>
              <strong className="text-slate-300 font-bold block">Photoperiod</strong>
              <span className="text-amber-300 font-bold">{selectedCrop.daylength_sensitivity}</span>
            </div>
          </div>
        </div>
      </div>);
    }
    // Dashboard Grid View
    return (<div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-16 text-slate-200">
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Crops Explorer & Matrix</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Select from 25 master agricultural crops to inspect growth parameters & intercropping compatibility.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500"/>
            <input type="text" placeholder="Search 25 master crops..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"/>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-slate-800/80 pt-3">
          {categories.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer text-[10px] ${selectedCategory === cat
                ? 'bg-emerald-900 text-emerald-200 border border-emerald-700 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-900 border border-slate-800'}`}>
              {cat}
            </button>))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.map((crop) => (<div key={crop.id} onClick={() => setSelectedCrop(crop)} className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-5 shadow-xl transition-all cursor-pointer space-y-4 group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {getCropEmoji(crop.name)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">{crop.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{crop.category}</span>
                </div>
              </div>

              <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-900">
              <div>
                <span className="block text-slate-500 font-semibold">Water Need:</span>
                <strong className="text-teal-300">{crop.water_requirement}</strong>
              </div>
              <div>
                <span className="block text-slate-500 font-semibold">Sunlight:</span>
                <strong className="text-amber-300">{crop.light_requirement.toUpperCase()}</strong>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/80">
              <span className="text-emerald-400 font-bold text-[11px] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore Crop Matrix <ChevronRight className="h-3.5 w-3.5"/>
              </span>
            </div>
          </div>))}
      </div>
    </div>);
};
export default Crops;
