'use client';
import React, { useState } from 'react';
import { useFarm } from '@/context/farm-context';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/utils/i18n';
import { LayoutDashboard, CloudSun, Sprout, Sparkles, Activity, ClipboardList, BrainCircuit, FileSpreadsheet, Calendar, Settings, Menu, X, Locate, LogOut, Globe, Bell, ShieldCheck, Sun, Moon } from 'lucide-react';
export const Sidebar = () => {
    const { activeTab, setActiveTab, profile, resetAllData, logoutUser, currentLanguage, setLanguage, currentUser, theme, toggleTheme } = useFarm();
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const menuItems = [
        { id: 'dashboard', labelKey: 'navDashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard },
        { id: 'weather', labelKey: 'navWeather', defaultLabel: 'Weather', icon: CloudSun },
        { id: 'crops', labelKey: 'navCrops', defaultLabel: 'Crops', icon: Sprout },
        { id: 'companion', labelKey: 'navCompanion', defaultLabel: 'Companion Planner', icon: Sparkles },
        { id: 'soil', labelKey: 'navSoil', defaultLabel: 'Soil Health', icon: Activity },
        { id: 'nutrient', labelKey: 'navNutrient', defaultLabel: 'Nutrient Management', icon: ClipboardList },
        { id: 'insights', labelKey: 'navInsights', defaultLabel: 'AI Insights', icon: BrainCircuit },
        { id: 'calendar', labelKey: 'navCalendar', defaultLabel: 'Farm Calendar', icon: Calendar },
        { id: 'notifications', labelKey: 'navNotifications', defaultLabel: 'Notifications', icon: Bell },
        { id: 'reports', labelKey: 'navReports', defaultLabel: 'Reports', icon: FileSpreadsheet },
        { id: 'settings', labelKey: 'navSettings', defaultLabel: 'Settings', icon: Settings },
    ];
    if (currentUser?.isAdmin) {
        menuItems.push({ id: 'admin', labelKey: 'navAdmin', defaultLabel: 'Admin Dashboard', icon: ShieldCheck });
    }
    const toggleSidebar = () => setIsOpen(!isOpen);
    return (<>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between bg-emerald-950 text-white p-4 border-b border-emerald-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="CropNexa Logo" className="h-8 w-8 rounded-lg object-contain shadow-md border border-emerald-500/40" />
          <span className="font-bold text-lg tracking-wider text-emerald-300">CROP NEXA</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 text-emerald-400 hover:text-white transition-colors focus:outline-none cursor-pointer">
          {isOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
        </button>
      </div>

      {/* Main Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 transition-transform duration-300 ease-out z-40 
        w-64 bg-slate-900 border-r border-emerald-950 text-slate-100 flex flex-col justify-between 
        shadow-2xl h-screen sticky top-0
      `}>
        {/* Top Header section */}
        <div>
          <div className="p-5 border-b border-emerald-950/60 hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 opacity-50 blur-sm"/>
                <img src="/logo.png" alt="CropNexa Logo" className="relative h-10 w-10 rounded-xl object-cover shadow-lg border border-emerald-400/40" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">{t('appName')}</h1>
                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">Agricultural DSS</p>
              </div>
            </div>
          </div>

          {/* User Profile Mini Card */}
          <div className="p-3 mx-3 my-3 bg-gradient-to-br from-slate-800/90 to-slate-900 border border-emerald-950/60 rounded-2xl space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-950 text-emerald-400 h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs border border-emerald-800 shrink-0">
                {(profile?.farmerName || 'Rajesh').split(' ').filter(Boolean).map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-200 truncate">{profile.farmerName}</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Locate className="h-3 w-3 shrink-0"/>
                  <span className="truncate">{profile.village}, {profile.district}</span>
                </p>
              </div>
            </div>

            {/* Quick Language Dropdown & Theme Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] gap-1">
              <span className="text-slate-400 flex items-center gap-1 font-semibold">
                <Globe className="h-3 w-3 text-emerald-400"/> {t('language')}:
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={toggleTheme} className="p-1 bg-slate-950 hover:bg-emerald-950 text-amber-400 hover:text-amber-300 rounded-lg border border-slate-800 transition-colors cursor-pointer" title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
                  {theme === 'dark' ? <Sun className="h-3 w-3 text-amber-400"/> : <Moon className="h-3 w-3 text-indigo-400"/>}
                </button>
                <select value={currentLanguage} onChange={(e) => setLanguage(e.target.value)} className="bg-slate-950 text-emerald-300 font-bold px-2 py-0.5 rounded-lg border border-slate-800 focus:outline-none cursor-pointer">
                  {SUPPORTED_LANGUAGES.map((lang) => (<option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                      {lang.nativeName}
                    </option>))}
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-1 space-y-1 max-h-[50vh] overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const translatedLabel = t(item.labelKey);
            return (<button key={item.id} onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                }} className={`
                    w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer
                    ${isActive
                    ? 'bg-gradient-to-r from-emerald-950 to-slate-900 border-l-4 border-emerald-400 text-emerald-300 shadow-inner'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'}
                  `}>
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}/>
                  <span className="truncate">{translatedLabel || item.defaultLabel}</span>
                </button>);
        })}
          </nav>
        </div>

        {/* Bottom Footer Section */}
        <div className="p-3 border-t border-emerald-950/40 bg-slate-900/60 space-y-2">
          <button onClick={logoutUser} className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/50 transition-all cursor-pointer">
            <LogOut className="h-3.5 w-3.5"/>
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* Backdrop for mobile view */}
      {isOpen && (<div onClick={toggleSidebar} className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"/>)}
    </>);
};
export default Sidebar;
