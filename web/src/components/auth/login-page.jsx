/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Globe, CheckCircle2, X, ShieldAlert, KeyRound, HelpCircle, Send, Sparkles, Sprout, ShieldCheck, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/utils/i18n';
import { sendPasswordReset } from '@/utils/firebase-auth';
import { useFarm } from '@/context/farm-context';

export const LoginPage = ({ onLoginSubmit, onGoToRegister, currentLanguage, onLanguageChange }) => {
    const { dispatchOutboundNotification, showToast } = useFarm();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Forgot password modal state
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [resetInput, setResetInput] = useState('');
    const [isSendingLink, setIsSendingLink] = useState(false);
    const { t, i18n } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
        if (!identifier.trim()) {
            setErrorMsg('Please enter your Registered Email Address.');
            return;
        }
        if (!password) {
            setErrorMsg('Please enter your Password.');
            return;
        }
        const res = await onLoginSubmit(identifier.trim(), password, rememberMe);
        if (!res.success) {
            setErrorMsg(res.error || 'Login failed. Please check your credentials.');
        } else {
            setSuccessMsg('Login Successful! Welcome back to CropNexa.');
        }
    };

    const handleSendResetLink = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
        const targetEmail = resetInput.trim();
        if (!targetEmail) {
            setErrorMsg('Please enter your Registered Email Address.');
            return;
        }
        setIsSendingLink(true);
        try {
            await sendPasswordReset(targetEmail);
        } catch (err) {
            console.warn('Firebase sendPasswordReset notice:', err);
        } finally {
            setIsSendingLink(false);
        }

        dispatchOutboundNotification('email', targetEmail, 'Password Reset Request — CropNexa', `Dear User,

We received a request to reset the password for your CropNexa account (${targetEmail}).

Please check your inbox and click the password reset link sent to your email to set a new password.

If you did not request a password reset, please ignore this email.

Warm Regards,
CropNexa Team
Empowering Smarter Farming 🌱`, 'reset_password');

        setIsForgotPasswordOpen(false);
        setSuccessMsg(`A password reset link has been sent directly to ${targetEmail}. Please check your email inbox and follow the link to reset your password.`);
        showToast('Password Reset Link Sent!', `Reset link sent directly to ${targetEmail}. Check your inbox.`, 'success');
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row relative overflow-hidden text-base select-none">
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"/>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none"/>

            {/* Left Hero Branding Section (Full Height) */}
            <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-emerald-950/60 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950">
                {/* Brand Header */}
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 rounded-2xl flex items-center justify-center shadow-xl p-1 overflow-hidden shrink-0">
                        <img src="/logo.png" alt="CropNexa Logo" className="h-full w-full object-cover rounded-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white tracking-tight">
                            CropNexa
                        </h1>
                        <p className="text-xs text-emerald-400 font-extrabold uppercase tracking-wider">
                            Agricultural Decision Support System
                        </p>
                    </div>
                </div>

                {/* Main Content & Feature Value Prop */}
                <div className="my-10 space-y-6 max-w-xl">
                    <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/60 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-300 shadow-inner">
                        <Sparkles className="h-4 w-4 text-emerald-400"/>
                        <span>AI-Powered Companion Planting Platform</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                        Empowering Smarter & Sustainable Farming.
                    </h2>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                        Maximize your crop yield and soil health through data-driven companion planting, real-time stage diagnostics, and automated split-nutrient schedules.
                    </p>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                        {[
                            { title: 'Dynamic Soil Chemistry', desc: 'NPK, pH & Organic Carbon calculation', icon: Activity },
                            { title: 'OCR Report Reader', desc: 'Scan and parse soil lab PDFs directly', icon: ShieldCheck },
                            { title: '11-Language Advisory', desc: 'Native support for regional languages', icon: Globe },
                            { title: 'Yield & Weather Intelligence', desc: 'Stage-wise micro-climate alerts', icon: Sprout }
                        ].map((feat, idx) => {
                            const Icon = feat.icon;
                            return (
                                <div key={idx} className="bg-slate-900/60 border border-emerald-950/70 p-4 rounded-2xl backdrop-blur-sm flex items-start gap-3">
                                    <div className="p-2 bg-emerald-950/80 border border-emerald-900/80 text-emerald-400 rounded-xl shrink-0">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-200">{feat.title}</h4>
                                        <p className="text-[11px] text-slate-400 leading-snug">{feat.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer status */}
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 pt-4">
                    <span className="flex items-center gap-2 text-emerald-400 font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/> System Online • v1.0
                    </span>
                    <span>© {new Date().getFullYear()} CropNexa</span>
                </div>
            </div>

            {/* Right Sign In Form Section (Full Height Container) */}
            <div className="w-full lg:w-5/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-slate-950/90 backdrop-blur-md">
                <div className="max-w-md w-full mx-auto space-y-7 animate-fadeIn">
                    {/* Header Bar: Title + Language Selector */}
                    <div className="flex items-center justify-between border-b border-slate-900 pb-5">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{t('authLoginTitle')}</h2>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Access your farmer dashboard</p>
                        </div>

                        {/* Language Dropdown */}
                        <div className="relative flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300 shadow">
                            <Globe className="h-4 w-4 text-emerald-400 shrink-0"/>
                            <select 
                                value={currentLanguage} 
                                onChange={(e) => {
                                    const lang = e.target.value;
                                    i18n.changeLanguage(lang);
                                    onLanguageChange(lang);
                                }} 
                                className="bg-transparent text-xs text-slate-200 font-bold focus:outline-none cursor-pointer pr-1"
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                                        {lang.nativeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Notifications */}
                    {errorMsg && (
                        <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 leading-relaxed">
                            <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5"/>
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 font-bold animate-pulse">
                            <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0"/>
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* Sign In Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-extrabold text-slate-200 block">
                                {t('authEmailOrMobile')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Mail className="h-5 w-5 text-emerald-500"/>
                                </div>
                                <input 
                                    type="email" 
                                    value={identifier} 
                                    onChange={(e) => setIdentifier(e.target.value)} 
                                    placeholder="e.g. rajesh.kumar@cropnexa.in" 
                                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none transition-colors shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs sm:text-sm font-extrabold text-slate-200 block">
                                    {t('authPassword')}
                                </label>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setResetInput(identifier);
                                        setIsForgotPasswordOpen(true);
                                    }} 
                                    className="text-xs text-emerald-400 hover:underline font-bold cursor-pointer flex items-center gap-1"
                                >
                                    <HelpCircle className="h-3.5 w-3.5"/>
                                    {t('authForgotPassword')}
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <Lock className="h-5 w-5 text-emerald-500"/>
                                </div>
                                <input 
                                    type={showPassword ? 'text' : 'password'} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="••••••••" 
                                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-11 py-3.5 text-sm font-medium focus:outline-none transition-colors shadow-inner"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe} 
                                    onChange={(e) => setRememberMe(e.target.checked)} 
                                    className="h-4.5 w-4.5 rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
                                />
                                <span className="text-xs text-slate-300 font-bold">{t('authRememberMe')}</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-2xl text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:scale-[1.01]"
                        >
                            <LogIn className="h-5 w-5"/>
                            <span>{t('login')}</span>
                        </button>
                    </form>

                    {/* Switch to Registration & Forgot Password Link */}
                    <div className="pt-6 border-t border-slate-900 space-y-4 text-center">
                        <div className="flex justify-center items-center gap-2 text-xs">
                            <span className="text-slate-400">Forgot your password?</span>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setResetInput(identifier);
                                    setIsForgotPasswordOpen(true);
                                }} 
                                className="font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                            >
                                <KeyRound className="h-3.5 w-3.5"/>
                                <span>Send Password Reset Email Link</span>
                            </button>
                        </div>

                        <div className="pt-3 border-t border-slate-900">
                            <span className="text-xs text-slate-400">Don't have a farmer account yet? </span>
                            <button 
                                type="button" 
                                onClick={onGoToRegister} 
                                className="w-full py-3 mt-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-800 text-emerald-400 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                            >
                                <UserPlus className="h-4 w-4"/>
                                <span>{t('authRegisterTitle')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {isForgotPasswordOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-slate-900 border border-emerald-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-emerald-400"/>
                                Password Recovery
                            </h3>
                            <button onClick={() => setIsForgotPasswordOpen(false)} className="text-slate-400 hover:text-white p-1">
                                <X className="h-5 w-5"/>
                            </button>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                            Enter your registered email address below. We will send a password reset link directly to your email address so you can reset your password from your inbox.
                        </p>

                        <form onSubmit={handleSendResetLink} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-extrabold text-slate-300 block">
                                    {t('authEmailOrMobile')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <Mail className="h-4 w-4 text-emerald-500"/>
                                    </div>
                                    <input 
                                        type="email" 
                                        required 
                                        value={resetInput} 
                                        onChange={(e) => setResetInput(e.target.value)} 
                                        placeholder="e.g. rajesh.kumar@cropnexa.in" 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsForgotPasswordOpen(false)} className="px-4 py-2 bg-slate-950 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer">
                                    {t('cancel')}
                                </button>
                                <button type="submit" disabled={isSendingLink} className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold rounded-xl text-xs shadow cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
                                    <Send className="h-3.5 w-3.5"/>
                                    <span>{isSendingLink ? 'Sending Link...' : 'Send Reset Link to Email'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
