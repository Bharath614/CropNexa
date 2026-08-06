'use client';
import React from 'react';
import { useFarm } from '@/context/farm-context';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileSpreadsheet, Settings, Sprout } from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useFarm();
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('navDashboard') || 'Home', icon: LayoutDashboard },
    { id: 'crops', label: t('navCrops') || 'Crops', icon: Sprout },
    { id: 'reports', label: t('navReports') || 'Reports', icon: FileSpreadsheet },
    { id: 'settings', label: t('navSettings') || 'Profile', icon: Settings }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer min-w-[64px]
                ${isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}
              `}
            >
              <div className={`p-1.5 rounded-xl mb-0.5 ${isActive ? 'bg-emerald-950/50' : ''}`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : ''}`} />
              </div>
              <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
