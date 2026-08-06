'use client';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import {
    ShieldCheck, Users, Activity, AlertTriangle, Filter, Search, Download,
    CheckCircle2, Info, ShieldAlert, CalendarDays, FileText, LogIn, LogOut,
    Mail, Phone, MapPin, Briefcase, UserCheck, UserX, Crown, LayoutGrid,
    Clock, Eye, Badge, Building2, Globe, KeyRound
} from 'lucide-react';
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard = () => {
    const { adminActivities, registeredUsers, currentUser } = useFarm();
    const { t } = useTranslation();

    // Tab state
    const [activeAdminTab, setActiveAdminTab] = useState('overview');

    // Overview state
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeStatus, setActiveStatus] = useState('All');

    // Users tab state
    const [userSearch, setUserSearch] = useState('');
    const [userStatusFilter, setUserStatusFilter] = useState('All');
    const [selectedUser, setSelectedUser] = useState(null);

    // Login Logs tab state
    const [loginSearch, setLoginSearch] = useState('');
    const [loginEventFilter, setLoginEventFilter] = useState('All');

    // Statistics
    const totalUsers = registeredUsers.filter(u => !u.isAdmin).length;
    const verifiedUsers = registeredUsers.filter(u => u.isEmailVerified && !u.isAdmin).length;
    const activities = useMemo(() => adminActivities || [], [adminActivities]);
    const criticalAlerts = activities.filter(a => a.status === 'critical').length;
    const recentActivities = activities.filter(a => {
        const actDate = new Date(a.date);
        const today = new Date();
        const diff = today.getTime() - actDate.getTime();
        return diff <= (7 * 24 * 60 * 60 * 1000);
    }).length;

    // Chart Data
    const categoryData = useMemo(() => {
        const counts = {};
        activities.forEach(a => {
            counts[a.category] = (counts[a.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [activities]);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

    // Overview filtering
    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.event.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || activity.category === activeCategory;
        const matchesStatus = activeStatus === 'All' || activity.status === activeStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Users filtering
    const filteredUsers = registeredUsers.filter(u => {
        const matchesSearch = !userSearch ||
            u.profile?.farmerName?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.mobile?.includes(userSearch) ||
            u.profile?.farmName?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.profile?.district?.toLowerCase().includes(userSearch.toLowerCase());
        const matchesStatus = userStatusFilter === 'All' || u.accountStatus === userStatusFilter;
        return matchesSearch && matchesStatus;
    });

    // Login Logs filtering
    const loginActivities = activities.filter(a => {
        const isLoginEvent = a.category === 'Login' || a.category === 'Authentication' ||
            a.event?.toLowerCase().includes('login') || a.event?.toLowerCase().includes('logout') ||
            a.event?.toLowerCase().includes('register') || a.event?.toLowerCase().includes('password');
        const matchesSearch = !loginSearch ||
            a.userName?.toLowerCase().includes(loginSearch.toLowerCase()) ||
            a.userEmail?.toLowerCase().includes(loginSearch.toLowerCase()) ||
            a.event?.toLowerCase().includes(loginSearch.toLowerCase());
        const matchesEvent = loginEventFilter === 'All' || a.event?.toLowerCase().includes(loginEventFilter.toLowerCase());
        return isLoginEvent && matchesSearch && matchesEvent;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50';
            case 'warning': return 'text-amber-400 bg-amber-950/40 border-amber-900/50';
            case 'critical': return 'text-rose-400 bg-rose-950/40 border-rose-900/50';
            default: return 'text-sky-400 bg-sky-950/40 border-sky-900/50';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <CheckCircle2 className="h-4 w-4"/>;
            case 'warning': return <AlertTriangle className="h-4 w-4"/>;
            case 'critical': return <ShieldAlert className="h-4 w-4"/>;
            default: return <Info className="h-4 w-4"/>;
        }
    };

    const getAccountStatusBadge = (user) => {
        if (user.isAdmin) return { label: 'Admin', cls: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' };
        if (!user.isEmailVerified) return { label: 'Unverified', cls: 'text-amber-400 bg-amber-950/60 border-amber-800' };
        if (user.isLocked) return { label: 'Locked', cls: 'text-rose-400 bg-rose-950/60 border-rose-800' };
        if (user.accountStatus === 'Active') return { label: 'Active', cls: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
        return { label: user.accountStatus || 'Pending', cls: 'text-slate-400 bg-slate-950/60 border-slate-700' };
    };

    const triggerCSVDownload = () => {
        const csv = [
            ['Date', 'Time', 'Category', 'Status', 'Event', 'User Name', 'User Email', 'Description'],
            ...filteredActivities.map(a => [
                a.date, a.time, a.category, a.status, a.event, a.userName, a.userEmail,
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

    const triggerUsersCSV = () => {
        const csv = [
            ['Name', 'Email', 'Mobile', 'Farm', 'Village', 'District', 'State', 'Status', 'Email Verified', 'Role', 'Registered At'],
            ...filteredUsers.map(u => [
                u.profile?.farmerName || '', u.email || '', u.mobile || '',
                u.profile?.farmName || '', u.profile?.village || '',
                u.profile?.district || '', u.profile?.state || '',
                u.accountStatus || '', u.isEmailVerified ? 'Yes' : 'No',
                u.isAdmin ? 'Admin' : 'Farmer', u.registeredAt || ''
            ])
        ].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `users_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!currentUser?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-slate-900/50 rounded-3xl border border-rose-900/50">
                <ShieldAlert className="h-16 w-16 text-rose-500 mb-4"/>
                <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-slate-400 text-sm">You do not have permission to view the Admin Dashboard.</p>
            </div>
        );
    }

    const adminTabs = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'users', label: 'User Details', icon: Users },
        { id: 'login_logs', label: 'Login Logs', icon: KeyRound },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-900/50 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                        <ShieldCheck className="h-4 w-4"/>
                        <span>{t('adminControlCenter')}</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">{t('platformMonitoring')}</h2>
                    <p className="text-xs text-slate-400 mt-1">{t('adminSubtitle')}</p>
                </div>
                <button
                    onClick={activeAdminTab === 'users' ? triggerUsersCSV : triggerCSVDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 border border-indigo-700/50 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                >
                    <Download className="h-4 w-4"/>
                    {activeAdminTab === 'users' ? 'Export Users' : t('exportLogs')}
                </button>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('totalFarmers')}</span>
                        <span className="text-2xl font-black text-slate-200 block">{totalUsers}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <Users className="h-6 w-6 text-indigo-400"/>
                    </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('verifiedAccounts')}</span>
                        <span className="text-2xl font-black text-emerald-400 block">{verifiedUsers}</span>
                    </div>
                    <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/50">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400"/>
                    </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('recentActivityLogs')}</span>
                        <span className="text-2xl font-black text-sky-400 block">{recentActivities}</span>
                    </div>
                    <div className="bg-sky-950/30 p-3 rounded-xl border border-sky-900/50">
                        <Activity className="h-6 w-6 text-sky-400"/>
                    </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">{t('criticalSystemAlerts')}</span>
                        <span className="text-2xl font-black text-rose-400 block">{criticalAlerts}</span>
                    </div>
                    <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-900/50">
                        <AlertTriangle className="h-6 w-6 text-rose-400"/>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5 w-fit">
                {adminTabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeAdminTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveAdminTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 shadow-md'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                            }`}
                        >
                            <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}/>
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ===================== OVERVIEW TAB ===================== */}
            {activeAdminTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pie Chart */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-md h-80 flex flex-col">
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">{t('activityByCategory')}</h3>
                            <div className="flex-1 w-full relative">
                                {categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">No activity data available</div>
                                )}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                {categoryData.map((entry, index) => (
                                    <div key={entry.name} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}/>
                                        {entry.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col h-[600px]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-indigo-400"/>
                                {t('globalActivityStream')}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                    <input type="text" placeholder={t('searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-48"/>
                                </div>
                                <div className="relative">
                                    <Filter className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                    <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none">
                                        <option value="All">All Categories</option>
                                        <option value="Soil Health">Soil Health</option>
                                        <option value="Weather">Weather</option>
                                        <option value="Companion Planning">Companion Planning</option>
                                        <option value="Nutrient Management">Nutrient Management</option>
                                        <option value="Authentication">Authentication</option>
                                        <option value="Login">Login</option>
                                        <option value="Registration">Registration</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <Filter className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                    <select value={activeStatus} onChange={(e) => setActiveStatus(e.target.value)} className="pl-8 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none">
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
                                    <Search className="h-8 w-8 opacity-20"/>
                                    <span className="text-xs">No activity logs match your filters.</span>
                                </div>
                            ) : filteredActivities.map((activity) => (
                                <div key={activity.id} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 hover:border-indigo-900/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                        <div className="flex items-start gap-3 w-full">
                                            <div className={`p-2 rounded-xl shrink-0 border ${getStatusColor(activity.status)}`}>
                                                {getStatusIcon(activity.status)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-xs font-bold text-slate-200 truncate">{activity.event}</span>
                                                    <span className="text-[9px] px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900 text-slate-400">{activity.category}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{activity.description}</p>
                                                <div className="flex items-center gap-3 text-[10px] text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3"/>
                                                        {activity.userName} ({activity.userEmail})
                                                    </span>
                                                </div>
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
                                                <CalendarDays className="h-3 w-3"/>
                                                {activity.date}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-bold block">{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ===================== USERS TAB ===================== */}
            {activeAdminTab === 'users' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, farm, district..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                <select
                                    value={userStatusFilter}
                                    onChange={(e) => setUserStatusFilter(e.target.value)}
                                    className="pl-8 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Pending Verification">Pending Verification</option>
                                </select>
                            </div>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found</span>
                    </div>

                    {/* Users Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredUsers.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
                                <Users className="h-10 w-10 opacity-20"/>
                                <span className="text-xs">No users match your search.</span>
                            </div>
                        ) : filteredUsers.map((user, userIdx) => {
                            const badge = getAccountStatusBadge(user);
                            return (
                                <div
                                    key={`user-${user.id || user.email}-${userIdx}`}
                                    className="bg-slate-900/70 border border-slate-800 hover:border-indigo-800/60 rounded-2xl p-5 space-y-4 transition-all cursor-pointer group shadow-sm"
                                    onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm border shrink-0 ${user.isAdmin ? 'bg-indigo-950 text-indigo-300 border-indigo-700' : 'bg-emerald-950 text-emerald-300 border-emerald-800'}`}>
                                                {user.isAdmin
                                                    ? <Crown className="h-5 w-5"/>
                                                    : (user.profile?.farmerName || 'U').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)
                                                }
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-slate-100 truncate">{user.profile?.farmerName || 'Unknown'}</h4>
                                                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badge.cls}`}>
                                            {badge.label}
                                        </span>
                                    </div>

                                    {/* Info rows */}
                                    <div className="space-y-2 text-[11px]">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Phone className="h-3 w-3 text-indigo-400 shrink-0"/>
                                            <span className="truncate">{user.mobile || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Briefcase className="h-3 w-3 text-indigo-400 shrink-0"/>
                                            <span className="truncate">{user.profile?.farmName || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin className="h-3 w-3 text-indigo-400 shrink-0"/>
                                            <span className="truncate">{[user.profile?.village, user.profile?.district, user.profile?.state].filter(Boolean).join(', ') || '—'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <CalendarDays className="h-3 w-3 text-indigo-400 shrink-0"/>
                                            <span>Joined: {user.registeredAt || '—'}</span>
                                        </div>
                                    </div>

                                    {/* Verification badges */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                                        <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${user.isEmailVerified ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800' : 'text-amber-400 bg-amber-950/40 border-amber-800'}`}>
                                            <Mail className="h-2.5 w-2.5"/>
                                            Email {user.isEmailVerified ? 'Verified' : 'Unverified'}
                                        </span>
                                        <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${user.isMobileVerified ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800' : 'text-slate-400 bg-slate-950/40 border-slate-700'}`}>
                                            <Phone className="h-2.5 w-2.5"/>
                                            Mobile {user.isMobileVerified ? 'OK' : 'Pending'}
                                        </span>
                                    </div>

                                    {/* Expanded Detail Panel */}
                                    {selectedUser?.id === user.id && (
                                        <div className="pt-3 border-t border-indigo-900/40 space-y-3 animate-fadeIn">
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Full Details</p>
                                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                {[
                                                    { label: 'User ID', value: user.id },
                                                    { label: 'Role', value: user.isAdmin ? 'Administrator' : 'Farmer' },
                                                    { label: 'Account Status', value: user.accountStatus },
                                                    { label: 'Farming Practice', value: user.profile?.farmingPractice || '—' },
                                                    { label: 'Current Crop', value: user.profile?.currentCrop || '—' },
                                                    { label: 'Land Area', value: user.profile?.totalLandArea ? `${user.profile.totalLandArea} ha` : '—' },
                                                    { label: 'Soil Type', value: user.profile?.soilType || '—' },
                                                    { label: 'Country', value: user.profile?.country || '—' },
                                                    { label: 'SMS Notifications', value: user.smsNotificationsEnabled ? 'Enabled' : 'Disabled' },
                                                    { label: 'Login Attempts', value: user.failedLoginAttempts ?? 0 },
                                                    { label: 'Account Locked', value: user.isLocked ? 'Yes' : 'No' },
                                                    { label: 'First Login', value: user.isFirstLogin ? 'Yes' : 'No' },
                                                ].map(({ label, value }) => (
                                                    <div key={label} className="flex flex-col bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                                                        <span className="text-slate-500">{label}</span>
                                                        <span className="text-slate-300 font-semibold truncate">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-[9px] text-slate-600 text-center group-hover:text-indigo-500 transition-colors">
                                        {selectedUser?.id === user.id ? '▲ Click to collapse' : '▼ Click to expand details'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ===================== LOGIN LOGS TAB ===================== */}
            {activeAdminTab === 'login_logs' && (
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                <input
                                    type="text"
                                    placeholder="Search by user, email or event..."
                                    value={loginSearch}
                                    onChange={(e) => setLoginSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                                <select
                                    value={loginEventFilter}
                                    onChange={(e) => setLoginEventFilter(e.target.value)}
                                    className="pl-8 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none"
                                >
                                    <option value="All">All Events</option>
                                    <option value="login">Login</option>
                                    <option value="logout">Logout</option>
                                    <option value="register">Registration</option>
                                    <option value="password">Password</option>
                                    <option value="verification">Verification</option>
                                </select>
                            </div>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">{loginActivities.length} event{loginActivities.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Log Table */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-md">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-950/60 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <div className="col-span-1">#</div>
                            <div className="col-span-3">User</div>
                            <div className="col-span-3">Event</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-1">Time</div>
                        </div>

                        {/* Table Body */}
                        <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
                            {loginActivities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
                                    <KeyRound className="h-10 w-10 opacity-20"/>
                                    <span className="text-xs">No login events recorded yet.</span>
                                    <span className="text-[10px] text-slate-600">Login and logout actions will appear here automatically.</span>
                                </div>
                            ) : loginActivities.map((activity, idx) => {
                                const isLogin = activity.event?.toLowerCase().includes('login') && !activity.event?.toLowerCase().includes('logout');
                                const isLogout = activity.event?.toLowerCase().includes('logout');
                                const isReg = activity.event?.toLowerCase().includes('register') || activity.category === 'Registration';
                                return (
                                    <div key={activity.id} className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors items-center">
                                        <div className="col-span-1 text-[10px] text-slate-600 font-mono">{idx + 1}</div>

                                        <div className="col-span-3 flex items-center gap-2 min-w-0">
                                            <div className="h-7 w-7 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-[9px] font-black text-indigo-300 shrink-0">
                                                {(activity.userName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold text-slate-200 truncate">{activity.userName}</p>
                                                <p className="text-[9px] text-slate-500 truncate">{activity.userEmail}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-3 flex items-center gap-2">
                                            <div className={`p-1 rounded-lg border shrink-0 ${
                                                isLogin ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' :
                                                isLogout ? 'bg-rose-950/40 border-rose-900/50 text-rose-400' :
                                                isReg ? 'bg-indigo-950/40 border-indigo-900/50 text-indigo-400' :
                                                'bg-sky-950/40 border-sky-900/50 text-sky-400'
                                            }`}>
                                                {isLogin ? <LogIn className="h-3 w-3"/> :
                                                 isLogout ? <LogOut className="h-3 w-3"/> :
                                                 isReg ? <UserCheck className="h-3 w-3"/> :
                                                 <KeyRound className="h-3 w-3"/>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] text-slate-200 font-semibold truncate">{activity.event}</p>
                                                <p className="text-[9px] text-slate-500 truncate">{activity.description}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(activity.status)}`}>
                                                {activity.status || 'info'}
                                            </span>
                                        </div>

                                        <div className="col-span-2 flex items-center gap-1 text-[10px] text-slate-400">
                                            <CalendarDays className="h-3 w-3 text-indigo-400 shrink-0"/>
                                            {activity.date}
                                        </div>

                                        <div className="col-span-1 flex items-center gap-1 text-[10px] text-slate-500">
                                            <Clock className="h-3 w-3 shrink-0"/>
                                            {activity.time}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary Footer */}
                    <div className="flex items-center justify-between text-[10px] text-slate-600 px-1">
                        <span>Showing {loginActivities.length} authentication events</span>
                        <span>Login events are captured automatically on each user session</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
