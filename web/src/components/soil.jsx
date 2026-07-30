/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useRef } from 'react';
import { useFarm } from '@/context/farm-context';
import { Gauge } from './ui/gauge';
import { parseSoilReportFile } from '@/utils/soil-ocr-parser';
import { useTranslation } from 'react-i18next';
import { UploadCloud, CheckCircle2, Lightbulb, Sparkles, Trash2, RefreshCw, Edit3, Save, Sprout, Dna, Layers } from 'lucide-react';
export const Soil = () => {
    const { soilReport, soilScore, soilStatus, soilEvaluation, updateSoilReport, profile, showToast, currentUser, dispatchAdminEvent } = useFarm();
    const fileInputRef = useRef(null);
    const { t } = useTranslation();
    // File upload state
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    // Manual editing state for all 12 metrics
    const [isEditingMetrics, setIsEditingMetrics] = useState(false);
    const [formData, setFormData] = useState(soilReport);
    const nutrients = [
        { key: 'ph', name: 'Soil pH', symbol: 'pH', measured: `${soilReport.ph}`, ideal: '6.0 - 7.5', unit: '', maxGraph: 14 },
        { key: 'ec', name: 'Electrical Conductivity', symbol: 'EC', measured: `${soilReport.ec}`, ideal: '0.5 - 1.5', unit: 'mS/cm', maxGraph: 3.0 },
        { key: 'organicCarbon', name: 'Organic Carbon', symbol: 'OC', measured: `${soilReport.organicCarbon}`, ideal: '> 0.8', unit: '%', maxGraph: 2.0 },
        { key: 'nitrogen', name: 'Nitrogen', symbol: 'N', measured: `${soilReport.nitrogen}`, ideal: '280 - 560', unit: 'kg/ha', maxGraph: 600 },
        { key: 'phosphorus', name: 'Phosphorus', symbol: 'P', measured: `${soilReport.phosphorus}`, ideal: '23 - 57', unit: 'kg/ha', maxGraph: 80 },
        { key: 'potassium', name: 'Potassium', symbol: 'K', measured: `${soilReport.potassium}`, ideal: '140 - 330', unit: 'kg/ha', maxGraph: 400 },
        { key: 'sulphur', name: 'Sulphur', symbol: 'S', measured: `${soilReport.sulphur}`, ideal: '> 10', unit: 'ppm', maxGraph: 25 },
        { key: 'zinc', name: 'Zinc', symbol: 'Zn', measured: `${soilReport.zinc}`, ideal: '> 0.6', unit: 'ppm', maxGraph: 2.0 },
        { key: 'iron', name: 'Iron', symbol: 'Fe', measured: `${soilReport.iron}`, ideal: '> 4.5', unit: 'ppm', maxGraph: 10.0 },
        { key: 'boron', name: 'Boron', symbol: 'B', measured: `${soilReport.boron}`, ideal: '> 0.5', unit: 'ppm', maxGraph: 1.5 },
        { key: 'copper', name: 'Copper', symbol: 'Cu', measured: `${soilReport.copper}`, ideal: '> 0.2', unit: 'ppm', maxGraph: 1.0 },
        { key: 'manganese', name: 'Manganese', symbol: 'Mn', measured: `${soilReport.manganese}`, ideal: '> 2.0', unit: 'ppm', maxGraph: 8.0 }
    ];
    // Helper for deficiency status styling
    const getDeficiencyStatus = (nut) => {
        const val = soilReport[nut.key];
        if (nut.key === 'ph') {
            if (val < 6.0)
                return { label: 'Acidic', color: 'text-amber-400 bg-amber-950/40 border-amber-900/50' };
            if (val > 7.5)
                return { label: 'Alkaline', color: 'text-purple-400 bg-purple-950/40 border-purple-900/50' };
            return { label: 'Optimal', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' };
        }
        if (nut.key === 'ec') {
            if (val > 1.8)
                return { label: 'Saline High', color: 'text-rose-400 bg-rose-950/40 border-rose-900/50' };
            return { label: 'Normal', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' };
        }
        if (nut.key === 'organicCarbon') {
            if (val < 0.5)
                return { label: 'Deficient (Low)', color: 'text-rose-400 bg-rose-950/40 border-rose-900/50' };
            if (val < 0.8)
                return { label: 'Moderate', color: 'text-amber-400 bg-amber-950/40 border-amber-900/50' };
            return { label: 'Optimal', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' };
        }
        if (nut.key === 'nitrogen') {
            if (val < 280)
                return { label: 'Low (Deficient)', color: 'text-rose-400 bg-rose-950/40 border-rose-900/50' };
            return { label: 'Optimal', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' };
        }
        if (nut.key === 'phosphorus') {
            if (val < 23)
                return { label: 'Low (Deficient)', color: 'text-rose-400 bg-rose-950/40 border-rose-900/50' };
            return { label: 'Optimal', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' };
        }
        if (nut.key === 'potassium') {
            if (val < 140)
                return { label: 'Low (Deficient)', color: 'text-rose-400 bg-rose-950/40 border-rose-900/50' };
            return { label: 'Optimal', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' };
        }
        const targetMin = parseFloat(nut.ideal.replace('> ', ''));
        if (val < targetMin)
            return { label: 'Deficient', color: 'text-amber-400 bg-amber-950/40 border-amber-900/50' };
        return { label: 'Optimal', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' };
    };
    // OCR File Upload Handler
    const handleProcessFile = async (file) => {
        setIsProcessing(true);
        const result = await parseSoilReportFile(file);
        setIsProcessing(false);
        if (!result.success) {
            showToast('Parsing Failed', result.error || 'Could not parse report.', 'error');
            return;
        }
        let previewUrl = undefined;
        if (file.type.startsWith('image/')) {
            previewUrl = URL.createObjectURL(file);
        }
        setUploadedFile({
            name: result.fileName,
            size: result.fileSizeFormatted,
            type: result.fileType,
            extractedCount: result.extractedFieldsCount,
            previewUrl
        });
        updateSoilReport(result.data);
        setFormData(prev => ({ ...prev, ...result.data }));
        if (currentUser) {
            dispatchAdminEvent('Soil Health', 'Uploads a soil report', `User uploaded a soil report: ${result.fileName}`, currentUser, 'success', {
                'Score': soilScore.toString(),
                'Filename': result.fileName
            });
        }
        showToast('Soil Report OCR Complete', `Extracted ${result.extractedFieldsCount} parameters from ${result.fileName}. Score updated!`, 'success');
    };
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleProcessFile(e.target.files[0]);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleProcessFile(e.dataTransfer.files[0]);
        }
    };
    const handleDeleteFile = () => {
        if (uploadedFile?.previewUrl) {
            URL.revokeObjectURL(uploadedFile.previewUrl);
        }
        if (currentUser && uploadedFile) {
            dispatchAdminEvent('Soil Health', 'Deletes a soil report', `User deleted the soil report: ${uploadedFile.name}`, currentUser, 'warning');
        }
        setUploadedFile(null);
        showToast('File Removed', 'Uploaded report file removed.', 'info');
    };
    const handleSaveManualEntry = (e) => {
        e.preventDefault();
        updateSoilReport(formData);
        setIsEditingMetrics(false);
        showToast('Soil Metrics Saved', 'Soil Health Score and recommendations recalculated!', 'success');
    };
    const getBadgeColor = (status) => {
        switch (status) {
            case 'Excellent': return 'bg-emerald-950 text-emerald-300 border-emerald-800';
            case 'Good': return 'bg-teal-950 text-teal-300 border-teal-800';
            case 'Moderate': return 'bg-amber-950 text-amber-300 border-amber-800';
            case 'Poor': return 'bg-orange-950 text-orange-300 border-orange-800';
            default: return 'bg-rose-950 text-rose-300 border-rose-800';
        }
    };
    return (<div className="space-y-6 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-950/60 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <Sparkles className="h-4 w-4"/>
            <span>{t('soilTitle')}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Dynamic Soil Health Analysis</h2>
          <p className="text-xs text-slate-400">12-Parameter Chemical Evaluation • OCR Report Reader • Live Score Recalculation</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setIsEditingMetrics(!isEditingMetrics)} className="flex items-center gap-2 px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md">
            <Edit3 className="h-4 w-4"/>
            <span>{isEditingMetrics ? 'View Dashboard Grid' : 'Edit 12 Metrics Manually'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Soil Health Score Gauge & OCR File Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge Score Card */}
        <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-6 shadow-lg flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('soilScoreTitle')}</h3>
          
          <Gauge value={soilScore} title="Soil Health Index" subtitle={soilStatus} size={150}/>

          <div className="w-full space-y-2">
            <div className="bg-slate-950/80 border border-slate-900 px-4 py-3 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Calculated Score:</span>
                <span className="text-emerald-400 font-extrabold text-sm">{soilScore} / 100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Classification:</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${getBadgeColor(soilStatus)}`}>
                  {soilStatus}
                </span>
              </div>
            </div>

            {/* Microbial Activity Status */}
            <div className="bg-emerald-950/30 border border-emerald-900/40 p-3 rounded-2xl text-[11px] text-emerald-300 flex items-center gap-2">
              <Dna className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse"/>
              <div className="text-left">
                <span className="block font-bold text-emerald-400">{soilEvaluation.microbialHealth}</span>
                <span className="text-[10px] text-slate-400">Based on Organic Carbon ({soilReport.organicCarbon}%) & NPK ratio</span>
              </div>
            </div>
          </div>
        </div>

        {/* OCR File Uploader */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 tracking-tight">{t('soilUploadTitle')}</h3>
              <p className="text-xs text-slate-400">{t('soilUploadSubtitle')}</p>
            </div>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png" className="hidden"/>

          {!uploadedFile ? (<div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`
                border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[170px]
                ${isDragging
                ? 'border-emerald-400 bg-emerald-950/30'
                : 'border-slate-800 bg-slate-950/40 hover:bg-slate-900/40 hover:border-emerald-900'}
              `}>
              <UploadCloud className="h-10 w-10 text-emerald-400 mb-2 animate-bounce"/>
              <span className="text-xs font-bold text-slate-200 block mb-1">Click or Drag & Drop Soil Test Report</span>
              <span className="text-[10px] text-slate-400 block mb-3">Supports PDF, JPG, JPEG, PNG (Up to 10 MB)</span>

              {isProcessing && (<div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800 animate-pulse">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin"/>
                  <span>Scanning & Extracting Chemistry Metrics...</span>
                </div>)}
            </div>) : (<div className="bg-slate-950/80 border border-emerald-900/60 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-950 text-emerald-400 p-2.5 rounded-xl border border-emerald-800">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400"/>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-200 truncate max-w-xs">{uploadedFile.name}</h4>
                    <span className="text-[10px] text-slate-400 block">
                      Format: {uploadedFile.type} • Size: {uploadedFile.size} • Extracted: {uploadedFile.extractedCount || 12} Metrics
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-slate-900 hover:bg-slate-800 text-sky-400 rounded-xl text-xs border border-slate-800" title="Replace File">
                    <RefreshCw className="h-4 w-4"/>
                  </button>
                  <button onClick={handleDeleteFile} className="p-2 bg-rose-950/50 hover:bg-rose-900 text-rose-300 rounded-xl text-xs border border-rose-900/60" title="Delete File">
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </div>
              </div>

              {uploadedFile.previewUrl ? (<div className="mt-2 relative h-32 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                  <img src={uploadedFile.previewUrl} alt="Report Scan Preview" className="w-full h-full object-cover"/>
                  <div className="absolute bottom-2 left-2 bg-slate-950/90 px-2 py-0.5 rounded text-[9px] text-emerald-400 font-bold">
                    Image Scan OCR Processed
                  </div>
                </div>) : (<div className="mt-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4"/> PDF Report Extracted & Analyzed
                  </span>
                  <span className="text-[10px] text-slate-400">Instant Live Recalculation Applied</span>
                </div>)}
            </div>)}
        </div>
      </div>

      {/* Manual Entry Form */}
      {isEditingMetrics && (<div className="bg-slate-900/90 border border-emerald-800 p-6 rounded-3xl space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-emerald-400"/>
              Manual Soil Test Chemistry Entry (All 12 Parameters)
            </h3>
            <span className="text-[10px] text-slate-400">Score recalculates dynamically upon saving</span>
          </div>

          <form onSubmit={handleSaveManualEntry} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
                { key: 'ph', label: 'Soil pH', unit: '' },
                { key: 'ec', label: 'EC', unit: 'mS/cm' },
                { key: 'organicCarbon', label: 'Organic Carbon', unit: '%' },
                { key: 'nitrogen', label: 'Nitrogen (N)', unit: 'kg/ha' },
                { key: 'phosphorus', label: 'Phosphorus (P)', unit: 'kg/ha' },
                { key: 'potassium', label: 'Potassium (K)', unit: 'kg/ha' },
                { key: 'sulphur', label: 'Sulphur (S)', unit: 'ppm' },
                { key: 'zinc', label: 'Zinc (Zn)', unit: 'ppm' },
                { key: 'iron', label: 'Iron (Fe)', unit: 'ppm' },
                { key: 'boron', label: 'Boron (B)', unit: 'ppm' },
                { key: 'copper', label: 'Copper (Cu)', unit: 'ppm' },
                { key: 'manganese', label: 'Manganese (Mn)', unit: 'ppm' }
            ].map((param) => (<div key={param.key} className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold block">
                  {param.label} {param.unit && `(${param.unit})`}
                </label>
                <input type="number" step="0.01" value={formData[param.key]} onChange={(e) => setFormData({ ...formData, [param.key]: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"/>
              </div>))}

            <div className="col-span-full flex justify-end gap-3 pt-2 border-t border-slate-800">
              <button type="button" onClick={() => setIsEditingMetrics(false)} className="px-4 py-2 bg-slate-950 text-slate-400 rounded-xl text-xs font-semibold">{t('cancel')}</button>
              <button type="submit" className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer">
                <Save className="h-4 w-4"/>
                <span>Save & Recalculate Score</span>
              </button>
            </div>
          </form>
        </div>)}

      {/* 12-Nutrient Chemical Grid */}
      <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-emerald-400"/>
          12 Soil Chemistry Parameters Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nutrients.map((nut) => {
            const defStatus = getDeficiencyStatus(nut);
            const val = soilReport[nut.key];
            const pct = Math.min(100, (val / nut.maxGraph) * 100);
            return (<div key={nut.key} className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl hover:border-emerald-900/50 transition-colors space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-200 leading-tight">{nut.name}</h4>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">{nut.symbol}</span>
                  </div>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${defStatus.color}`}>
                    {defStatus.label}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-400 text-[10px]">Ideal: {nut.ideal} {nut.unit}</span>
                  <span className="text-slate-100 font-extrabold">{val} {nut.unit}</span>
                </div>

                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${pct}%` }}/>
                </div>
              </div>);
        })}
        </div>
      </div>

      {/* Auto-Generated Fertilizer, Companion & Management Guidelines */}
      <div className="bg-slate-900/70 border border-emerald-950/50 rounded-3xl p-6 shadow-lg space-y-4">
        <h3 className="font-extrabold text-base text-slate-100 tracking-tight flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400 animate-pulse"/>
          Soil-Matched AI Fertilizer & Companion Plan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fertilizer Dose (Adapted to Farming Practice) */}
          <div className="md:col-span-2 space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-900">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Fertilizer & Amendment Guidelines ({profile.farmingPractice})
              </h4>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-900">
                Mode: {profile.farmingPractice}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pl-4 list-disc marker:text-emerald-400">
              {(profile.farmingPractice === 'Organic Farming'
            ? soilEvaluation.fertilizerRecommendations.organic
            : profile.farmingPractice === 'Integrated Nutrient Management (INM)'
                ? soilEvaluation.fertilizerRecommendations.inm
                : soilEvaluation.fertilizerRecommendations.conventional).map((rec, i) => (<li key={i} className="leading-relaxed">{rec}</li>))}
            </ul>
          </div>

          {/* Companion Plant Suggestions */}
          <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-900 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sprout className="h-4 w-4 text-emerald-400"/>
                Soil Restorative Companions
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Plants recommended to correct soil deficits for primary crop <strong>{profile.currentCrop}</strong>:
              </p>
              <div className="space-y-2">
                {soilEvaluation.companionRecommendations.map((sug, i) => (<div key={i} className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-[11px] text-emerald-300 font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0"/>
                    <span>{sug}</span>
                  </div>))}
              </div>
            </div>

            <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-500 font-semibold">
              Recalculated dynamically from latest soil report metrics.
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default Soil;
