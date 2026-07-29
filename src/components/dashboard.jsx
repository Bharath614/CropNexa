'use client';
import React from 'react';
import { useFarm } from '@/context/farm-context';
import { Gauge } from './ui/gauge';
import { useTranslation } from 'react-i18next';
import { Sprout, MapPin, Sun, Sparkles, AlertTriangle, Calendar, CheckCircle2, Layers, UserCheck, Globe } from 'lucide-react';
export const Dashboard = () => {
    const { profile, soilScore, soilStatus, weather, alerts, calendar, setActiveTab, toggleCalendarEvent, currentLanguage } = useFarm();
    const { t } = useTranslation();
    const pendingTasks = calendar.filter(t => !t.completed);
    return (<div className="space-y-6 animate-fadeIn">
      {/* Top Welcome Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-950/60 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"/>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 w-fit">
            <UserCheck className="h-3.5 w-3.5"/>
            <span>{t('welcomeBack')}, {profile.farmerName} 👋</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {profile.farmName}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-400"/>
              {profile.village}, {profile.district}, {profile.state}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
              <Sprout className="h-3.5 w-3.5"/>
              {profile.currentCrop} ({profile.currentStage} Stage)
            </span>
            <span>•</span>
            <span className="bg-slate-950/80 px-2.5 py-0.5 rounded-md border border-slate-800 text-[10px] text-teal-300 font-bold">
              {profile.farmingPractice}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button onClick={() => setActiveTab('soil')} className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 cursor-pointer transition-all">
            <Sparkles className="h-4 w-4"/>
            <span>Soil Score: {soilScore}/100</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Soil Score Gauge */}
        <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('dashSoilScore')}</span>
            <span className="text-2xl font-black text-white">{soilScore}<span className="text-xs text-slate-400">/100</span></span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{soilStatus} Quality</span>
          </div>
          <Gauge value={soilScore} size={68}/>
        </div>

        {/* Metric 2: Active Crop & Land */}
        <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('landAndActiveCrop')}</span>
            <span className="text-lg font-black text-slate-100">{profile.currentCrop}</span>
            <span className="text-[10px] text-slate-400 block">{profile.totalLandArea} Hectares ({profile.irrigatedArea} Ha Irrigated)</span>
          </div>
          <div className="h-12 w-12 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-900">
            <Sprout className="h-6 w-6"/>
          </div>
        </div>

        {/* Metric 3: Weather Summary */}
        <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('dashWeatherSummary')}</span>
            <span className="text-lg font-black text-slate-100">{weather.temperature}°C</span>
            <span className="text-[10px] text-sky-400 block font-semibold">{weather.season} • Rain: {weather.rainfall}mm</span>
          </div>
          <div className="h-12 w-12 bg-sky-950 text-sky-400 rounded-2xl flex items-center justify-center border border-sky-900">
            <Sun className="h-6 w-6"/>
          </div>
        </div>

        {/* Metric 4: Farming Mode & Language */}
        <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-5 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('systemMode')}</span>
            <span className="text-xs font-extrabold text-slate-200 block truncate max-w-[130px]">{profile.farmingPractice}</span>
            <span className="text-[10px] text-teal-300 font-bold block flex items-center gap-1 mt-0.5">
              <Globe className="h-3 w-3"/> Lang: {currentLanguage.toUpperCase()}
            </span>
          </div>
          <div className="h-12 w-12 bg-teal-950 text-teal-400 rounded-2xl flex items-center justify-center border border-teal-900">
            <Layers className="h-6 w-6"/>
          </div>
        </div>
      </div>

      {/* Main Content Grid: AI Recommendations & Smart Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Agronomist Actionable Recommendations */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400 animate-pulse"/>
              <h3 className="text-base font-extrabold text-white tracking-tight">{t('dashAiRecommendation')}</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
              Target Crop: {profile.currentCrop}
            </span>
          </div>

          <div className="space-y-3">
            {/* Dynamic Card 1: Soil-Matched Companion */}
            <div className="bg-slate-950/80 border border-emerald-900/60 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold uppercase text-[10px]">{t('optimalCompanion')}</span>
                <span className="text-[10px] text-slate-500">{t('liveChemistry')}</span>
              </div>
              <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                Pair <strong>{profile.currentCrop}</strong> with <strong>Marigold & Cowpea</strong>. Marigold exudates suppress root-knot nematodes while Cowpea fixes biological nitrogen in rhizosphere.
              </p>
            </div>

            {/* Dynamic Card 2: Split Nutrient Dose */}
            <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-sky-400 font-bold uppercase text-[10px]">{t('splitNutrient')}</span>
                <span className="text-[10px] text-slate-500">Growth Stage: {profile.currentStage}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Apply 60% baseline dose now and reserve 40% split dose for flowering stage. Combine with Phosphate Solubilizing Bacteria (PSB) for maximum uptake.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Active Smart Alerts */}
        <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-6 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-400"/>
                {t('smartAlerts')} ({alerts.length})
              </h3>
              <button onClick={() => setActiveTab('weather')} className="text-[10px] text-emerald-400 font-bold hover:underline">
                Weather Details →
              </button>
            </div>

            <div className="space-y-3">
              {alerts.slice(0, 2).map((alert) => (<div key={alert.id} className="bg-rose-950/30 border border-rose-900/50 p-3.5 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-rose-300">{alert.title}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold uppercase border border-rose-800">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{alert.description}</p>
                </div>))}
            </div>
          </div>

          {/* Pending Tasks Quick Checklist */}
          <div className="pt-3 border-t border-slate-900 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-400"/>
              {t('dashPendingTasks')} ({pendingTasks.length})
            </h4>

            {pendingTasks.slice(0, 2).map((evt) => (<div key={evt.id} onClick={() => toggleCalendarEvent(evt.id)} className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-emerald-800">
                <div className="h-4 w-4 rounded border border-slate-700 flex items-center justify-center shrink-0">
                  {evt.completed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400"/>}
                </div>
                <span className="truncate text-[11px] font-medium">{evt.task}</span>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
};
export default Dashboard;
