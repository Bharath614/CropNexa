'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import { ClipboardList, Sparkles, Scale, Info, Layers, CheckCircle2 } from 'lucide-react';
export const Nutrient = () => {
    const { profile, updateProfile } = useFarm();
    const { t } = useTranslation();
    const [activePracticeTab, setActivePracticeTab] = useState(profile.farmingPractice);
    const landArea = profile.totalLandArea; // in hectares
    // Helper to convert kg/ha rate to total kg needed for current land area
    const getWeightRequired = (kgPerHaRate) => {
        return (kgPerHaRate * landArea).toFixed(1);
    };
    return (<div className="space-y-6 animate-fadeIn">
      {/* Practice Selector Banner */}
      <div className="bg-slate-900/40 border border-emerald-950/30 p-6 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-emerald-400"/>
            Nutrient Management Advisory Panel
          </h2>
          <p className="text-xs text-slate-400">Dosage recommendations and application split calendars customized for your farm area.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-900 shrink-0">
          {['Organic Farming', 'Integrated Nutrient Management (INM)', 'Conventional Farming'].map((tab) => (<button key={tab} onClick={() => {
                setActivePracticeTab(tab);
                updateProfile({ farmingPractice: tab }); // Sync to profile context
            }} className={`
                text-[10px] px-3.5 py-2 rounded-xl font-extrabold tracking-wide uppercase transition-all duration-200
                ${activePracticeTab === tab
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 shadow-md'
                : 'text-slate-500 hover:text-slate-350'}
              `}>
              {tab.replace(' Farming', '').replace('Management ', '')}
            </button>))}
        </div>
      </div>

      {/* Info Widget */}
      <div className="bg-slate-900/60 border border-emerald-950/40 p-4 rounded-3xl flex items-center gap-3">
        <Scale className="h-5 w-5 text-emerald-400 shrink-0 animate-pulse"/>
        <span className="text-xs text-slate-400 leading-normal">
          Calculations are adjusted for a land area of <strong className="text-slate-200">{landArea} Hectares</strong>. You can update this size in the <strong>{t('settings')}</strong> tab.
        </span>
      </div>

      {/* Mode View Panels */}
      {activePracticeTab === 'Conventional Farming' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Dosage Schedule */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-400"/>
              NPK Split Application Schedule
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-900">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-900">
                  <tr>
                    <th className="p-3">Application Stage</th>
                    <th className="p-3">Nitrogen (N)</th>
                    <th className="p-3">Phosphorus (P₂O₅)</th>
                    <th className="p-3">Potassium (K₂O)</th>
                    <th className="p-3 text-right">Total Weight Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 bg-slate-950/40 text-slate-350">
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Basal (At Sowing)</td>
                    <td className="p-3">40 kg/ha</td>
                    <td className="p-3">60 kg/ha</td>
                    <td className="p-3">40 kg/ha</td>
                    <td className="p-3 text-right font-bold text-slate-200">{getWeightRequired(140)} kg</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Top Dressing 1 (Tillering/Growth)</td>
                    <td className="p-3">40 kg/ha</td>
                    <td className="p-3">0 kg/ha</td>
                    <td className="p-3">0 kg/ha</td>
                    <td className="p-3 text-right font-bold text-slate-200">{getWeightRequired(40)} kg</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Top Dressing 2 (Reproduction)</td>
                    <td className="p-3">40 kg/ha</td>
                    <td className="p-3">0 kg/ha</td>
                    <td className="p-3">20 kg/ha</td>
                    <td className="p-3 text-right font-bold text-slate-200">{getWeightRequired(60)} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-[11px] text-slate-500 leading-relaxed space-y-1">
              <span className="text-slate-350 font-bold block uppercase tracking-wider text-[9px]">Fertigation Advisory</span>
              <p>For micro-drip networks, implement split N fertigation on a weekly cycle (10 equal splits) to mitigate nitrogen leaching under monsoonal weather.</p>
            </div>
          </div>

          {/* Conventional Tips */}
          <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Info className="h-4 w-4 text-emerald-400"/>
              NPK Ratios
            </h3>
            
            <div className="space-y-3">
              {[
                { label: 'Urea (46% N)', req: getWeightRequired(260) },
                { label: 'Single Super Phosphate (SSP - 16% P)', req: getWeightRequired(375) },
                { label: 'Muriate of Potash (MOP - 60% K)', req: getWeightRequired(100) }
            ].map((input, idx) => (<div key={idx} className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-900">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">{input.label}</span>
                  <span className="text-sm font-extrabold text-slate-200 mt-1 block">{input.req} kg total</span>
                </div>))}
            </div>

            <div className="border-t border-slate-800/80 pt-3 text-[10px] text-amber-500 font-bold flex items-center gap-2">
              <span>⚠ Apply chemical doses only on damp soil.</span>
            </div>
          </div>
        </div>)}

      {activePracticeTab === 'Organic Farming' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organic Inputs calculation */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-400"/>
              Organic Input Requirements
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Farm Yard Manure (FYM)', dose: '15 tonnes/ha', total: `${(15 * landArea).toFixed(1)} tonnes` },
                { name: 'Vermicompost', dose: '5 tonnes/ha', total: `${(5 * landArea).toFixed(1)} tonnes` },
                { name: 'Neem Cake (Pest Suppressant)', dose: '250 kg/ha', total: `${getWeightRequired(250)} kg` },
                { name: 'Groundnut Cake Supplement', dose: '300 kg/ha', total: `${getWeightRequired(300)} kg` }
            ].map((org, idx) => (<div key={idx} className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{org.name}</h4>
                    <span className="text-[9px] text-slate-500">Base rate: {org.dose}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-400 block">{org.total}</span>
                    <span className="text-[8px] text-slate-500 uppercase font-semibold">Required</span>
                  </div>
                </div>))}
            </div>

            {/* Green Manuring advice */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-[11px] text-slate-400 leading-relaxed space-y-1">
              <span className="text-slate-350 font-bold block uppercase tracking-wider text-[9px]">Green Manuring Schedule</span>
              <p>Sow Sunnhemp (Crotalaria juncea) or Dhaincha (Sesbania aculeata) at 25 kg/ha. Incorporate into the field at 45 days (pre-flowering) using a disc harrow. Unlocks 60-80 kg/ha residual nitrogen.</p>
            </div>
          </div>

          {/* Biofertilizers lists */}
          <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Biofertilizers & Supplements</h3>
            
            <div className="space-y-3 text-xs">
              {[
                { name: 'Rhizobium (Legumes)', desc: 'Pre-seed inoculation. Boosts root nodule growth.', dose: '500g per ha equivalent' },
                { name: 'Azotobacter / Azospirillum', desc: 'Soil application. Fixes non-symbiotic nitrogen.', dose: '2.5 kg mixed with 50 kg FYM' },
                { name: 'PSB (Phosphate Solubilizing Bacteria)', desc: 'Solubilizes tied phosphorus complexes.', dose: '2.5 kg mixed with FYM' },
                { name: 'Humic Acid Liquid', desc: 'Drenching. Elevates micronutrient bio-absorption.', dose: '5 Litres per ha equivalent' }
            ].map((bio, idx) => (<div key={idx} className="bg-slate-950/50 p-3 rounded-2xl border border-slate-900">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-300 font-bold">{bio.name}</strong>
                    <span className="text-[8px] text-emerald-400 font-bold uppercase">{bio.dose.split(' ')[0]} {bio.dose.split(' ')[1]}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{bio.desc}</p>
                </div>))}
            </div>

            <div className="border-t border-slate-800/80 pt-3 text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-4.5 w-4.5"/>
              <span>Certified Organic Schedule</span>
            </div>
          </div>
        </div>)}

      {activePracticeTab === 'Integrated Nutrient Management (INM)' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* INM 75:25 Rule details */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-400"/>
              INM 75:25 Balanced Allocation Rule
            </h3>

            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-900 flex flex-col md:flex-row justify-around gap-4 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">75% Chemical Allocation</span>
                <span className="text-lg font-extrabold text-slate-200 block mt-1">NPK Complex</span>
                <span className="text-xs text-sky-400 font-bold">{getWeightRequired(120)} kg total</span>
              </div>
              <div className="h-px md:h-12 w-full md:w-px bg-slate-800"/>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">25% Organic Allocation</span>
                <span className="text-lg font-extrabold text-slate-200 block mt-1">Vermicompost</span>
                <span className="text-xs text-emerald-400 font-bold">{((5 * landArea) * 0.25).toFixed(2)} tonnes</span>
              </div>
            </div>

            {/* INM detailed compound lists */}
            <div className="overflow-x-auto rounded-2xl border border-slate-900">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-900">
                  <tr>
                    <th className="p-3">Nutrient / Input</th>
                    <th className="p-3">Per-Hectare Rate</th>
                    <th className="p-3 text-right">Required for {landArea} ha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 bg-slate-950/40 text-slate-350">
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Urea (Chemical N)</td>
                    <td className="p-3">150 kg/ha</td>
                    <td className="p-3 text-right font-bold text-slate-200">{getWeightRequired(150)} kg</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Single Super Phosphate (Chemical P)</td>
                    <td className="p-3">220 kg/ha</td>
                    <td className="p-3 text-right font-bold text-slate-200">{getWeightRequired(220)} kg</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Vermicompost (Organic base)</td>
                    <td className="p-3">1250 kg/ha</td>
                    <td className="p-3 text-right font-bold text-slate-200">{getWeightRequired(1250)} kg</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">Humic Acid booster</td>
                    <td className="p-3">5 Litres/ha</td>
                    <td className="p-3 text-right font-bold text-slate-200">{getWeightRequired(5)} L</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-200">VAM (Mycorrhizae)</td>
                    <td className="p-3">10 kg/ha</td>
                    <td className="p-3 text-right font-bold text-slate-200">{getWeightRequired(10)} kg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* INM Micronutrients */}
          <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Essential Micronutrient schedule</h3>
            
            <div className="space-y-3">
              {[
                { name: 'Zinc Sulphate (Zn)', dose: '25 kg/ha', req: getWeightRequired(25) },
                { name: 'Borax (Boron B)', dose: '10 kg/ha', req: getWeightRequired(10) },
                { name: 'Elemental Sulphur (S)', dose: '20 kg/ha', req: getWeightRequired(20) }
            ].map((micro, idx) => (<div key={idx} className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-900 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{micro.name}</span>
                    <span className="text-[9px] text-slate-550 block">Dose: {micro.dose}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-teal-400 block">{micro.req} kg</span>
                    <span className="text-[8px] text-slate-500 uppercase font-semibold">Required</span>
                  </div>
                </div>))}
            </div>

            <div className="border-t border-slate-800/80 pt-3 text-[10px] text-teal-400 font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4"/>
              <span>Yield Booster Micronutrients Included</span>
            </div>
          </div>
        </div>)}
    </div>);
};
export default Nutrient;
