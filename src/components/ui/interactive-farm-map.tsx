'use client';

import React, { useState } from 'react';
import { useFarm } from '@/context/farm-context';
import { Sprout, Droplet, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface Plot {
  id: number;
  name: string;
  crop: string;
  companion: string;
  status: 'Healthy' | 'Needs Water' | 'Pest Alert' | 'Fallow';
  progress: number; // 0-100
  moisture: number; // 0-100
  soilHealth: number; // 0-100
}

export const InteractiveFarmMap: React.FC = () => {
  const { profile } = useFarm();
  const [selectedPlot, setSelectedPlot] = useState<number>(1);

  // Seed mock plots matching profile values
  const plots: Plot[] = [
    {
      id: 1,
      name: 'North Grid (Sector A)',
      crop: profile.currentCrop,
      companion: 'Basil, Marigold',
      status: 'Healthy',
      progress: 45,
      moisture: 78,
      soilHealth: 78
    },
    {
      id: 2,
      name: 'River Basin (Sector B)',
      crop: 'Wheat',
      companion: 'White Lupin',
      status: 'Healthy',
      progress: 90,
      moisture: 60,
      soilHealth: 88
    },
    {
      id: 3,
      name: 'Hillside (Sector C)',
      crop: 'Maize',
      companion: 'Beans, Squash',
      status: 'Pest Alert',
      progress: 65,
      moisture: 45,
      soilHealth: 68
    },
    {
      id: 4,
      name: 'South Flatlands (Sector D)',
      crop: 'Fallow (Prep stage)',
      companion: 'Green Gram (Relay)',
      status: 'Needs Water',
      progress: 10,
      moisture: 25,
      soilHealth: 72
    }
  ];

  const activePlot = plots.find(p => p.id === selectedPlot) || plots[0];

  const getStatusColor = (status: Plot['status']) => {
    switch (status) {
      case 'Healthy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Needs Water': return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'Pest Alert': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default: return 'bg-slate-700/20 text-slate-400 border-slate-600/40';
    }
  };

  const getSVGColor = (plotId: number, status: Plot['status']) => {
    const isSelected = selectedPlot === plotId;
    if (isSelected) {
      switch (status) {
        case 'Healthy': return 'fill-emerald-800/80 stroke-emerald-400';
        case 'Needs Water': return 'fill-sky-850/80 stroke-sky-400';
        case 'Pest Alert': return 'fill-rose-850/80 stroke-rose-400';
        default: return 'fill-slate-800 stroke-slate-400';
      }
    } else {
      switch (status) {
        case 'Healthy': return 'fill-emerald-950/40 stroke-emerald-900/60 hover:fill-emerald-900/40';
        case 'Needs Water': return 'fill-sky-950/40 stroke-sky-900/60 hover:fill-sky-900/40';
        case 'Pest Alert': return 'fill-rose-950/40 stroke-rose-900/60 hover:fill-rose-900/40';
        default: return 'fill-slate-900/40 stroke-slate-800/60 hover:fill-slate-800/40';
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
      {/* SVG Interactive Farm Grid - Left Column */}
      <div className="md:col-span-3 bg-slate-900/40 border border-emerald-950/40 rounded-2xl p-4 shadow-inner">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          Interactive Plot Layout Map
        </h4>
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-900 p-2">
          <svg viewBox="0 0 400 240" className="w-full h-full cursor-pointer select-none">
            {/* Field boundary grid lines */}
            <line x1="0" y1="120" x2="400" y2="120" stroke="#052e16" strokeDasharray="3,3" strokeWidth="1" />
            <line x1="200" y1="0" x2="200" y2="240" stroke="#052e16" strokeDasharray="3,3" strokeWidth="1" />
            
            {/* Plot 1: Top Left */}
            <rect 
              x="15" y="15" width="170" height="95" rx="8"
              className={`transition-all duration-300 stroke-2 ${getSVGColor(1, plots[0].status)}`}
              onClick={() => setSelectedPlot(1)}
            />
            <text x="30" y="45" className="fill-slate-300 font-bold text-[10px]">P1: {plots[0].crop}</text>
            <text x="30" y="60" className="fill-emerald-400 text-[8px]">Comp: {plots[0].companion}</text>

            {/* Plot 2: Top Right */}
            <rect 
              x="215" y="15" width="170" height="95" rx="8"
              className={`transition-all duration-300 stroke-2 ${getSVGColor(2, plots[1].status)}`}
              onClick={() => setSelectedPlot(2)}
            />
            <text x="230" y="45" className="fill-slate-300 font-bold text-[10px]">P2: {plots[1].crop}</text>
            <text x="230" y="60" className="fill-emerald-400 text-[8px]">Comp: {plots[1].companion}</text>

            {/* Plot 3: Bottom Left */}
            <rect 
              x="15" y="130" width="170" height="95" rx="8"
              className={`transition-all duration-300 stroke-2 ${getSVGColor(3, plots[2].status)}`}
              onClick={() => setSelectedPlot(3)}
            />
            <text x="30" y="160" className="fill-slate-300 font-bold text-[10px]">P3: {plots[2].crop}</text>
            <text x="30" y="175" className="fill-emerald-400 text-[8px]">Comp: {plots[2].companion}</text>

            {/* Plot 4: Bottom Right */}
            <rect 
              x="215" y="130" width="170" height="95" rx="8"
              className={`transition-all duration-300 stroke-2 ${getSVGColor(4, plots[3].status)}`}
              onClick={() => setSelectedPlot(4)}
            />
            <text x="230" y="160" className="fill-slate-300 font-bold text-[10px]">P4: {plots[3].crop}</text>
            <text x="230" y="175" className="fill-emerald-400 text-[8px]">Comp: {plots[3].companion}</text>
          </svg>
          
          {/* Map Legend */}
          <div className="absolute bottom-2 right-2 flex items-center gap-3 bg-slate-900/90 border border-emerald-950/60 px-3 py-1.5 rounded-lg text-[8px] text-slate-400">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Healthy</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-500"></span> Needs Water</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Pest Alert</span>
          </div>
        </div>
      </div>

      {/* Selected Plot Detail Card - Right Column */}
      <div className="md:col-span-2 bg-gradient-to-b from-slate-800/80 to-slate-900 border border-emerald-950/50 rounded-2xl p-5 shadow-lg h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-100 text-sm">{activePlot.name}</h3>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold ${getStatusColor(activePlot.status)}`}>
              {activePlot.status}
            </span>
          </div>

          <div className="space-y-4">
            {/* Crop Details */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-emerald-950 text-emerald-400 rounded-lg flex items-center justify-center border border-emerald-900/60">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Main Crop</p>
                <h4 className="text-sm font-bold text-slate-200">{activePlot.crop}</h4>
              </div>
            </div>

            {/* Companion Details */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-teal-950 text-teal-400 rounded-lg flex items-center justify-center border border-teal-900/60">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Companions Planted</p>
                <h4 className="text-sm font-bold text-emerald-300">{activePlot.companion}</h4>
              </div>
            </div>

            {/* Growth Progress Bar */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">Growth Progress</span>
                <span className="text-slate-200 font-semibold">{activePlot.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                  style={{ width: `${activePlot.progress}%` }}
                />
              </div>
            </div>

            {/* Health Indicators */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 text-sky-400 text-xs font-semibold mb-1">
                  <Droplet className="h-3.5 w-3.5" />
                  <span>{activePlot.moisture}%</span>
                </div>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Moisture</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{activePlot.soilHealth}/100</span>
                </div>
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Soil Index</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Warning Notice */}
        {activePlot.status === 'Pest Alert' && (
          <div className="mt-4 bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl flex items-start gap-2 text-rose-300">
            <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400 animate-bounce" />
            <div className="text-[10px]">
              <span className="font-bold uppercase tracking-wider block">Pest Risk Identified</span>
              <span>Common pest vectors detected in neighboring plots. Monitor companion traps immediately.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default InteractiveFarmMap;
