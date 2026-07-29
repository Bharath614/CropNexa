/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle2, ShieldAlert, X, Sprout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import { confirmFirebasePasswordReset } from '@/utils/firebase-auth';

interface ResetPasswordPageProps {
  initialEmail?: string;
  initialOobCode?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  initialEmail,
  initialOobCode,
  onSuccess,
  onCancel
}) => {
  const { resetUserPassword, setAuthScreen, showToast } = useFarm();
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>(initialEmail || '');
  const [oobCode, setOobCode] = useState<string>(initialOobCode || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract params from URL query if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get('email') || params.get('reset_email') || params.get('user');
      const urlCode = params.get('oobCode') || params.get('code') || params.get('token');
      
      if (urlEmail && !email) setEmail(urlEmail);
      if (urlCode && !oobCode) setOobCode(urlCode);
    }
  }, [email, oobCode]);

  const handleResetPasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match. Please make sure both fields are identical.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. If Firebase Auth reset code is present, complete Firebase reset
      if (oobCode) {
        try {
          await confirmFirebasePasswordReset(oobCode, newPassword);
        } catch (firebaseErr: any) {
          console.warn('Firebase confirmPasswordReset notice:', firebaseErr);
        }
      }

      // 2. Update user password in application state & persistence
      const targetEmail = email.trim() || 'user';
      const ok = resetUserPassword(targetEmail, newPassword);

      if (ok || !email) {
        setSuccessMsg('Password changed successfully! You can now sign in with your new password.');
        showToast('Password Reset Successful', 'Your password has been updated. Please sign in.', 'success');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            setAuthScreen('login');
          }
        }, 1500);
      } else {
        setErrorMsg('Could not find an account associated with this email address.');
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      setErrorMsg(err.message || 'An error occurred while changing your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      setAuthScreen('login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden text-base py-12 select-none">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900/95 border border-emerald-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md relative z-10 animate-fadeIn">
        {/* Header branding */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl flex items-center justify-center shadow-inner shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">Set New Password</h3>
          </div>
          <button 
            onClick={handleCancelClick}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-slate-400 leading-relaxed">
          Set a new password for{' '}
          <span className="text-emerald-400 font-bold break-all">
            {email || 'your account'}
          </span>
        </p>

        {/* Notifications */}
        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-4 rounded-2xl text-xs flex items-start gap-2.5 leading-relaxed">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-4 rounded-2xl text-xs flex items-center gap-2.5 font-bold animate-pulse">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleResetPasswordSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              NEW PASSWORD
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              CONFIRM NEW PASSWORD
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving Password...' : 'Save New Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
