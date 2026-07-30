'use client';
import React, { useState } from 'react';
import { useFarm } from '@/context/farm-context';
import { Bell, Search, CheckCheck, Trash2, CloudSun, Activity, Sprout, Calendar, AlertTriangle, Sparkles, Info, CheckCircle2 } from 'lucide-react';
export const NotificationsCenter = () => {
    const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, showToast } = useFarm();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
    const categories = [
        'All',
        'Weather Alerts',
        'Soil Health',
        'Companion Plants',
        'Farm Calendar',
        'Fertilizer Alerts',
        'Pest and Disease',
        'AI Insights',
        'System'
    ];
    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'Weather Alerts': return <CloudSun className="h-4 w-4 text-sky-400"/>;
            case 'Soil Health': return <Activity className="h-4 w-4 text-emerald-400"/>;
            case 'Companion Plants': return <Sprout className="h-4 w-4 text-teal-400"/>;
            case 'Farm Calendar': return <Calendar className="h-4 w-4 text-purple-400"/>;
            case 'Fertilizer Alerts': return <Sparkles className="h-4 w-4 text-amber-400"/>;
            case 'Pest and Disease': return <AlertTriangle className="h-4 w-4 text-rose-400"/>;
            case 'AI Insights': return <Sparkles className="h-4 w-4 text-emerald-300"/>;
            default: return <Info className="h-4 w-4 text-slate-400"/>;
        }
    };
    const filteredNotifications = notifications.filter(n => {
        const matchesCategory = activeCategory === 'All' || n.category === activeCategory;
        const matchesSearch = searchQuery === '' ||
            n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    return (<div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Push Notification Toggle */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 border border-emerald-950/60 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <Bell className="h-4 w-4"/>
            <span>Dedicated Notification Center</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Smart Agricultural Alerts & Communications</h2>
          <p className="text-xs text-slate-400">Categorized weather warnings, soil health updates, pest alerts, and calendar reminders.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-2xl text-xs font-semibold cursor-pointer">
            <input type="checkbox" checked={pushNotificationsEnabled} onChange={(e) => {
            setPushNotificationsEnabled(e.target.checked);
            showToast('Push Notification Settings', `Push notifications ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
        }} className="h-4 w-4 text-emerald-500 rounded accent-emerald-500"/>
            <span className="text-slate-300">Push Notifications</span>
          </label>

          {unreadCount > 0 && (<button onClick={markAllNotificationsRead} className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-2xl text-xs font-bold transition-colors cursor-pointer">
              <CheckCheck className="h-4 w-4"/>
              <span>Mark All Read ({unreadCount})</span>
            </button>)}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-4 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3"/>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notifications..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"/>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong>{filteredNotifications.length}</strong> of {notifications.length} alerts
          </span>
        </div>

        {/* Categorized Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((cat) => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`
                px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border
                ${activeCategory === cat
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800 shadow-inner'
                : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200'}
              `}>
              {cat !== 'All' && getCategoryIcon(cat)}
              <span>{cat}</span>
            </button>))}
        </div>
      </div>

      {/* Notification Items List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (<div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-12 text-center space-y-3">
            <Bell className="h-10 w-10 text-slate-600 mx-auto"/>
            <h4 className="text-sm font-extrabold text-slate-300">No notifications found</h4>
            <p className="text-xs text-slate-500">There are no alerts matching your search query or selected category filter.</p>
          </div>) : (filteredNotifications.map((notif) => (<div key={notif.id} className={`
                border rounded-2xl p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4
                ${!notif.read
                ? 'bg-slate-900/90 border-emerald-900/60 shadow-md'
                : 'bg-slate-950/60 border-slate-900 opacity-80'}
              `}>
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                      {notif.category}
                    </span>
                    {!notif.read && (<span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>)}
                    <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-100">{notif.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{notif.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!notif.read && (<button onClick={() => markNotificationRead(notif.id)} className="p-2 bg-slate-950 hover:bg-emerald-950 text-emerald-400 rounded-xl text-xs border border-slate-800" title="Mark as Read">
                    <CheckCircle2 className="h-4 w-4"/>
                  </button>)}

                <button onClick={() => deleteNotification(notif.id)} className="p-2 bg-slate-950 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded-xl text-xs border border-slate-800" title="Delete Notification">
                  <Trash2 className="h-4 w-4"/>
                </button>
              </div>
            </div>)))}
      </div>
    </div>);
};
export default NotificationsCenter;
