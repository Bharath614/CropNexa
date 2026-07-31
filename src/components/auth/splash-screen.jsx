'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowRight, ShieldCheck, LogIn } from 'lucide-react';
import { getTranslation } from '@/utils/i18n';

export const SplashScreen = ({ onComplete, language = 'en' }) => {
    const [secondsLeft, setSecondsLeft] = useState(4);
    const videoRef = useRef(null);
    const hasCompletedRef = useRef(false);
    const t = (key) => getTranslation(language, key);

    const handleComplete = useCallback(() => {
        if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete();
        }
    }, [onComplete]);

    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (secondsLeft <= 0) {
            handleComplete();
        }
    }, [secondsLeft, handleComplete]);

    const handleVideoEnded = () => {
        handleComplete();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white overflow-hidden select-none" suppressHydrationWarning>
            {/* Background Fullscreen Video */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-cover"
                >
                    <source src="/logo.mp4" type="video/mp4" />
                    <img src="/logo.png" alt="CropNexa App Logo" className="w-full h-full object-cover" />
                </video>
                
                {/* Subtle Cinematic Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/80" />
            </div>

            {/* Top Control Bar */}
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between p-6 relative z-20">
                <div className="flex items-center gap-2.5 bg-slate-950/80 border border-emerald-500/40 px-4 py-2 rounded-full backdrop-blur-md text-xs font-extrabold text-emerald-400 shadow-xl">
                    <img src="/logo.png" alt="CropNexa Logo" className="h-5 w-5 rounded-full object-cover border border-emerald-400/50" />
                    <span className="tracking-wide">CropNexa • AI Agriculture</span>
                </div>

                <button 
                    onClick={handleComplete} 
                    className="flex items-center gap-2 bg-slate-950/85 hover:bg-emerald-950/90 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-white px-5 py-2.5 rounded-full text-xs font-extrabold backdrop-blur-md transition-all cursor-pointer shadow-2xl hover:scale-105"
                >
                    <span>{t('authSkipSplash') || 'Skip Intro →'}</span>
                    <ArrowRight className="h-4 w-4 text-emerald-400"/>
                </button>
            </div>

            {/* Bottom Floating Sign-In Card & Progress Bar */}
            <div className="w-full max-w-md mx-auto space-y-4 pb-8 px-6 relative z-20 my-auto sm:my-0 sm:mt-auto">
                <div className="bg-slate-900/85 border border-emerald-500/40 p-5 rounded-3xl backdrop-blur-xl shadow-2xl space-y-3.5 text-center">
                    <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-widest">
                        <ShieldCheck className="h-4 w-4"/>
                        <span>Companion Planting Advisory</span>
                    </div>
                    <button 
                        onClick={handleComplete}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                    >
                        <LogIn className="h-4 w-4"/>
                        <span>Proceed to Sign In</span>
                    </button>
                </div>

                <div className="space-y-1.5 px-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-300 font-semibold">
                        <span className="text-emerald-400 font-bold">Initializing Crop Decision Engine...</span>
                        <span className="font-mono text-emerald-300 font-bold">{secondsLeft}s</span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-950/90 rounded-full overflow-hidden border border-slate-700/80 shadow-2xl backdrop-blur-md">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 transition-all duration-1000 ease-linear shadow-lg" 
                            style={{ width: `${((4 - secondsLeft) / 4) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
