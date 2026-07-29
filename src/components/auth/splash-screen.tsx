/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useState } from 'react';
import { Sprout, Leaf, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { LanguageCode, getTranslation } from '@/utils/i18n';

interface SplashScreenProps {
  onComplete: () => void;
  language?: LanguageCode;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = 'en' }) => {
  const [secondsLeft, setSecondsLeft] = useState(4);
  const t = (key: string) => getTranslation(language, key);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-emerald-950/80 to-slate-950 text-white p-6 overflow-hidden select-none">
      {/* Background Animated Glows & Particles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Floating Leaf Particles */}
      <div className="absolute top-1/4 left-10 text-emerald-500/30 animate-bounce duration-1000">
        <Leaf className="h-8 w-8 rotate-12" />
      </div>
      <div className="absolute bottom-1/4 right-12 text-teal-400/20 animate-bounce duration-700">
        <Leaf className="h-10 w-10 -rotate-45" />
      </div>

      {/* Top Header / Skip Control */}
      <div className="w-full max-w-4xl flex items-center justify-between pt-4 relative z-10">
        <div className="flex items-center gap-2 bg-slate-900/60 border border-emerald-900/40 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-bold text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>CropNexa v1.0 • AI Agriculture</span>
        </div>

        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-700 text-slate-300 hover:text-white px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-md"
        >
          <span>{t('authSkipSplash')}</span>
          <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Central Sprouting Logo & Brand Statement */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-xl mx-auto my-auto relative z-10">
        {/* Animated Sprout Core Graphic */}
        <div className="relative group">
          {/* Outer Rotating Glowing Ring */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 opacity-60 blur-xl animate-spin-slow" />
          
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500/60 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md">
            <Sprout className="h-14 w-14 sm:h-18 sm:w-18 text-emerald-400 animate-bounce duration-1000" />
          </div>

          <div className="absolute -bottom-2 -right-2 bg-emerald-950 border border-emerald-700 p-2 rounded-full text-emerald-300 shadow-md">
            <Leaf className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-white tracking-tight">
            CropNexa
          </h1>

          <div className="inline-block bg-emerald-950/80 border border-emerald-800/60 px-4 py-1 rounded-full text-xs sm:text-sm font-extrabold text-emerald-300 tracking-wide shadow-inner">
            {t('appTitle')}
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-md mx-auto italic">
            "{t('appSubtitle')}"
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {['Dynamic Soil Chemistry Engine', 'OCR Report Reader', '11-Language i18n', 'Split-Nutrient AI'].map((badge, idx) => (
            <span 
              key={idx}
              className="bg-slate-900/60 border border-emerald-900/50 text-slate-300 text-[10px] px-3 py-1 rounded-xl font-bold backdrop-blur-sm"
            >
              ✓ {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Progress Bar & Loading Indicator */}
      <div className="w-full max-w-md space-y-2 pb-6 relative z-10">
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-semibold px-1">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" /> Initializing Farm Decision Models...
          </span>
          <span>{secondsLeft}s</span>
        </div>

        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-linear"
            style={{ width: `${((4 - secondsLeft) / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
export default SplashScreen;
