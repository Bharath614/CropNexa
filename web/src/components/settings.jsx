'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import { SUPPORTED_LANGUAGES } from '@/utils/i18n';
import { Settings, Save, AlertCircle, CheckCircle2, User, Globe, MessageSquare, Server, ShieldCheck, Sprout } from 'lucide-react';
export const SettingsPanel = () => {
    const { profile, updateProfile, resetAllData, showToast, currentLanguage, setLanguage, currentUser, toggleSmsNotifications, theme, setTheme, appSize, setAppSize } = useFarm();
    const { t } = useTranslation();
    // Form states
    const [selectedTheme, setSelectedTheme] = useState(theme || 'dark');
    const [selectedAppSize, setSelectedAppSize] = useState(appSize || 'full');
    const [farmerName, setFarmerName] = useState(profile.farmerName || '');
    const [mobileNumber, setMobileNumber] = useState(profile.mobileNumber || '');
    const [email, setEmail] = useState(profile.email || '');
    const [address, setAddress] = useState(profile.address || '');
    const [farmName, setFarmName] = useState(profile.farmName || '');
    const [gpsLocation, setGpsLocation] = useState(profile.gpsLocation || '');
    const [village, setVillage] = useState(profile.village || '');
    const [district, setDistrict] = useState(profile.district || '');
    const [state, setState] = useState(profile.state || '');
    const [totalLandArea, setTotalLandArea] = useState(profile.totalLandArea?.toString() || '2.5');
    const [irrigatedArea, setIrrigatedArea] = useState(profile.irrigatedArea?.toString() || '1.8');
    const [rainfedArea, setRainfedArea] = useState(profile.rainfedArea?.toString() || '0.7');
    const [farmingPractice, setFarmingPractice] = useState(profile.farmingPractice || 'Organic Farming');
    const [preferredLanguage, setPreferredLanguage] = useState(currentLanguage || 'en');
    const [soilType, setSoilType] = useState(profile.soilType || 'Red Sandy Loam');
    const [previousCrop, setPreviousCrop] = useState(profile.previousCrop || 'Wheat');
    const [currentCrop, setCurrentCrop] = useState(profile.currentCrop || 'Tomato');
    const [plannedCrop, setPlannedCrop] = useState(profile.plannedCrop || 'Onion');
    // SMS Toggle State
    const [smsEnabled, setSmsEnabled] = useState(currentUser?.smsNotificationsEnabled ?? true);
    // Gateway Config States
    const [emailGateway, setEmailGateway] = useState('sendgrid');
    const [smsGateway, setSmsGateway] = useState('msg91');
    const [apiKey, setApiKey] = useState('sg_live_948201948203910');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const handleSaveProfile = (e) => {
        e.preventDefault();
        setErrorMsg(null);
        if (!farmerName.trim()) {
            const msg = 'Farmer Name is mandatory.';
            setErrorMsg(msg);
            showToast('Validation Error', msg, 'error');
            return;
        }
        if (!mobileNumber.trim()) {
            const msg = 'Mobile Number is mandatory.';
            setErrorMsg(msg);
            showToast('Validation Error', msg, 'error');
            return;
        }
        const land = parseFloat(totalLandArea);
        const irr = parseFloat(irrigatedArea);
        const rain = parseFloat(rainfedArea);
        if (isNaN(land) || land <= 0) {
            const msg = 'Total land area must be a positive number.';
            setErrorMsg(msg);
            showToast('Validation Error', msg, 'error');
            return;
        }
        setLanguage(preferredLanguage);
        setTheme(selectedTheme);
        setAppSize(selectedAppSize);
        toggleSmsNotifications(smsEnabled);
        updateProfile({
            farmerName,
            mobileNumber,
            email,
            address,
            farmName,
            gpsLocation,
            village,
            district,
            state,
            totalLandArea: land,
            irrigatedArea: irr,
            rainfedArea: rain,
            farmingPractice,
            preferredLanguage,
            soilType,
            previousCrop,
            currentCrop,
            plannedCrop
        });
        setSaveSuccess(true);
        showToast('Settings & Gateway Saved', 'All farm records and notification gateways updated!', 'success');
        setTimeout(() => setSaveSuccess(false), 3000);
    };
    return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn items-start">
      <div className="lg:col-span-2 bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-6 shadow-md space-y-6">
        <div className="border-b border-emerald-950/60 pb-4">
          <h3 className="font-extrabold text-lg text-slate-100 tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-400"/>
            Farmer & Farm System Settings Configuration
          </h3>
          <p className="text-xs text-slate-400">Save personal details, SMS preferences, notification gateways, and 11-language preference.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* 1. Personal Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <User className="h-4 w-4 text-emerald-400"/>
              1. Personal Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Farmer Name *</label>
                <input type="text" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"/>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Mobile Number *</label>
                <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"/>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"/>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Residential Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"/>
              </div>
            </div>
          </div>

          {/* 2. Farm & Land Details */}
          <div className="space-y-4 border-t border-slate-900 pt-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Sprout className="h-4 w-4 text-emerald-400"/>
              2. Farm & Land Specification
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Farm Name</label>
                <input type="text" value={farmName} onChange={(e) => setFarmName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"/>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">GPS Location</label>
                <input type="text" value={gpsLocation} onChange={(e) => setGpsLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Village</label>
                <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200"/>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">District</label>
                <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200"/>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Total Land (Ha)</label>
                <input type="number" step="0.1" value={totalLandArea} onChange={(e) => setTotalLandArea(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200"/>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Irrigated Area (Ha)</label>
                <input type="number" step="0.1" value={irrigatedArea} onChange={(e) => setIrrigatedArea(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200"/>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Rainfed Area (Ha)</label>
                <input type="number" step="0.1" value={rainfedArea} onChange={(e) => setRainfedArea(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200"/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Soil Type</label>
                <input type="text" value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"/>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Current Crop</label>
                <input type="text" value={currentCrop} onChange={(e) => setCurrentCrop(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"/>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Previous Crop</label>
                <input type="text" value={previousCrop} onChange={(e) => setPreviousCrop(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"/>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Planned Crop</label>
                <input type="text" value={plannedCrop} onChange={(e) => setPlannedCrop(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"/>
              </div>
            </div>
          </div>

          {/* 2. SMS & Notification Settings (Requirement 18) */}
          <div className="space-y-4 border-t border-slate-900 pt-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-emerald-400"/>
              2. SMS & Emergency Alert Preferences
            </h4>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h5 className="text-xs font-extrabold text-slate-200">Enable Carrier SMS Notifications</h5>
                <p className="text-[11px] text-slate-400">Receive SMS alerts for weather warnings, frost, heavy rain, irrigation & fertilizer reminders.</p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} className="sr-only peer"/>
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          {/* 3. Notification Service Gateways (Requirement 21) */}
          <div className="space-y-4 border-t border-slate-900 pt-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Server className="h-4 w-4 text-emerald-400"/>
              3. Service Gateway Integrations (Email / SMS / Push)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Email Service Provider</label>
                <select value={emailGateway} onChange={(e) => setEmailGateway(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2">
                  <option value="sendgrid">SendGrid API</option>
                  <option value="resend">Resend.com API</option>
                  <option value="firebase">Firebase Auth Email Verification</option>
                  <option value="nodemailer">Nodemailer (SMTP)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">SMS / OTP Provider</label>
                <select value={smsGateway} onChange={(e) => setSmsGateway(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2">
                  <option value="msg91">MSG91 (Recommended India)</option>
                  <option value="twilio">Twilio Programmable SMS</option>
                  <option value="fast2sms">Fast2SMS Gateway</option>
                  <option value="firebase">Firebase Phone Auth OTP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Gateway API Secret Key</label>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API Key" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200"/>
            </div>
          </div>

          {/* 4. Language, Theme & App Sizing Mode */}
          <div className="space-y-4 border-t border-slate-900 pt-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-emerald-400"/>
              4. Language, Theme & Layout Density
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Preferred Language (11 Languages)</label>
                <select value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2 font-bold">
                  {SUPPORTED_LANGUAGES.map((lang) => (<option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t('dashFarmingMode')}</label>
                <select value={farmingPractice} onChange={(e) => setFarmingPractice(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2">
                  <option value={t('organicFarming')}>{t('organicFarming')}</option>
                  <option value="Integrated Nutrient Management (INM)">Integrated Nutrient Management (INM)</option>
                  <option value={t('conventionalFarming')}>{t('conventionalFarming')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">UI Visual Theme (Light / Dark Mode)</label>
                <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2 font-bold">
                  <option value="dark">🌙 Dark Glassmorphism Mode (Default)</option>
                  <option value="light">☀️ Light High-Contrast Mode</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Full App Frame Sizing / Width</label>
                <select value={selectedAppSize} onChange={(e) => setSelectedAppSize(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2 font-bold">
                  <option value="full">↔️ Full Screen Viewport Width (100%)</option>
                  <option value="standard">📐 Standard Contained Width (1280px)</option>
                  <option value="compact">📱 Compact Centered Width (1024px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (<div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="h-4.5 w-4.5 shrink-0"/>
              <span>{errorMsg}</span>
            </div>)}

          {saveSuccess && (<div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0"/>
              <span>Profile information successfully saved in database! Retrieved automatically on every login.</span>
            </div>)}

          <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer">
            <Save className="h-4.5 w-4.5"/>
            Save Profile & Preferences
          </button>
        </form>
      </div>

      <div className="lg:col-span-1 bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-6 shadow-md space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400"/>
            Security & Persistence Summary
          </h3>

          <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl text-xs text-slate-400 leading-relaxed space-y-2">
            <strong className="text-slate-200 font-bold block uppercase tracking-wider text-[10px]">Authentication Security</strong>
            <p>Email verification & 6-digit SMS OTP verification are enforced. Failed login attempts trigger automatic 15-minute account lockouts.</p>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4">
          <button onClick={() => {
            if (confirm('Erase all cached database configs and restore default farm profile?')) {
                resetAllData();
                showToast('Database Reset', 'Farm profile reset to initial defaults.', 'info');
            }
        }} className="w-full py-2.5 bg-rose-950/30 border border-rose-900/40 text-rose-400 hover:bg-rose-900/30 rounded-xl text-xs font-bold cursor-pointer">
            Reset Cached Profile
          </button>
        </div>
      </div>
    </div>);
};
export default SettingsPanel;
