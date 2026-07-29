/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  AlertTriangle, 
  Filter, 
  Search,
  Download,
  CheckCircle2,
  Info,
  ShieldAlert,
  CalendarDays,
  MapPin,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { adminActivities, registeredUsers, currentUser } = useFarm();
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');

  // Statistics calculations
  const totalUsers = registeredUsers.length - 1; // Subtract admin
  const verifiedUsers = registeredUsers.filter(u => u.isEmailVerified && !u.isAdmin).length;
  
  const activities = useMemo(() => adminActivities || [], [adminActivities]);

  const criticalAlerts = activities.filter(a => a.status === 'critical').length;
  const recentActivities = activities.filter(a => {
    const actDate = new Date(a.date);
    const today = new Date();
    const diff = today.getTime() - actDate.getTime();
    return diff <= (7 * 24 * 60 * 60 * 1000); // Last 7 days
  }).length;

  // Chart Data: Activity by Category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    activities.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [activities]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

  // Filtering Logic
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.event.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || activity.category === activeCategory;
    const matchesStatus = activeStatus === 'All' || activity.status === activeStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50';
      case 'warning': return 'text-amber-400 bg-amber-950/40 border-amber-900/50';
      case 'critical': return 'text-rose-400 bg-rose-950/40 border-rose-900/50';
      default: return 'text-sky-400 bg-sky-950/40 border-sky-900/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <ShieldAlert className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const triggerCSVDownload = () => {
    const csv = [
      ['Date', 'Time', 'Category', 'Status', 'Event', 'User Name', 'User Email', 'Description'],
      ...filteredActivities.map(a => [
        a.date,
        a.time,
        a.category,
        a.status,
        a.event,
        a.userName,
        a.userEmail,
        `"${a.description.replace(/"/g, '""')}"`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `admin_logs_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-900/50 rounded-3xl border border-rose-900/50">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-400 text-sm">You do not have permission to view the Admin Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/50 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>{t('adminControlCenter')}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">{t('platformMonitoring')}</h2>
          <p className="text-xs text-slate-400 mt-1">{t('adminSubtitle')}</p>
        </div>
        <button 
          onClick={triggerCSVDownload}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 border border-indigo-700/50 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          {t('exportLogs')}
        </button>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('totalFarmers')}</span>
            <span className="text-2xl font-black text-slate-200 block">{totalUsers}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <Users className="h-6 w-6 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('verifiedAccounts')}</span>
            <span className="text-2xl font-black text-emerald-400 block">{verifiedUsers}</span>
          </div>
          <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/50">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('recentActivityLogs')}</span>
            <span className="text-2xl font-black text-sky-400 block">{recentActivities}</span>
          </div>
          <div className="bg-sky-950/30 p-3 rounded-xl border border-sky-900/50">
            <Activity className="h-6 w-6 text-sky-400" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('criticalSystemAlerts')}</span>
            <span className="text-2xl font-black text-rose-400 block">{criticalAlerts}</span>
          </div>
          <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-900/50">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts & Analytics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-md h-80 flex flex-col">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">{t('activityByCategory')}</h3>
            <div className="flex-1 w-full relative">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">No activity data available</div>
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col h-[600px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              {t('globalActivityStream')}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <select 
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none"
                >
                  <option value="All">{t('allStatuses')}</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="critical">{t('soilClassCritical')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {filteredActivities.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                <Search className="h-8 w-8 opacity-20" />
                <span className="text-xs">No activity logs match your filters.</span>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 hover:border-indigo-900/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    
                    <div className="flex items-start gap-3 w-full">
                      <div className={`p-2 rounded-xl shrink-0 border ${getStatusColor(activity.status)}`}>
                        {getStatusIcon(activity.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-slate-200 truncate">{activity.event}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900 text-slate-400">
                            {activity.category}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {activity.userName} ({activity.userEmail})
                          </span>
                        </div>
                        
                        {/* Details object if any */}
                        {activity.details && Object.keys(activity.details).length > 0 && (
                          <div className="mt-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 text-[10px] grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.entries(activity.details).map(([k, v]) => (
                              <div key={k} className="flex flex-col">
                                <span className="text-slate-500">{k}</span>
                                <span className="text-slate-300 font-semibold truncate">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                      <span className="text-[10px] text-slate-400 flex items-center justify-end sm:justify-start gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {activity.date}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold block">{activity.time}</span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
