'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFarm } from '@/context/farm-context';
import { CROP_DATABASE } from '@/utils/crop-database';
import i18n from '@/i18n';
import { Calendar as CalendarIcon, Plus, Square, Sparkles, CheckCircle2 } from 'lucide-react';
export const FarmingCalendar = () => {
    const { profile, calendar, toggleCalendarEvent, addCalendarEvent, showToast } = useFarm();
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState('Weekly');
    const [selectedCrop, setSelectedCrop] = useState(profile.currentCrop);
    const [plantingDate, setPlantingDate] = useState('2026-07-01');
    const [filterStage, setFilterStage] = useState('All');
    const [customTask, setCustomTask] = useState('');
    const [customCategory, setCustomCategory] = useState('Irrigation');
    const [customPriority, setCustomPriority] = useState('Medium');
    const [customDate, setCustomDate] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const addDaysToDate = (baseDateStr, days) => {
        const d = new Date(baseDateStr);
        d.setDate(d.getDate() + days);
        return d.toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language, { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const cropDurationDays = 115;
    const generateStagePhases = () => {
        return [
            {
                id: 'germination',
                name: t('germination'),
                startDate: addDaysToDate(plantingDate, 0),
                endDate: addDaysToDate(plantingDate, 14),
                durationDays: 14,
                badgeColor: 'bg-emerald-950/60 text-emerald-400 border-emerald-800',
                borderColor: 'border-emerald-500',
                tasks: [
                    { title: 'Seed Sowing: Sow certified high-germination seeds in nursery/field.', category: t('germination'), priority: 'High', dueDate: addDaysToDate(plantingDate, 1), completed: true },
                    { title: 'Initial Irrigation: Apply light misting/drip irrigation to achieve field capacity.', category: 'Irrigation', priority: 'High', dueDate: addDaysToDate(plantingDate, 2), completed: true },
                    { title: 'Seed Treatment: Treat seeds with Trichoderma viride or Azospirillum slurry.', category: 'Biofertilizer', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 4), completed: false }
                ]
            },
            {
                id: 'vegetative',
                name: t('growth'),
                startDate: addDaysToDate(plantingDate, 15),
                endDate: addDaysToDate(plantingDate, 45),
                durationDays: 30,
                badgeColor: 'bg-teal-950/60 text-teal-400 border-teal-800',
                borderColor: 'border-teal-500',
                tasks: [
                    { title: 'Fertilizer Schedule: Apply 1st split dose of Nitrogen/Vermicompost.', category: 'Fertilizer', priority: 'High', dueDate: addDaysToDate(plantingDate, 18), completed: false },
                    { title: 'Weed Management: Shallow hoeing and manual weeding around crop bases.', category: 'Soil & Weed', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 24), completed: false },
                    { title: 'Irrigation: Maintain 3-day regular irrigation cycle.', category: 'Irrigation', priority: 'High', dueDate: addDaysToDate(plantingDate, 28), completed: false },
                    { title: 'Soil Monitoring: Test soil moisture at 15cm root zone depth.', category: 'Soil Check', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 35), completed: false }
                ]
            },
            {
                id: 'flowering',
                name: t('flowering'),
                startDate: addDaysToDate(plantingDate, 46),
                endDate: addDaysToDate(plantingDate, 70),
                durationDays: 25,
                badgeColor: 'bg-amber-950/60 text-amber-400 border-amber-800',
                borderColor: 'border-amber-500',
                tasks: [
                    { title: 'Pest Monitoring: Scout weekly for thrips, aphids, and flower midge.', category: 'Pest Check', priority: 'High', dueDate: addDaysToDate(plantingDate, 48), completed: false },
                    { title: 'Pollination Booster: Introduce honeybee boxes or encourage native pollinators.', category: 'Pollination', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 55), completed: false },
                    { title: 'Nutrient Spray: Apply 0.2% Borax foliar spray to boost flower drop resistance.', category: 'Nutrient Spray', priority: 'High', dueDate: addDaysToDate(plantingDate, 62), completed: false }
                ]
            },
            {
                id: 'reproductive',
                name: t('fruiting'),
                startDate: addDaysToDate(plantingDate, 71),
                endDate: addDaysToDate(plantingDate, 95),
                durationDays: 25,
                badgeColor: 'bg-purple-950/60 text-purple-400 border-purple-800',
                borderColor: 'border-purple-500',
                tasks: [
                    { title: 'Water Management: Maintain steady moisture to prevent fruit cracking.', category: 'Water Management', priority: 'High', dueDate: addDaysToDate(plantingDate, 73), completed: false },
                    { title: 'Disease Monitoring: Check fruit clusters for early blight and fruit rot.', category: 'Disease Check', priority: 'High', dueDate: addDaysToDate(plantingDate, 80), completed: false },
                    { title: 'Companion Crop Maintenance: Prune companion basil/marigold trap crop rows.', category: 'Companion Care', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 88), completed: false }
                ]
            },
            {
                id: 'maturity',
                name: t('maturity'),
                startDate: addDaysToDate(plantingDate, 96),
                endDate: addDaysToDate(plantingDate, 115),
                durationDays: 20,
                badgeColor: 'bg-sky-950/60 text-sky-400 border-sky-800',
                borderColor: 'border-sky-500',
                tasks: [
                    { title: 'Harvest Preparation: Clean storage crates and organize labor schedule.', category: 'Preparation', priority: 'High', dueDate: addDaysToDate(plantingDate, 98), completed: false },
                    { title: 'Irrigation Reduction: Taper off irrigation 7 days prior to primary harvest.', category: 'Water Reduction', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 105), completed: false },
                    { title: 'Harvest: Begin selective manual picking at breaker stage.', category: t('harvest'), priority: 'High', dueDate: addDaysToDate(plantingDate, 112), completed: false }
                ]
            },
            {
                id: 'after_harvest',
                name: t('afterHarvest'),
                startDate: addDaysToDate(plantingDate, 116),
                endDate: addDaysToDate(plantingDate, 130),
                durationDays: 15,
                badgeColor: 'bg-rose-950/60 text-rose-400 border-rose-800',
                borderColor: 'border-rose-500',
                tasks: [
                    { title: 'Harvest Date & Yield Recording: Log final yield tonnes per hectare in CropNexa.', category: 'Yield Audit', priority: 'High', dueDate: addDaysToDate(plantingDate, 118), completed: false },
                    { title: 'Post-Harvest Operations: Grade, sort, and cool harvested produce.', category: 'Post Harvest', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 120), completed: false },
                    { title: 'Soil Testing: Sample field soil post-harvest for next season baseline.', category: 'Soil Test', priority: 'High', dueDate: addDaysToDate(plantingDate, 123), completed: false },
                    { title: 'Cover Crop Recommendation: Sow Sunnhemp or Dhaincha green manure.', category: 'Soil Health', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 125), completed: false },
                    { title: 'Next Crop Planning & Companion Recommendation: Plan rotation with Onion/Legume.', category: 'Crop Rotation', priority: 'Medium', dueDate: addDaysToDate(plantingDate, 128), completed: false }
                ]
            }
        ];
    };
    const stages = generateStagePhases();
    const calculatedHarvestDate = addDaysToDate(plantingDate, cropDurationDays);
    const handleAddCustomTask = (e) => {
        e.preventDefault();
        if (!customTask.trim())
            return;
        const formattedDate = customDate
            ? new Date(customDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })
            : new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language, { month: 'short', day: 'numeric', year: 'numeric' });
        addCalendarEvent({
            task: customTask,
            category: customCategory,
            priority: customPriority,
            date: formattedDate
        });
        setCustomTask('');
        setCustomDate('');
        setShowAddForm(false);
        showToast('Task Scheduled', 'Custom operation item added to calendar.', 'success');
    };
    const filteredStages = stages.filter(s => filterStage === 'All' || s.id === filterStage);
    return (<div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-900/60 border border-emerald-950/40 p-6 rounded-3xl space-y-4 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-950/50 pb-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-emerald-400 animate-pulse"/>
                            {t('calendarTitle')}
                        </h2>
                        <p className="text-xs text-slate-400">{t('calendarSubtitle')}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
                            {['Daily', 'Weekly', 'Monthly'].map(mode => (<button key={mode} onClick={() => setViewMode(mode)} className={`
                                        text-[10px] px-3.5 py-1.5 rounded-xl font-extrabold uppercase tracking-wider transition-all cursor-pointer
                                        ${viewMode === mode
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'}
                                    `}>
                                    {mode} View
                                </button>))}
                        </div>

                        <button onClick={() => setShowAddForm(!showAddForm)} className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer shrink-0">
                            <Plus className="h-4 w-4"/>
                            {t('addCustomOperation')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">{t('targetCrop')}</label>
                        <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2 focus:outline-none focus:border-emerald-500">
                            {Object.values(CROP_DATABASE).map(crop => (<option key={crop.id} value={crop.name}>{crop.name}</option>))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">{t('plantingDate')}</label>
                        <input type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2 focus:outline-none focus:border-emerald-500"/>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-900 flex flex-col justify-center">
                        <span className="text-[9px] text-slate-500 uppercase font-bold block">{t('harvestDate')}</span>
                        <span className="text-xs font-extrabold text-emerald-400 mt-0.5">{calculatedHarvestDate}</span>
                    </div>

                    <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-900 flex flex-col justify-center">
                        <span className="text-[9px] text-slate-500 uppercase font-bold block">{t('cropDuration')}</span>
                        <span className="text-xs font-extrabold text-teal-300 mt-0.5">{cropDurationDays} Days</span>
                    </div>
                </div>
            </div>

            {showAddForm && (<div className="bg-slate-900/80 border border-emerald-800 p-6 rounded-3xl space-y-4 shadow-xl animate-fadeIn">
                    <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-400"/>
                        {t('addCustomActivity')}
                    </h3>

                    <form onSubmit={handleAddCustomTask} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-3">
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t('activityTitle')}</label>
                            <input type="text" value={customTask} onChange={(e) => setCustomTask(e.target.value)} placeholder="e.g. Inspect drip filter lines, apply bio-pesticide spray..." required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"/>
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t('category')}</label>
                            <select value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2 focus:outline-none focus:border-emerald-500">
                                <option value="Irrigation">Irrigation</option>
                                <option value="Fertilizer">Fertilizer</option>
                                <option value="Biofertilizer">Biofertilizer</option>
                                <option value="Pest Monitoring">Pest Monitoring</option>
                                <option value="Harvesting">{t('harvest')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t('priority')}</label>
                            <select value={customPriority} onChange={(e) => setCustomPriority(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2 focus:outline-none focus:border-emerald-500">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t('dueDate')}</label>
                            <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3.5 py-2 focus:outline-none focus:border-emerald-500"/>
                        </div>

                        <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-950 text-slate-400 rounded-xl text-xs font-semibold cursor-pointer">{t('cancel')}</button>
                            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer">
                                {t('insertTask')}
                            </button>
                        </div>
                    </form>
                </div>)}

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold shrink-0">{t('stageFilter')}:</span>
                <button onClick={() => setFilterStage('All')} className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border shrink-0 transition-colors cursor-pointer ${filterStage === 'All' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                    {t('allStages')} (6)
                </button>
                {stages.map(st => (<button key={st.id} onClick={() => setFilterStage(st.id)} className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border shrink-0 transition-colors cursor-pointer ${filterStage === st.id ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                        {st.name}
                    </button>))}
            </div>

            <div className="space-y-6">
                {filteredStages.map((stage, idx) => (<div key={stage.id} className={`bg-slate-900/60 border ${stage.borderColor}/40 rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-950/50 pb-3 gap-2">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-extrabold text-xs text-slate-300">
                                    0{idx + 1}
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                                        {stage.name} {t('phase')}
                                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${stage.badgeColor}`}>
                                            {stage.durationDays} Days
                                        </span>
                                    </h3>
                                    <span className="text-[10px] text-slate-400 block font-medium">
                                        {t('timeline')}: <strong>{stage.startDate}</strong> — <strong>{stage.endDate}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {stage.tasks.map((taskItem, tIdx) => (<div key={tIdx} className="bg-slate-950/60 border border-slate-900 p-4 rounded-2xl flex items-start gap-3 hover:border-slate-800 transition-all">
                                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5"/>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider">
                                                {taskItem.category}
                                            </span>
                                            <span className="text-[8px] px-2 py-0.25 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-bold uppercase">
                                                {taskItem.priority} {t('priority')}
                                            </span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-200 leading-snug">{taskItem.title}</p>
                                        <span className="text-[9px] text-slate-500 block">{t('scheduled')}: {taskItem.dueDate}</span>
                                    </div>
                                </div>))}
                        </div>
                    </div>))}
            </div>

            {calendar.length > 0 && (<div className="bg-slate-900/60 border border-emerald-950/40 rounded-3xl p-6 shadow-md space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-400"/>
                        {t('customActivities')} ({calendar.length})
                    </h3>

                    <div className="space-y-2.5">
                        {calendar.map(evt => (<div key={evt.id} onClick={() => toggleCalendarEvent(evt.id)} className={`p-3.5 border rounded-2xl cursor-pointer flex items-center justify-between gap-3 ${evt.completed ? 'bg-slate-950/20 border-slate-900 text-slate-500 opacity-60' : 'bg-slate-950/60 border-slate-900 text-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <Square className={`h-4.5 w-4.5 ${evt.completed ? 'text-emerald-400' : 'text-slate-600'}`}/>
                                    <div>
                                        <span className="text-[9px] font-extrabold text-emerald-400 uppercase block">{evt.category}</span>
                                        <p className={`text-xs font-medium ${evt.completed ? 'line-through' : ''}`}>{evt.task}</p>
                                    </div>
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold">Due: {evt.date}</span>
                            </div>))}
                    </div>
                </div>)}
        </div>);
};
export default FarmingCalendar;
