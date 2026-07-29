/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { 
  Sprout, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Send
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageCode, SUPPORTED_LANGUAGES } from '@/utils/i18n';
import { FarmProfile, UserAccount } from '@/context/farm-context';
import { useFarm } from '@/context/farm-context';
import { auth } from '@/utils/firebase';
import { sendEmailVerification } from 'firebase/auth';

interface RegisterPageProps {
  onRegisterSuccess: (registeredProfile: FarmProfile, password: string) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  onGoToLogin: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  existingUsers?: { email: string; mobile?: string }[];
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onGoToLogin,
  currentLanguage,
  onLanguageChange,
  existingUsers = []
}) => {
  const { t, i18n } = useTranslation();
  const { showToast } = useFarm();
  
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Personal Info (Email ONLY - Mobile Number option removed)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Farm Info
  const [farmName, setFarmName] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Krishnagiri');
  const [village, setVillage] = useState('Kaveripattinam');
  const [gpsLocation] = useState('12.5186° N, 78.2139° E');

  // Land Info
  const [totalLandArea, setTotalLandArea] = useState(2.5);
  const [irrigatedArea, setIrrigatedArea] = useState(1.8);
  const [rainfedArea, setRainfedArea] = useState(0.7);

  // Farming Info
  const [farmingMode, setFarmingMode] = useState<'Organic Farming' | 'Integrated Nutrient Management (INM)' | 'Conventional Farming'>('Organic Farming');
  const [primaryCrop, setPrimaryCrop] = useState('Tomato');
  const [secondaryCrop, setSecondaryCrop] = useState('Marigold / Cowpea');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(currentLanguage);

  // Post-Reg States
  const [isRegisteredCompleted, setIsRegisteredCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailResendTimer, setEmailResendTimer] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email Resend Countdown
  React.useEffect(() => {
    if (emailResendTimer <= 0) return;
    const timer = setInterval(() => {
      setEmailResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [emailResendTimer]);

  const validateStep1 = () => {
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg('Full Farmer Name is required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return false;
    }

    const isDuplicate = existingUsers.some(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (isDuplicate) {
      setErrorMsg('An account with this Email Address already exists. Please sign in instead.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setErrorMsg(null);
    if (!farmName.trim()) {
      setErrorMsg('Farm Name is required.');
      return false;
    }
    if (!village.trim() || !district.trim() || !state.trim()) {
      setErrorMsg('Village, District, and State are required.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const newProfile: FarmProfile = {
        farmerName: fullName.trim(),
        mobileNumber: '',
        email: email.trim(),
        address: `${village}, ${district}, ${state}`,
        farmName: farmName.trim(),
        location: `${village} Sector`,
        gpsLocation,
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        country: 'India',
        totalLandArea: Number(totalLandArea),
        irrigatedArea: Number(irrigatedArea),
        rainfedArea: Number(rainfedArea),
        farmingPractice: farmingMode,
        preferredLanguage,
        defaultCrop: primaryCrop,
        soilType: 'Red Sandy Loam',
        soilTestReport: 'Initial Farmer Self-Report',
        defaultFarmLocation: `${district}, ${state}`,
        previousCrop: 'Wheat',
        currentCrop: primaryCrop,
        plannedCrop: secondaryCrop,
        currentStage: 'Growth'
      };

      const res = await onRegisterSuccess(newProfile, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed. Please try again.');
        return;
      }

      setIsRegisteredCompleted(true);
      setEmailResendTimer(60);
      showToast('Registration Created', `Verification link sent to ${email}`, 'success');
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (emailResendTimer > 0) return;
    
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        showToast('Verification Link Resent', `Check your email inbox at ${email}`, 'info');
      } else {
        showToast('Resend Link', `Please go to Sign In page and enter your password. Firebase will resend the link automatically.`, 'info');
      }
      setEmailResendTimer(60);
    } catch (err: any) {
      console.warn('Resend verification notice:', err);
      showToast('Notice', err?.message || `Verification request processed for ${email}`, 'info');
      setEmailResendTimer(60);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden py-10 text-base">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl bg-slate-900/95 border border-emerald-950/70 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-7 relative z-10 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-950/60 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <Sprout className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{t('appName')}</h2>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{t('authRegisterTitle')}</p>
            </div>
          </div>

          <div className="relative flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-sm text-slate-300">
            <Globe className="h-4 w-4 text-emerald-400 shrink-0" />
            <select
              value={currentLanguage}
              onChange={(e) => {
                const lang = e.target.value as LanguageCode;
                i18n.changeLanguage(lang);
                onLanguageChange(lang);
                setPreferredLanguage(lang);
              }}
              className="bg-transparent text-sm text-slate-200 font-bold focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Post-Registration Email Verification Success Banner */}
        {isRegisteredCompleted ? (
          <div className="bg-emerald-950/60 border border-emerald-800 p-8 rounded-3xl text-center space-y-5 animate-fadeIn">
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">Verification Email Sent! 📩</h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              An official Firebase email verification link has been dispatched to your email address:
              <br />
              <strong className="text-emerald-300 font-extrabold text-base underline">{email}</strong>
            </p>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 text-left space-y-1.5">
              <p className="text-slate-300 font-bold flex items-center gap-1.5">
                <Send className="h-4 w-4 text-emerald-400" /> Next Steps:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                <li>Open your email inbox for <strong>{email}</strong>.</li>
                <li>Look for an email from <strong>noreply@cropnexa-c059f.firebaseapp.com</strong>.</li>
                <li>Click the verification link inside the email to complete your registration.</li>
              </ol>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onGoToLogin}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold rounded-2xl text-sm shadow-xl cursor-pointer transition-all hover:scale-105"
              >
                Go to Sign In Page
              </button>
              
              <button
                onClick={handleResendVerificationEmail}
                disabled={emailResendTimer > 0}
                className={`w-full sm:w-auto px-6 py-3.5 bg-slate-950 border border-slate-800 text-sm font-bold flex items-center justify-center gap-2 rounded-2xl cursor-pointer ${
                  emailResendTimer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-emerald-400 hover:bg-slate-900'
                }`}
              >
                <RefreshCw className={`h-4 w-4 ${emailResendTimer > 0 ? 'animate-spin-slow' : ''}`} />
                {emailResendTimer > 0 ? `Resend Link in ${emailResendTimer}s` : 'Resend Verification Link'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step Indicator */}
            <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-sm">
              {[
                { step: 1, label: t('authStep1') },
                { step: 2, label: t('authStep2') },
                { step: 3, label: t('authStep3') }
              ].map((st) => (
                <div
                  key={st.step}
                  className={`flex items-center gap-2 font-extrabold ${
                    currentStep === st.step ? 'text-emerald-400' : currentStep > st.step ? 'text-teal-300' : 'text-slate-500'
                  }`}
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black ${
                    currentStep === st.step ? 'bg-emerald-500 text-slate-950 shadow' : currentStep > st.step ? 'bg-teal-900 text-teal-300' : 'bg-slate-900 text-slate-500'
                  }`}>
                    {st.step}
                  </div>
                  <span className="hidden sm:inline">{st.label}</span>
                </div>
              ))}
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="bg-rose-950/60 border border-rose-800 text-rose-300 p-4 rounded-2xl text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                {(errorMsg.includes('already exists') || errorMsg.includes('sign in')) && (
                  <button
                    type="button"
                    onClick={onGoToLogin}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow transition-all hover:scale-105"
                  >
                    Go to Sign In
                  </button>
                )}
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-sm font-extrabold text-slate-200 block">{t('authFullName')}</label>
                    <div className="relative">
                      <User className="h-5 w-5 text-emerald-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-extrabold text-slate-200 block">{t('authEmailOrMobile')}</label>
                    <div className="relative">
                      <Mail className="h-5 w-5 text-emerald-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rajesh.kumar@cropnexa.in"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-extrabold text-slate-200 block">{t('authPassword')}</label>
                      <div className="relative">
                        <Lock className="h-5 w-5 text-emerald-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-11 py-3 text-sm font-medium focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-extrabold text-slate-200 block">{t('authConfirmPassword')}</label>
                      <div className="relative">
                        <Lock className="h-5 w-5 text-emerald-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-sm font-extrabold text-slate-200 block">{t('authFarmName')}</label>
                    <input
                      type="text"
                      required
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Green Horizon Organic Farm"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">{t('authVillage')}</label>
                      <input
                        type="text"
                        required
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">{t('authDistrict')}</label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">{t('authState')}</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">Total Area (Ha)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={totalLandArea}
                        onChange={(e) => setTotalLandArea(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">Irrigated (Ha)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={irrigatedArea}
                        onChange={(e) => setIrrigatedArea(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">Rainfed (Ha)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={rainfedArea}
                        onChange={(e) => setRainfedArea(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-sm font-extrabold text-slate-200 block">{t('authFarmingMode')}</label>
                    <select
                      value={farmingMode}
                      onChange={(e) => setFarmingMode(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 font-bold focus:outline-none"
                    >
                      <option value={t('organicFarming')}>{t('organicFarming')} (Bio-inputs & FYM)</option>
                      <option value="Integrated Nutrient Management (INM)">{t('inm')}</option>
                      <option value={t('conventionalFarming')}>{t('conventionalFarming')} (Chemical NPK)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-extrabold text-slate-200 block">{t('authPrimaryCrop')}</label>
                      <select
                        value={primaryCrop}
                        onChange={(e) => setPrimaryCrop(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200 font-medium"
                      >
                        <option value="Tomato">Tomato</option>
                        <option value="Maize">Maize (Corn)</option>
                        <option value="Potato">Potato</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Rice (Paddy)">Rice (Paddy)</option>
                        <option value="Cabbage">Cabbage</option>
                        <option value="Onion">Onion</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-extrabold text-slate-200 block">{t('authSecondaryCrop')}</label>
                      <input
                        type="text"
                        value={secondaryCrop}
                        onChange={(e) => setSecondaryCrop(e.target.value)}
                        placeholder="e.g. Marigold, Cowpea, Basil"
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-950/40 p-4.5 rounded-2xl border border-emerald-900/60 text-sm text-emerald-300 space-y-1.5">
                    <span className="font-extrabold flex items-center gap-2 text-base">
                      <ShieldCheck className="h-5 w-5 text-emerald-400" /> Firebase Email Verification Link
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Submitting will register your account and dispatch an official Firebase verification link to <strong className="text-emerald-300 font-bold underline">{email}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-5 border-t border-slate-800">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                    className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-300 font-extrabold rounded-xl text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> {t('authBack')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onGoToLogin}
                    className="text-sm font-bold text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {t('authCancelLogin')}
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <span>{t('authNextStep')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
                  >
                    <ShieldCheck className="h-5 w-5 text-slate-950" />
                    <span>{isSubmitting ? 'Sending Link...' : 'Send Verification Link & Register'}</span>
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default RegisterPage;
