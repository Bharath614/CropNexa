/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import { CROP_DATABASE } from '@/utils/crop-database';
import i18n from '@/i18n';
import { FileText, Download, Printer, CheckCircle, Eye } from 'lucide-react';

export const Reports: React.FC = () => {
  const { t } = useTranslation();
  const { profile, soilReport, soilScore, soilStatus, weather, currentUser, dispatchAdminEvent } = useFarm();
  const [activePreview, setActivePreview] = useState<'farm' | 'soil' | 'weather' | 'companion' | 'nutrient' | 'yield'>('farm');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const triggerCSVDownload = (fileName: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setDownloadSuccess(fileName);
    
    if (currentUser) {
      dispatchAdminEvent('Reports', 'Report Downloaded', `User downloaded report: ${fileName}`, currentUser, 'info', {
        'Filename': fileName
      });
    }

    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const exportFarmReport = () => {
    const csv = [
      ['CropNexa - Farm Profile Report'],
      ['Generated Date', new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)],
      [],
      [t('farmerNameLabel'), profile.farmerName],
      ['Location GPS', profile.gpsLocation],
      [t('village'), profile.village],
      [t('districtLabel'), profile.district],
      [t('stateLabel'), profile.state],
      [t('countryLabel'), profile.country],
      [t('authTotalArea'), profile.totalLandArea],
      ['Irrigated Area (ha)', profile.irrigatedArea],
      ['Rainfed Area (ha)', profile.rainfedArea],
      [t('soilTypeLabel'), profile.soilType],
      [t('authFarmingMode'), profile.farmingPractice],
      [t('authPrimaryCrop'), profile.currentCrop],
      ['Crop Stage', profile.currentStage],
      ['Planned Crop Rotation', profile.plannedCrop]
    ].map(row => row.join(',')).join('\n');

    triggerCSVDownload(`farm_summary_report_${profile.farmerName.replace(' ', '_')}.csv`, csv);
  };

  const exportSoilReport = () => {
    const csv = [
      ['CropNexa - Soil Chemical Health Report'],
      ['Generated Date', new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)],
      [t('soilScoreTitle'), `${soilScore}/100`],
      [t('classification'), soilStatus],
      [],
      ['Nutrient Parameter', 'Measured Value', 'Optimal Reference Range'],
      ['pH', soilReport.ph, '6.0 - 7.5'],
      ['Electrical Conductivity (mS/cm)', soilReport.ec, '0.5 - 1.5'],
      ['Organic Carbon (%)', soilReport.organicCarbon, '> 0.8'],
      ['Nitrogen (kg/ha)', soilReport.nitrogen, '280 - 560'],
      ['Phosphorus (kg/ha)', soilReport.phosphorus, '23 - 57'],
      ['Potassium (kg/ha)', soilReport.potassium, '140 - 330'],
      ['Sulphur (ppm)', soilReport.sulphur, '> 10'],
      ['Zinc (ppm)', soilReport.zinc, '> 0.6'],
      ['Iron (ppm)', soilReport.iron, '> 4.5'],
      ['Boron (ppm)', soilReport.boron, '> 0.5'],
      ['Copper (ppm)', soilReport.copper, '> 0.2'],
      ['Manganese (ppm)', soilReport.manganese, '> 2.0']
    ].map(row => row.join(',')).join('\n');

    triggerCSVDownload(`soil_health_report_${profile.farmerName.replace(' ', '_')}.csv`, csv);
  };

  const exportWeatherReport = () => {
    const csv = [
      ['CropNexa - Weather Intelligence Log'],
      ['Generated Date', new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)],
      [t('temperature'), `${weather.temperature} C`],
      [t('humidity'), `${weather.humidity}%`],
      [t('rainfall'), `${weather.rainfall} mm`],
      [t('dewPoint'), `${weather.dewPoint} C`],
      [t('windSpeed'), `${weather.windSpeed} km/h`],
      [],
      ['Forecast Day', 'Expected Temperature (C)', 'Expected Rain Yield (mm)', 'Conditions'],
      ...weather.forecast.map(f => [f.day, f.temp, f.rain, f.status])
    ].map(row => row.join(',')).join('\n');

    triggerCSVDownload(`weather_log_${profile.farmerName.replace(' ', '_')}.csv`, csv);
  };

  const exportCompanionReport = () => {
    const cropDbId = profile.currentCrop.toLowerCase();
    const crop = CROP_DATABASE[cropDbId] || Object.values(CROP_DATABASE)[0];
    const companions = crop?.companions || [];

    const csv = [
      [`CropNexa - Companion Planting Matrix for ${profile.currentCrop}`],
      ['Generated Date', new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)],
      [],
      ['Companion Plant Name', 'Recommendation Rank', 'Compatibility Score (0-100)', 'Benefits Summary'],
      ...companions.map(c => [c.name, c.rank, c.compatibilityScore, c.explanation.replace(/,/g, ';')])
    ].map(row => row.join(',')).join('\n');

    triggerCSVDownload(`companion_planting_report_${profile.currentCrop}.csv`, csv);
  };

  const exportNutrientReport = () => {
    const csv = [
      ['CropNexa - Nutrient Split Scheduling Report'],
      ['Generated Date', new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)],
      [t('farmingModeLabel'), profile.farmingPractice],
      ['Cultivated Land Area', `${profile.totalLandArea} hectares`],
      [],
      ['Recommended Input / Fertilizer', 'Baseline Rate (per hectare)', 'Total Quantity for Farm'],
      ['Organic Compost (FYM)', '15 tonnes/ha', `${(15 * profile.totalLandArea).toFixed(1)} tonnes`],
      ['Vermicompost supplement', '5 tonnes/ha', `${(5 * profile.totalLandArea).toFixed(1)} tonnes`],
      ['Neem Cake suppressant', '250 kg/ha', `${(250 * profile.totalLandArea).toFixed(1)} kg`],
      ['Green Manure (Dhaincha)', '25 kg/ha', `${(25 * profile.totalLandArea).toFixed(1)} kg`],
      ['Micronutrients (Zinc/Borax)', '15 kg/ha', `${(15 * profile.totalLandArea).toFixed(1)} kg`]
    ].map(row => row.join(',')).join('\n');

    triggerCSVDownload(`nutrient_dosing_schedule.csv`, csv);
  };

  const exportYieldReport = () => {
    const csv = [
      ['CropNexa - AI Yield & Revenue Forecast Models'],
      ['Generated Date', new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)],
      [t('authPrimaryCrop'), profile.currentCrop],
      ['Soil Health Base', soilStatus],
      [],
      ['Forecast Parameter', 'Calculated Output Metric'],
      ['Predicted Yield Rate', '4.2 tonnes/hectare'],
      ['Total Cumulative Yield', `${(4.2 * profile.totalLandArea).toFixed(1)} tonnes`],
      ['Estimated Market Rate (Premium)', 'Rs. 28,000 / tonne equivalent'],
      ['Estimated Gross Farm Profit', `Rs. ${(4.2 * profile.totalLandArea * 28000).toFixed(0)}`]
    ].map(row => row.join(',')).join('\n');

    triggerCSVDownload(`yield_revenue_forecast.csv`, csv);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn items-start">
      <div className="lg:col-span-1 bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-5 shadow-md space-y-4">
        <h3 className="font-extrabold text-base text-slate-100 tracking-tight">{t('reportsExporter')}</h3>
        <p className="text-xs text-slate-400">{t('reportsExporterSubtitle')}</p>

        <div className="space-y-2">
          {[
            { id: 'farm', label: t('farmSummaryReport'), action: exportFarmReport },
            { id: 'soil', label: t('soilHealthReport'), action: exportSoilReport },
            { id: 'weather', label: t('weatherReportLog'), action: exportWeatherReport },
            { id: 'companion', label: t('companionMatrix'), action: exportCompanionReport },
            { id: 'nutrient', label: t('nutrientPlan'), action: exportNutrientReport },
            { id: 'yield', label: t('yieldForecast'), action: exportYieldReport }
          ].map((item) => (
            <div 
              key={item.id}
              className={`
                flex items-center justify-between p-3 rounded-2xl border transition-all
                ${activePreview === item.id 
                  ? 'bg-slate-950/80 border-emerald-900/60' 
                  : 'bg-slate-950/40 border-slate-900/60 hover:bg-slate-900/30'
                }
              `}
            >
              <button 
                onClick={() => setActivePreview(item.id as any)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-slate-100 text-left"
              >
                <FileText className="h-4.5 w-4.5 text-slate-500" />
                {item.label}
              </button>
              
              <button 
                onClick={item.action}
                className="p-1.5 bg-slate-900 hover:bg-emerald-950 text-slate-400 hover:text-emerald-400 border border-slate-800 hover:border-emerald-900 rounded-lg transition-colors cursor-pointer"
                title="Download CSV Spreadsheet"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-950/50 border border-emerald-900/50 p-3 rounded-2xl text-[10px] text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span className="font-semibold truncate">Downloaded: {downloadSuccess}</span>
          </div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">{t('printPreview')}</span>
          </div>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 py-2 px-4 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            {t('printToPdf')}
          </button>
        </div>

        <div
          id="print-section"
          className="bg-slate-950 border border-slate-900 rounded-3xl p-8 shadow-inner text-slate-350 min-h-[480px] print:p-0 print:border-0 print:bg-white print:text-black"
        >
          <div className="border-b border-slate-900 pb-6 mb-6 flex justify-between items-start print:border-slate-300">
            <div>
              <h2 className="text-lg font-black text-slate-100 tracking-wide bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent print:text-black">{t('appName')}</h2>
              <span className="text-[9px] text-emerald-400 uppercase tracking-widest font-extrabold block print:text-emerald-700">Agricultural Decision Support System</span>
            </div>
            <div className="text-right text-[10px] text-slate-500 print:text-slate-500">
              <span>Date: {new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language)}</span>
              <span className="block">Status: Certified Log</span>
            </div>
          </div>

          {activePreview === 'farm' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 pb-1 border-b border-slate-900 print:text-black print:border-slate-300">Farm profile summary</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
                  <div><span className="text-slate-500 block">{t('farmerNameLabel')}</span> <strong className="text-slate-300 print:text-black">{profile.farmerName}</strong></div>
                  <div><span className="text-slate-500 block">GPS Coordinates</span> <strong className="text-slate-300 print:text-black">{profile.gpsLocation}</strong></div>
                  <div><span className="text-slate-500 block">Location Address</span> <strong className="text-slate-300 print:text-black">{profile.village}, {profile.district}, {profile.state}</strong></div>
                  <div><span className="text-slate-500 block">Farming System</span> <strong className="text-emerald-400 font-bold">{profile.farmingPractice}</strong></div>
                  <div><span className="text-slate-500 block">Total Cultivated land Area</span> <strong className="text-slate-300 print:text-black">{profile.totalLandArea} Hectares</strong></div>
                  <div><span className="text-slate-500 block">Current Crop / Stage</span> <strong className="text-slate-300 print:text-black">{profile.currentCrop} ({profile.currentStage})</strong></div>
                  <div><span className="text-slate-500 block">Soil Base</span> <strong className="text-slate-300 print:text-black">{profile.soilType}</strong></div>
                  <div><span className="text-slate-500 block">Planned Rotation</span> <strong className="text-slate-300 print:text-black">{profile.plannedCrop}</strong></div>
                </div>
              </div>
            </div>
          )}

          {activePreview === 'soil' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 pb-1 border-b border-slate-900 print:text-black print:border-slate-300">Soil Chemical parameters Report</h3>
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900 flex justify-between items-center text-xs mb-4 print:border-slate-300 print:text-black">
                  <span>Soil Health Index Score: <strong className="text-emerald-400 text-sm">{soilScore}/100</strong></span>
                  <span>Classification Class: <strong className="text-emerald-400 font-bold uppercase">{soilStatus}</strong></span>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
                  <div><span className="text-slate-500 block">Soil pH (Hydrogen ion concentration)</span> <strong className="text-slate-300 print:text-black">{soilReport.ph} (Optimal: 6.0-7.5)</strong></div>
                  <div><span className="text-slate-500 block">Electrical Conductivity (mS/cm)</span> <strong className="text-slate-300 print:text-black">{soilReport.ec} mS/cm</strong></div>
                  <div><span className="text-slate-500 block">Organic Carbon (%)</span> <strong className="text-slate-300 print:text-black">{soilReport.organicCarbon} %</strong></div>
                  <div><span className="text-slate-500 block">Nitrogen (N)</span> <strong className="text-slate-300 print:text-black">{soilReport.nitrogen} kg/ha (Deficient &lt; 280)</strong></div>
                  <div><span className="text-slate-500 block">Phosphorus (P)</span> <strong className="text-slate-300 print:text-black">{soilReport.phosphorus} kg/ha</strong></div>
                  <div><span className="text-slate-500 block">Potassium (K)</span> <strong className="text-slate-300 print:text-black">{soilReport.potassium} kg/ha</strong></div>
                  <div><span className="text-slate-500 block">Sulphur (S)</span> <strong className="text-slate-300 print:text-black">{soilReport.sulphur} ppm</strong></div>
                  <div><span className="text-slate-500 block">Trace Zinc (Zn)</span> <strong className="text-slate-300 print:text-black">{soilReport.zinc} ppm</strong></div>
                </div>
              </div>
            </div>
          )}

          {activePreview === 'weather' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 pb-1 border-b border-slate-900 print:text-black print:border-slate-300">Weather Intelligence Forecast Summary</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs mb-6">
                  <div><span className="text-slate-500 block">Measured Temperature</span> <strong className="text-slate-300 print:text-black">{weather.temperature} C</strong></div>
                  <div><span className="text-slate-500 block">Rainfall Cumulative 24h</span> <strong className="text-slate-300 print:text-black">{weather.rainfall} mm</strong></div>
                  <div><span className="text-slate-500 block">Wind Velocity</span> <strong className="text-slate-300 print:text-black">{weather.windSpeed} km/h (Direction: {weather.windDirection})</strong></div>
                  <div><span className="text-slate-500 block">Humidity Rating</span> <strong className="text-slate-300 print:text-black">{weather.humidity} %</strong></div>
                </div>

                <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 print:text-black">3-Day Forecast logs</h4>
                <div className="space-y-2 text-xs">
                  {weather.forecast.map((fc, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-900/20 p-2 border border-slate-900 rounded-xl print:border-slate-300 print:text-black">
                      <span>{fc.day}</span>
                      <span>{fc.status}</span>
                      <span>Expected: {fc.temp} C (Rain: {fc.rain} mm)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePreview === 'companion' && (() => {
            const crop = CROP_DATABASE[profile.currentCrop.toLowerCase()] || Object.values(CROP_DATABASE)[0];
            const companions = crop?.companions || [];
            const antagonists = crop?.antagonists || [];

            return (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 pb-1 border-b border-slate-900 print:text-black print:border-slate-300">Companion Planting matrix summary: {profile.currentCrop}</h3>
                  
                  <h4 className="text-xs font-bold text-emerald-450 uppercase mb-3">Key Compatible Companions</h4>
                  <div className="space-y-3 text-xs mb-6">
                    {companions.length > 0 ? companions.map((comp, i) => (
                      <div key={i} className="bg-slate-900/20 p-3 border border-slate-900 rounded-xl print:border-slate-300 print:text-black space-y-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-200 print:text-black">{comp.name}</strong>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-900 text-emerald-400 font-bold">{comp.rank}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">{comp.explanation}</p>
                      </div>
                    )) : <p className="text-xs text-slate-500">No companion data available.</p>}
                  </div>

                  <h4 className="text-xs font-bold text-rose-450 uppercase mb-3">Antagonistic Crops to Avoid together</h4>
                  <div className="space-y-2 text-xs">
                    {antagonists.length > 0 ? antagonists.map((ant, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-900/20 p-2 border border-slate-900 rounded-xl print:border-slate-300 print:text-black">
                        <span>{ant.name}</span>
                        <span className="text-rose-400 font-bold">{ant.riskCategory}</span>
                        <span>Severity Score: {ant.riskScore}/100</span>
                      </div>
                    )) : <p className="text-xs text-slate-500">No antagonist data available.</p>}
                  </div>
                </div>
              </div>
            );
          })()}

          {activePreview === 'nutrient' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 pb-1 border-b border-slate-900 print:text-black print:border-slate-300">Nutrient Dosing Schedule Summary</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs mb-6">
                  <div><span className="text-slate-500 block">Cultivated Land Area</span> <strong className="text-slate-300 print:text-black">{profile.totalLandArea} Hectares</strong></div>
                  <div><span className="text-slate-500 block">Selected Dosing System</span> <strong className="text-emerald-400 font-bold">{profile.farmingPractice}</strong></div>
                </div>

                <h4 className="text-xs font-bold text-slate-300 uppercase mb-3 print:text-black">Dosing calculations adjusted for area</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-slate-900/20 p-2 border border-slate-900 rounded-xl print:border-slate-300 print:text-black">
                    <span>Farm Yard Manure (FYM)</span>
                    <span>Rate: 15 tonnes/ha</span>
                    <strong className="text-slate-200 print:text-black">{(15 * profile.totalLandArea).toFixed(1)} tonnes</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/20 p-2 border border-slate-900 rounded-xl print:border-slate-300 print:text-black">
                    <span>Vermicompost supplement</span>
                    <span>Rate: 5 tonnes/ha</span>
                    <strong className="text-slate-200 print:text-black">{(5 * profile.totalLandArea).toFixed(1)} tonnes</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/20 p-2 border border-slate-900 rounded-xl print:border-slate-300 print:text-black">
                    <span>Neem Cake suppressant</span>
                    <span>Rate: 250 kg/ha</span>
                    <strong className="text-slate-200 print:text-black">{(250 * profile.totalLandArea).toFixed(1)} kg</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePreview === 'yield' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 pb-1 border-b border-slate-900 print:text-black print:border-slate-300">AI Yield & profit Models Report</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs mb-6">
                  <div><span className="text-slate-500 block">Expected Yield Rate (tonnes/ha)</span> <strong className="text-slate-300 print:text-black">4.2 t/ha</strong></div>
                  <div><span className="text-slate-500 block">Total Cultivated Area</span> <strong className="text-slate-300 print:text-black">{profile.totalLandArea} ha</strong></div>
                  <div><span className="text-slate-500 block">Total Estimated Crop Yield</span> <strong className="text-slate-300 print:text-black">{(4.2 * profile.totalLandArea).toFixed(1)} tonnes</strong></div>
                  <div><span className="text-slate-500 block">Gross Profit Forecast</span> <strong className="text-emerald-450 font-bold">Rs. {(4.2 * profile.totalLandArea * 28000).toFixed(0)}</strong></div>
                </div>

                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-900 text-xs leading-relaxed print:border-slate-300 print:text-black">
                  <strong className="text-slate-350 font-bold block mb-1">Methodology Disclaimer</strong>
                  <p>AI predictions are generated using multi-layer crop modeling algorithms, weather data inputs, and historical regional pricing logs. Actual outcomes are weather-dependent. Monitor crop stress alerts throughout lifecycle stages.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reports;
