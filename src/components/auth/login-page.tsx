/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { 
  Sprout, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  UserPlus, 
  Globe, 
  CheckCircle2, 
  X,
  ShieldAlert,
  KeyRound,
  HelpCircle,
  Send
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageCode, SUPPORTED_LANGUAGES } from '@/utils/i18n';
import { sendPasswordReset } from '@/utils/firebase-auth';
import { useFarm } from '@/context/farm-context';

interface LoginPageProps {
  onLoginSubmit: (identifier: string, passwordInput: string, remember: boolean) => Promise<{ success: boolean; error?: string }> | { success: boolean; error?: string };
  onGoToRegister: () => void;
  onResetPassword: (identifier: string, newPass: string) => boolean;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSubmit,
  onGoToRegister,
  currentLanguage,
  onLanguageChange
}) => {
  const {
    dispatchOutboundNotification,
    showToast
  } = useFarm();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [isSendingLink, setIsSendingLink] = useState(false);

  const { t, i18n } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
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

  const handleSendResetLink = async (e: React.FormEvent) => {
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
      // 1. Call Firebase Auth to directly send official password reset email link
      await sendPasswordReset(targetEmail);
    } catch (err: any) {
      console.warn('Firebase sendPasswordReset notice:', err);
    } finally {
      setIsSendingLink(false);
    }

    // 2. Log outbound notification dispatch
    dispatchOutboundNotification(
      'email',
      targetEmail,
      'Password Reset Request — CropNexa',
      `Dear User,

We received a request to reset the password for your CropNexa account (${targetEmail}).

Please check your inbox and click the password reset link sent to your email to set a new password.

If you did not request a password reset, please ignore this email.

Warm Regards,
CropNexa Team
Empowering Smarter Farming 🌱`,
      'reset_password'
    );

    // 3. Close modal & show green success banner directly on login page (no popups!)
    setIsForgotPasswordOpen(false);
    setSuccessMsg(`A password reset link has been sent directly to ${targetEmail}. Please check your email inbox and follow the link to reset your password.`);
    showToast(
      'Password Reset Link Sent!',
      `Reset link sent directly to ${targetEmail}. Check your inbox.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-base py-12">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg bg-slate-900/95 border border-emerald-950/70 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md space-y-7 relative z-10 animate-fadeIn">
        {/* Header Branding & Language Switcher */}
        <div className="flex items-center justify-between border-b border-emerald-950/60 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              <Sprout className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{t('appName')}</h2>
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{t('authLoginTitle')}</p>
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

        {/* Notifications */}
        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-4 rounded-2xl text-sm flex items-start gap-3 leading-relaxed">
            <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-4 rounded-2xl text-sm flex items-center gap-3 font-bold animate-pulse">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-extrabold text-slate-200 block">
              {t('authEmailOrMobile')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-5 w-5 text-emerald-500" />
              </div>
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. rajesh.kumar@cropnexa.in"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-slate-200 block">
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
                <HelpCircle className="h-3.5 w-3.5" />
                {t('authForgotPassword')}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="h-5 w-5 text-emerald-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-11 py-3 text-sm font-medium focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4.5 w-4.5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
              />
              <span className="text-xs text-slate-300 font-bold">{t('authRememberMe')}</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <LogIn className="h-5 w-5" />
            <span>{t('login')}</span>
          </button>
        </form>

        {/* Switch to Registration & Forgot Password Link */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3 text-center">
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
              <KeyRound className="h-3.5 w-3.5" />
              <span>Send Password Reset Email Link</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-950">
            <span className="text-xs text-slate-400">Don't have a farmer account yet? </span>
            <button
              type="button"
              onClick={onGoToRegister}
              className="text-sm font-extrabold text-emerald-400 hover:underline flex items-center justify-center gap-1.5 mx-auto mt-1 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>{t('authRegisterTitle')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Only for entering Email to send reset link) */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-emerald-400" />
                Password Recovery
              </h3>
              <button onClick={() => setIsForgotPasswordOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
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
                    <Mail className="h-4 w-4 text-emerald-500" />
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
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="px-4 py-2 bg-slate-950 text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSendingLink}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold rounded-xl text-xs shadow cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
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
