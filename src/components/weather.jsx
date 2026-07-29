'use client';
import React, { useState, useEffect } from 'react';
import { useFarm } from '@/context/farm-context';
import { CloudSun, MapPin, Droplets, Thermometer, Compass, CloudRain, Activity, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
export const Weather = () => {
    const { profile, weather, currentUser, dispatchAdminEvent } = useFarm();
    const [activeChart, setActiveChart] = useState('temp');
    useEffect(() => {
        if (currentUser) {
            if (weather.temperature > 38 || weather.rainfall > 50 || weather.windSpeed > 40) {
                dispatchAdminEvent('Weather', 'Extreme weather warnings are generated', `Extreme weather detected for ${profile.village}: Temp ${weather.temperature}°C, Rain ${weather.rainfall}mm.`, currentUser, 'critical');
            }
            else {
                dispatchAdminEvent('Weather', 'Weather alerts are triggered', `Routine weather check completed for ${profile.village}.`, currentUser, 'info');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.id, weather.temperature, weather.rainfall, weather.windSpeed, profile.village]);
    const getChartConfig = () => {
        switch (activeChart) {
            case 'rain':
                return {
                    dataKey: 'rain',
                    color: '#38bdf8',
                    name: 'Rainfall (mm)',
                    type: 'bar'
                };
            case 'humidity':
                return {
                    dataKey: 'humidity',
                    color: '#10b981',
                    name: 'Humidity (%)',
                    type: 'area'
                };
            case 'dew':
                return {
                    dataKey: 'dewPoint',
                    color: '#a855f7',
                    name: 'Dew Point (°C)',
                    type: 'area'
                };
            default:
                return {
                    dataKey: 'temp',
                    color: '#fb7185',
                    name: 'Temperature (°C)',
                    type: 'area'
                };
        }
    };
    const chartConfig = getChartConfig();
    const chartData = weather.hourlyTemp.map((item, index) => {
        let offsetHumid = 65;
        let offsetDew = 19;
        if (index === 0) {
            offsetHumid = 82;
            offsetDew = 21;
        }
        else if (index === 1) {
            offsetHumid = 75;
            offsetDew = 20;
        }
        else if (index === 2) {
            offsetHumid = 62;
            offsetDew = 18;
        }
        else if (index === 3) {
            offsetHumid = 60;
            offsetDew = 19;
        }
        else if (index === 4) {
            offsetHumid = 68;
            offsetDew = 20;
        }
        else if (index === 5) {
            offsetHumid = 76;
            offsetDew = 21;
        }
        else if (index === 6) {
            offsetHumid = 80;
            offsetDew = 22;
        }
        else if (index === 7) {
            offsetHumid = 85;
            offsetDew = 22;
        }
        return {
            ...item,
            humidity: offsetHumid,
            dewPoint: offsetDew
        };
    });
    const getIcon = (status) => {
        switch (status) {
            case 'Thunderstorms': return <CloudRain className="h-6 w-6 text-sky-400 animate-pulse"/>;
            case 'Scattered Showers': return <CloudRain className="h-6 w-6 text-sky-400"/>;
            case 'Partly Cloudy': return <CloudSun className="h-6 w-6 text-amber-300"/>;
            default: return <CloudSun className="h-6 w-6 text-amber-400"/>;
        }
    };
    return (<div className="space-y-6 animate-fadeIn">
      {/* Location Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Weather Location</h3>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-950 text-emerald-400 h-10 w-10 rounded-xl flex items-center justify-center border border-emerald-900/40 shadow-inner">
                <MapPin className="h-5 w-5"/>
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-200">Village: {profile.village}</h4>
                <p className="text-xs text-slate-400">{profile.district}, {profile.state}, {profile.country}</p>
              </div>
            </div>
          </div>
          <div className="text-slate-400 text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-900 shrink-0 space-y-1">
            <span className="block">GPS Coordinates: <strong className="text-slate-300">{profile.gpsLocation}</strong></span>
            <span className="block">Weather Source: <strong className="text-emerald-400">OpenWeatherMap API</strong></span>
          </div>
        </div>

        {/* Season Detector */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-950 border border-emerald-950/50 rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Season Detection</h3>
          <div className="flex items-center gap-3 py-2">
            <Compass className="h-8 w-8 text-emerald-400 animate-spin-slow shrink-0"/>
            <div>
              <span className="text-lg font-extrabold text-slate-200 block">{weather.season}</span>
              <p className="text-[10px] text-slate-400">Automatic location-dependent detection</p>
            </div>
          </div>
          <div className="text-[10px] text-emerald-400/90 font-semibold bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-900/30">
            Optimal for planned rotation: {profile.plannedCrop}
          </div>
        </div>
      </div>

      {/* Real-time Charts Panel */}
      <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-emerald-950/50 pb-4 gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-100 tracking-tight">Weather Intelligence Analyzer</h3>
            <p className="text-xs text-slate-400">Interactive 24-hour weather trends</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
            { id: 'temp', label: 'Temperature', icon: Thermometer, activeColor: 'bg-rose-950 text-rose-400 border-rose-900/60' },
            { id: 'rain', label: 'Rainfall', icon: CloudRain, activeColor: 'bg-sky-950 text-sky-400 border-sky-900/60' },
            { id: 'humidity', label: 'Humidity', icon: Droplets, activeColor: 'bg-emerald-950 text-emerald-400 border-emerald-900/60' },
            { id: 'dew', label: 'Dew Point', icon: Activity, activeColor: 'bg-purple-950 text-purple-400 border-purple-900/60' }
        ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeChart === tab.id;
            return (<button key={tab.id} onClick={() => setActiveChart(tab.id)} className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer
                    ${isActive
                    ? tab.activeColor
                    : 'bg-slate-950/60 border-slate-900 text-slate-500 hover:text-slate-200'}
                  `}>
                  <Icon className="h-4 w-4"/>
                  {tab.label}
                </button>);
        })}
          </div>
        </div>

        {/* Chart View */}
        <div className="h-72 w-full bg-slate-950/40 border border-slate-900/80 rounded-2xl p-4 shadow-inner relative">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              {chartConfig.type === 'bar' ? (<BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a"/>
                  <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: 9 }}/>
                  <YAxis stroke="#64748b" style={{ fontSize: 9 }}/>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#022c22', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}/>
                  <Bar dataKey={chartConfig.dataKey} fill={chartConfig.color} radius={[4, 4, 0, 0]}/>
                </BarChart>) : (<AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartConfig.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartConfig.color} stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a"/>
                  <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: 9 }}/>
                  <YAxis stroke="#64748b" style={{ fontSize: 9 }}/>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#022c22', borderRadius: '12px', fontSize: '11px', color: '#f8fafc' }}/>
                  <Area type="monotone" dataKey={chartConfig.dataKey} stroke={chartConfig.color} fillOpacity={1} fill="url(#chartGradient)" strokeWidth={2.5}/>
                </AreaChart>)}
            </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Wind & 3-Day Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Wind Pattern Metrics</h3>
          
          <div className="flex items-center justify-around py-2">
            <div className="text-center">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Speed</span>
              <span className="text-xl font-extrabold text-slate-200">{weather.windSpeed} km/h</span>
            </div>
            <div className="h-10 w-px bg-slate-800"/>
            <div className="text-center">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">Direction</span>
              <span className="text-xl font-extrabold text-emerald-400">{weather.windDirection}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-900 text-xs text-slate-400 space-y-2">
            <span className="text-slate-300 font-bold block uppercase tracking-wider text-[10px]">Seasonal Wind Pattern</span>
            <p>During monsoon, south-westerly winds push humid maritime air inland. Maintain border crops as windbreakers.</p>
          </div>
        </div>

        <div className="lg:col-span-3 bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Next 3-Day Weather Forecast</h3>
          
          <div className="space-y-3">
            {weather.forecast.map((fc, index) => (<div key={index} className="flex items-center justify-between p-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-900 rounded-2xl transition-colors duration-150">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shrink-0">
                    {getIcon(fc.status)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{fc.day}</h4>
                    <p className="text-[10px] text-slate-500">{fc.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Expected Temp</span>
                    <span className="text-xs font-bold text-slate-300">{fc.temp}°C</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block uppercase font-semibold">Precipitation</span>
                    <span className="text-xs font-bold text-sky-400">{fc.rain} mm</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600 hidden sm:block"/>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>);
};
export default Weather;
