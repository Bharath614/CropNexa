'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import { Gauge } from './ui/gauge';
import { 
  TrendingUp, 
  DollarSign, 
  Droplet, 
  Sparkles, 
  ShieldAlert, 
  Award,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

import { NutrientGuideModal } from './nutrient-guide-modal';

export const Insights: React.FC = () => {
  const { t } = useTranslation();
  const { profile, weather, soilScore, currentUser, dispatchAdminEvent } = useFarm();
  const [isNutrientGuideOpen, setIsNutrientGuideOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      dispatchAdminEvent('AI Insights', 'AI Insights Generated', `User accessed AI yield and risk predictions for ${profile.currentCrop}.`, currentUser, 'info');
      dispatchAdminEvent('AI Insights', 'Yield predictions are generated', `Yield prediction model generated for ${profile.currentCrop}.`, currentUser, 'info');
      dispatchAdminEvent('AI Insights', 'Disease or pest risk predictions are completed', `Biological risk assessment completed.`, currentUser, 'warning');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, profile.currentCrop]);

  const handleOpenNutrientGuide = () => {
    setIsNutrientGuideOpen(true);
    if (currentUser) {
      dispatchAdminEvent('AI Insights', 'Nutrient recommendations are created', `User opened the Nutrient Field Encyclopedia.`, currentUser, 'info');
    }
  };

  const landArea = profile.totalLandArea;

  const getDynamicYieldMetrics = () => {
    const crop = profile.currentCrop.toLowerCase();
    let baseYield = 4.0;
    let basePricePerTonne = 450;

    if (crop === 'rice') { baseYield = 5.2; basePricePerTonne = 350; }
    else if (crop === 'wheat') { baseYield = 3.8; basePricePerTonne = 320; }
    else if (crop === 'maize') { baseYield = 6.5; basePricePerTonne = 280; }
    else if (crop === 'tomato') { baseYield = 18.0; basePricePerTonne = 150; }
    else if (crop === 'potato') { baseYield = 22.0; basePricePerTonne = 130; }
    else if (crop === 'sugarcane') { baseYield = 70.0; basePricePerTonne = 45; }
    else if (crop === 'cotton') { baseYield = 2.2; basePricePerTonne = 850; }

    const soilMultiplier = 0.7 + (soilScore / 100) * 0.4;
    let practiceMultiplier = 1.0;
    if (profile.farmingPractice === 'Organic Farming') {
      practiceMultiplier = 0.92;
    } else if (profile.farmingPractice === 'Integrated Nutrient Management (INM)') {
      practiceMultiplier = 1.05;
    }

    const predictedYield = parseFloat((baseYield * soilMultiplier * practiceMultiplier).toFixed(2));
    let priceTonne = basePricePerTonne;
    if (profile.farmingPractice === 'Organic Farming') {
      priceTonne = Math.round(basePricePerTonne * 1.35);
    }

    const totalYield = parseFloat((predictedYield * landArea).toFixed(1));
    const predictedRevenue = Math.round(totalYield * priceTonne);

    let companionImpact = 88;
    if (profile.farmingPractice === 'Organic Farming') companionImpact = 95;
    else if (profile.farmingPractice === 'Integrated Nutrient Management (INM)') companionImpact = 92;

    return { predictedYield, totalYield, predictedRevenue, companionImpact };
  };

  const { predictedYield, totalYield, predictedRevenue, companionImpact } = getDynamicYieldMetrics();

  const waterForecastData = [
    { week: 'Week 1', demand: Math.round(15 * landArea), rainfall: Math.round(weather.rainfall * landArea) },
    { week: 'Week 2', demand: Math.round(16 * landArea), rainfall: Math.round(10 * landArea) },
    { week: 'Week 3', demand: Math.round(18 * landArea), rainfall: Math.round(5 * landArea) },
    { week: 'Week 4', demand: Math.round(17 * landArea), rainfall: Math.round(2 * landArea) }
  ];

  const pestRiskScore = Math.min(100, Math.round(40 + (weather.humidity - 60) * 1.5 + (weather.temperature - 28) * 2));
  const diseaseRiskScore = Math.min(100, Math.round(35 + (weather.humidity - 50) * 1.8));

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md flex items-center justify-between group">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">{t('yieldPrediction')}</span>
            <span className="text-2xl font-extrabold text-slate-100 block tracking-tight">{predictedYield} t/ha</span>
            <p className="text-[10px] text-slate-400">Total harvest projection: <strong className="text-slate-200">{totalYield} tonnes</strong></p>
          </div>
          <div className="bg-emerald-950/60 text-emerald-400 h-12 w-12 rounded-2xl flex items-center justify-center border border-emerald-900/40 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md flex items-center justify-between group">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Expected Gross Revenue</span>
            <span className="text-2xl font-extrabold text-emerald-400 block tracking-tight">₹{(predictedRevenue * 80).toLocaleString('en-IN')}</span>
            <p className="text-[10px] text-slate-400">Organic premiums: <strong className="text-emerald-500">{profile.farmingPractice === 'Organic Farming' ? 'Enabled (+35%)' : 'Disabled'}</strong></p>
          </div>
          <div className="bg-teal-950/60 text-teal-400 h-12 w-12 rounded-2xl flex items-center justify-center border border-teal-900/40 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md flex items-center justify-between group">
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Companion Impact Rating</span>
            <span className="text-2xl font-extrabold text-amber-400 block tracking-tight">{companionImpact}%</span>
            <p className="text-[10px] text-slate-400">Optimal ecological stability rating</p>
          </div>
          <div className="bg-amber-955/20 text-amber-500 h-12 w-12 rounded-2xl flex items-center justify-center border border-amber-900/40 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Droplet className="h-4 w-4 text-sky-400" />
            {t('waterRecommendation')}
          </h3>

          <div className="h-56 w-full bg-slate-950/40 border border-slate-900/80 rounded-2xl p-4 shadow-inner relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={waterForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" />
                <XAxis dataKey="week" stroke="#64748b" style={{ fontSize: 9 }} />
                <YAxis stroke="#64748b" style={{ fontSize: 9 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#022c22', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="demand" stroke="#38bdf8" name="Demand (kL)" fillOpacity={1} fill="url(#demandGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="rainfall" stroke="#10b981" name="Rain Yield (kL)" fillOpacity={1} fill="url(#rainGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-500 leading-normal block">Rain Yield represents natural precipitation capture equivalent based on rain forecasts. Gap must be supplied via irrigation.</span>
        </div>

        <div className="lg:col-span-2 bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
            Biological Risk Assessment
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950/50 p-2 border border-slate-900 rounded-2xl flex flex-col items-center">
              <Gauge value={pestRiskScore} title={t('pestPrediction')} subtitle="High" size={90} strokeWidth={8} />
            </div>
            <div className="bg-slate-950/50 p-2 border border-slate-900 rounded-2xl flex flex-col items-center">
              <Gauge value={diseaseRiskScore} title={t('diseasePrediction')} subtitle="Medium" size={90} strokeWidth={8} />
            </div>
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 text-[10px] text-slate-500 leading-relaxed">
            <strong className="text-slate-300 font-bold block mb-1">{t('weatherImpact')}</strong>
            <p>Elevated humidity levels ({weather.humidity}%) combined with temperature spikes stimulate pest propagation cycles. Keep companion traps in place.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-950/40 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950 text-emerald-400 h-10 w-10 rounded-xl border border-emerald-900/50 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-200">{t('nutrientRecommendation')}</h4>
            <p className="text-[11px] text-slate-500">Based on soil chemistry profiles, a Nitrogen deficit is expected in 14 days unless organic topdressing is applied.</p>
          </div>
        </div>
        <button 
          onClick={handleOpenNutrientGuide}
          className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-emerald-950/60 border border-800/80 px-3.5 py-2 rounded-xl shrink-0"
        >
          Open Nutrient Guide
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <NutrientGuideModal
        isOpen={isNutrientGuideOpen} 
        onClose={() => setIsNutrientGuideOpen(false)} 
      />
    </div>
  );
};

export default Insights;
