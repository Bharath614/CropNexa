'use client';
export const dynamic = 'force-dynamic';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import Sidebar from '@/components/sidebar';
import Dashboard from '@/components/dashboard';
import Weather from '@/components/weather';
import Crops from '@/components/crops';
import Companion from '@/components/companion';
import Soil from '@/components/soil';
import Nutrient from '@/components/nutrient';
import Insights from '@/components/insights';
import FarmingCalendar from '@/components/farming-calendar';
import Reports from '@/components/reports';
import SettingsPanel from '@/components/settings';
import NotificationsCenter from '@/components/notifications';
import AdminDashboard from '@/components/admin-dashboard';
import { SplashScreen } from '@/components/auth/splash-screen';
import { LoginPage } from '@/components/auth/login-page';
import { RegisterPage } from '@/components/auth/register-page';
import { ResetPasswordPage } from '@/components/auth/reset-password-page';
import { EmailSmsPreviewModal } from '@/components/auth/email-sms-preview-modal';
import { ToastContainer } from '@/components/ui/toast';
import { SUPPORTED_LANGUAGES } from '@/utils/i18n';
import { BadgeAlert, AlertTriangle, X, ShieldAlert, LogOut, Globe, Bell, Sun, Moon, Maximize2 } from 'lucide-react';
export default function Home() {
    const { authScreen, setAuthScreen, isAuthenticated, loginUser, registerUser, logoutUser, registeredUsers, activeTab, setActiveTab, profile, alerts, toasts, removeToast, currentLanguage, setLanguage, notifications, dispatchedOutbound, isOutboundModalOpen, setIsOutboundModalOpen, verifyUserEmail, resetUserPassword, theme, toggleTheme, appSize, setAppSize } = useFarm();
    const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
    const { t } = useTranslation();
    // Check URL parameters for direct reset link navigation
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const hasResetParam = params.get('oobCode') || params.get('reset_email') || params.get('email') || params.get('mode') === 'resetPassword' || window.location.search.includes('reset');
            if (hasResetParam && !isAuthenticated) {
                setAuthScreen('reset_password');
            }
        }
    }, [isAuthenticated, setAuthScreen]);
    // Auth Screen Router
    if (authScreen === 'splash') {
        return (<SplashScreen onComplete={() => setAuthScreen(isAuthenticated ? 'app' : 'login')} language={currentLanguage}/>);
    }
    if (authScreen === 'login') {
        return (<LoginPage onLoginSubmit={(id, pass, rem) => loginUser(id, pass, rem)} onGoToRegister={() => setAuthScreen('register')} onResetPassword={resetUserPassword} currentLanguage={currentLanguage} onLanguageChange={setLanguage}/>);
    }
    if (authScreen === 'register') {
        return (<RegisterPage onRegisterSuccess={async (prof, pass) => await registerUser(prof, pass)} onGoToLogin={() => setAuthScreen('login')} currentLanguage={currentLanguage} onLanguageChange={setLanguage} existingUsers={registeredUsers.map(u => ({ email: u.email, mobile: u.mobile }))}/>);
    }
    if (authScreen === 'reset_password') {
        return (<ResetPasswordPage onSuccess={() => setAuthScreen('login')} onCancel={() => setAuthScreen('login')}/>);
    }
    // Active Main App Views Router
    const renderActiveView = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'weather':
                return <Weather />;
            case 'crops':
                return <Crops />;
            case 'companion':
                return <Companion />;
            case 'soil':
                return <Soil />;
            case 'nutrient':
                return <Nutrient />;
            case 'insights':
                return <Insights />;
            case 'calendar':
                return <FarmingCalendar />;
            case 'reports':
                return <Reports />;
            case 'notifications':
                return <NotificationsCenter />;
            case 'admin':
                return <AdminDashboard />;
            case 'settings':
                return <SettingsPanel />;
            default:
                return <Dashboard />;
        }
    };
    const getHeaderTitle = () => {
        switch (activeTab) {
            case 'dashboard': return t('navDashboard');
            case 'weather': return t('navWeather');
            case 'crops': return t('navCrops');
            case 'companion': return t('navCompanion');
            case 'soil': return t('navSoil');
            case 'nutrient': return t('navNutrient');
            case 'insights': return t('navInsights');
            case 'calendar': return t('navCalendar');
            case 'reports': return t('navReports');
            case 'notifications': return t('navNotifications');
            case 'admin': return 'Admin Dashboard';
            case 'settings': return t('navSettings');
            default: return 'CropNexa Dashboard';
        }
    };
    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'High': return 'border-rose-900/60 bg-rose-950/30 text-rose-300';
            case 'Medium': return 'border-amber-900/60 bg-amber-950/30 text-amber-300';
            default: return 'border-sky-900/60 bg-sky-950/30 text-sky-300';
        }
    };
    const getContainerWidthClass = () => {
        switch (appSize) {
            case 'full': return 'w-full max-w-full px-4 lg:px-8 pb-16';
            case 'compact': return 'max-w-5xl w-full mx-auto px-4 pb-16';
            default: return 'max-w-7xl w-full mx-auto px-6 pb-16';
        }
    };
    return (<div className={`flex min-h-screen ${theme === 'light' ? 'light bg-slate-100 text-slate-900' : 'dark bg-slate-950 text-slate-100'} flex-col lg:flex-row`}>
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        {/* Top Status Header Bar */}
        <header className="bg-slate-900/60 border-b border-emerald-950/50 px-6 py-3.5 flex items-center justify-between backdrop-blur-md sticky top-0 z-30 print:hidden">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-slate-100 tracking-tight">
              {getHeaderTitle()}
            </h2>
            
            {/* Status pill */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-900/50 px-3 py-1 rounded-full text-[10px] text-emerald-400 font-bold">
              <img src="/logo.png" alt="CropNexa Logo" className="h-3.5 w-3.5 rounded-full object-cover" />
              <span>Active: {profile.currentCrop} ({profile.currentStage})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Top Language Switcher */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl text-xs text-slate-300">
              <Globe className="h-3.5 w-3.5 text-emerald-400 shrink-0"/>
              <select value={currentLanguage} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-xs text-slate-200 font-bold focus:outline-none cursor-pointer pr-1">
                {SUPPORTED_LANGUAGES.map((lang) => (<option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                    {lang.nativeName} ({lang.name})
                  </option>))}
              </select>
            </div>

            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button onClick={toggleTheme} className="p-2 bg-slate-950 hover:bg-emerald-950/40 text-slate-300 hover:text-amber-300 rounded-xl border border-slate-800 hover:border-amber-700 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold" title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              {theme === 'dark' ? (<>
                  <Sun className="h-4 w-4 text-amber-400"/>
                  <span className="hidden md:inline text-[11px] text-slate-300">Light Mode</span>
                </>) : (<>
                  <Moon className="h-4 w-4 text-indigo-400"/>
                  <span className="hidden md:inline text-[11px] text-slate-300">Dark Mode</span>
                </>)}
            </button>

            {/* App Width Sizing Toggle */}
            <button onClick={() => setAppSize(appSize === 'full' ? 'standard' : appSize === 'standard' ? 'compact' : 'full')} className="hidden sm:flex p-2 bg-slate-950 hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-300 rounded-xl border border-slate-800 hover:border-emerald-900 transition-colors cursor-pointer items-center gap-1 text-xs font-bold" title={`Current Layout: ${appSize.toUpperCase()} Width. Click to change.`}>
              <Maximize2 className="h-4 w-4 text-emerald-400"/>
              <span className="capitalize text-[11px]">{appSize}</span>
            </button>

            {/* Quick Alert notification counter */}
            {alerts.length > 0 && (<button onClick={() => setIsAlertsModalOpen(true)} className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 px-3 py-1.5 rounded-full text-xs text-rose-300 font-bold transition-all duration-200 shadow-md cursor-pointer animate-pulse">
                <BadgeAlert className="h-4 w-4 text-rose-400"/>
                <span className="hidden sm:inline">{alerts.length} Smart Alerts</span>
              </button>)}

            {/* Notification Center Bell */}
            <button onClick={() => setActiveTab('notifications')} className="relative p-2 bg-slate-950 hover:bg-emerald-950/40 text-slate-400 hover:text-emerald-300 rounded-xl border border-slate-800 hover:border-emerald-900 transition-colors cursor-pointer" title="Notification Center">
              <Bell className="h-4 w-4"/>
              {notifications.filter(n => !n.read).length > 0 && (<span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center rounded-full shadow border border-slate-900">
                  {notifications.filter(n => !n.read).length}
                </span>)}
            </button>

            {/* Logout Header Button */}
            <button onClick={logoutUser} className="p-2 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 rounded-xl border border-slate-800 hover:border-rose-900 transition-colors cursor-pointer" title="Logout">
              <LogOut className="h-4 w-4"/>
            </button>
          </div>
        </header>

        {/* Dynamic View container */}
        <div className={`p-6 ${getContainerWidthClass()}`}>
          {renderActiveView()}
        </div>
      </main>

      {/* Smart Alerts Detail Modal */}
      {isAlertsModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-rose-950/80 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-rose-950/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-rose-950/80 text-rose-400 p-2.5 rounded-2xl border border-rose-900/60 shadow-inner">
                  <ShieldAlert className="h-6 w-6"/>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-100">Smart Agricultural Risk Alerts</h3>
                  <p className="text-xs text-slate-400">Real-time disease, weather, and pest diagnostics</p>
                </div>
              </div>
              <button onClick={() => setIsAlertsModalOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors">
                <X className="h-5 w-5"/>
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {alerts.map((alert) => (<div key={alert.id} className={`border p-4 rounded-2xl space-y-2 ${getSeverityStyles(alert.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-400"/>
                      <span className="text-xs font-extrabold uppercase tracking-wider">{alert.type}</span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 uppercase font-extrabold">
                      {alert.severity} Severity
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-100">{alert.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
                  <div className="pt-2.5 border-t border-slate-800/80 mt-2 bg-slate-950/40 p-3 rounded-xl">
                    <span className="text-emerald-400 text-[11px] font-bold uppercase tracking-wider block mb-1">
                      Recommended Action:
                    </span>
                    <p className="text-xs text-slate-200 font-medium leading-normal">{alert.action}</p>
                  </div>
                </div>))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-500">Based on live farm parameters & weather network</span>
              <button onClick={() => {
                setIsAlertsModalOpen(false);
                setActiveTab('dashboard');
            }} className="px-4 py-2 bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 rounded-xl text-xs font-bold transition-all">
                Go to Command Center
              </button>
            </div>
          </div>
        </div>)}

      {/* Global Outbound Email / SMS Dispatch Simulator Modal */}
      {isOutboundModalOpen && (<EmailSmsPreviewModal notifications={dispatchedOutbound} onClose={() => setIsOutboundModalOpen(false)} onVerifyEmailAction={(targetEmail) => verifyUserEmail(targetEmail)} onResetPasswordAction={() => {
                setIsOutboundModalOpen(false);
                setAuthScreen('login');
            }}/>)}

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast}/>
    </div>);
}
