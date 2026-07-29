import { db } from '@/utils/firebase';
import { collection, query, where, getDocs, onSnapshot, doc, setDoc } from 'firebase/firestore';
// 1. MASTER CROP LIST (25 Crops)
export const MASTER_CROPS = [
    { id: 'rice', name: 'Rice', category: 'cereal', light_requirement: 'full', water_requirement: '2.2 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Kharif'] },
    { id: 'wheat', name: 'Wheat', category: 'cereal', light_requirement: 'full', water_requirement: '1.2 inches/week', daylength_sensitivity: 'long-day', suitableSeasons: ['Rabi'] },
    { id: 'millets', name: 'Millets', category: 'millet', light_requirement: 'full', water_requirement: '0.9 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Kharif', 'Zaid'] },
    { id: 'maize', name: 'Maize', category: 'cereal', light_requirement: 'full', water_requirement: '1.5 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Kharif', 'Rabi'] },
    { id: 'sugarcane', name: 'Sugarcane', category: 'sugar', light_requirement: 'full', water_requirement: '2.5 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Annual'] },
    { id: 'cotton', name: 'Cotton', category: 'fiber', light_requirement: 'full', water_requirement: '1.8 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Kharif'] },
    { id: 'jute', name: 'Jute', category: 'fiber', light_requirement: 'full', water_requirement: '1.6 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Kharif'] },
    { id: 'groundnut', name: 'Groundnut', category: 'oilseed', light_requirement: 'full', water_requirement: '1.1 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Kharif', 'Zaid'] },
    { id: 'sunflower', name: 'Sunflower', category: 'oilseed', light_requirement: 'full', water_requirement: '1.2 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Kharif', 'Rabi'] },
    { id: 'soyabean', name: 'Soyabean', category: 'oilseed', light_requirement: 'full', water_requirement: '1.1 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Kharif'] },
    { id: 'mustard', name: 'Mustard', category: 'oilseed', light_requirement: 'full', water_requirement: '1.0 inches/week', daylength_sensitivity: 'long-day', suitableSeasons: ['Rabi'] },
    { id: 'sesamum', name: 'Sesamum', category: 'oilseed', light_requirement: 'full', water_requirement: '0.8 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Kharif'] },
    { id: 'tea', name: 'Tea', category: 'plantation', light_requirement: 'partial', water_requirement: '2.0 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Perennial'] },
    { id: 'coffee', name: 'Coffee', category: 'plantation', light_requirement: 'partial', water_requirement: '1.8 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Perennial'] },
    { id: 'rubber', name: 'Rubber', category: 'plantation', light_requirement: 'full', water_requirement: '2.2 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Perennial'] },
    { id: 'turmeric', name: 'Turmeric', category: 'spice', light_requirement: 'partial', water_requirement: '1.5 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Kharif'] },
    { id: 'chili', name: 'Chili', category: 'spice', light_requirement: 'full', water_requirement: '1.3 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Kharif', 'Rabi'] },
    { id: 'cardamom', name: 'Cardamom', category: 'spice', light_requirement: 'shade', water_requirement: '2.1 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Perennial'] },
    { id: 'blackpepper', name: 'Black Pepper', category: 'spice', light_requirement: 'partial', water_requirement: '1.9 inches/week', daylength_sensitivity: 'short-day', suitableSeasons: ['Perennial'] },
    { id: 'grapes', name: 'Grapes', category: 'fruit', light_requirement: 'full', water_requirement: '1.4 inches/week', daylength_sensitivity: 'long-day', suitableSeasons: ['Perennial'] },
    { id: 'mango', name: 'Mango', category: 'fruit', light_requirement: 'full', water_requirement: '1.8 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Perennial'] },
    { id: 'banana', name: 'Banana', category: 'fruit', light_requirement: 'full', water_requirement: '2.4 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Perennial'] },
    { id: 'onion', name: 'Onion', category: 'vegetable', light_requirement: 'full', water_requirement: '1.0 inches/week', daylength_sensitivity: 'long-day', suitableSeasons: ['Rabi'] },
    { id: 'cashew', name: 'Cashew', category: 'fruit', light_requirement: 'full', water_requirement: '1.2 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Perennial'] },
    { id: 'walnut', name: 'Walnut', category: 'fruit', light_requirement: 'full', water_requirement: '1.5 inches/week', daylength_sensitivity: 'long-day', suitableSeasons: ['Perennial'] },
    { id: 'fig', name: 'Fig', category: 'fruit', light_requirement: 'full', water_requirement: '1.1 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Perennial'] },
    { id: 'tomato', name: 'Tomato', category: 'vegetable', light_requirement: 'full', water_requirement: '1.3 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Kharif', 'Rabi'] },
    { id: 'potato', name: 'Potato', category: 'vegetable', light_requirement: 'full', water_requirement: '1.2 inches/week', daylength_sensitivity: 'long-day', suitableSeasons: ['Rabi'] },
    { id: 'coconut', name: 'Coconut', category: 'plantation', light_requirement: 'full', water_requirement: '2.3 inches/week', daylength_sensitivity: 'day-neutral', suitableSeasons: ['Perennial'] }
];
// 2. SEED DATA: COMPANIONS TABLE
export const SEED_COMPANIONS = [
    { "id": 1, "combination": ["Wheat", "White Lupin"], "mechanism": "Soil (P-solubilization)", "source": "PMC10331949", "confidence": "High" },
    { "id": 2, "combination": ["Green Onion", "Cucumber"], "mechanism": "Nutrient (K-uptake)", "source": "PMC10331949", "confidence": "High" },
    { "id": 3, "combination": ["Cucumber", "Garlic"], "mechanism": "Pest deterrence", "source": "PMC10331949", "confidence": "High" },
    { "id": 4, "combination": ["Cucumber", "Mustard", "Sesame"], "mechanism": "Pest / Soil", "source": "PMC10331949", "confidence": "Moderate" },
    { "id": 5, "combination": ["Cotton", "Sorghum"], "mechanism": "Trap cropping (Pest)", "source": "PMC6316212", "confidence": "High" },
    { "id": 6, "combination": ["Sweet Corn", "Black Mustard"], "mechanism": "Trap cropping", "source": "PMC6316212", "confidence": "High" },
    { "id": 7, "combination": ["Cucumber", "Butternut Squash", "Watermelon", "Squash varieties"], "mechanism": "Trap cropping", "source": "PMC6316212", "confidence": "Moderate" },
    { "id": 8, "combination": ["Cotton", "Mung Bean"], "mechanism": "Nitrogen fixation / Pest", "source": "PMC6316212", "confidence": "High" },
    { "id": 9, "combination": ["Tomato", "Corn"], "mechanism": "Space/Pest — CAUTION: see avoid_pairs id 2 (shared corn earworm risk)", "source": "PMC6316212", "confidence": "Low" },
    { "id": 10, "combination": ["Cauliflower", "Chinese Cabbage", "Marigold", "Rapeseed", "Sunflower"], "mechanism": "Trap cropping", "source": "PMC6316212", "confidence": "Moderate" },
    { "id": 11, "combination": ["Desmodium grasses", "Napier grass"], "mechanism": "Push-pull pest control", "source": "PMC6316212", "confidence": "High" },
    { "id": 12, "combination": ["Onion", "Buckwheat"], "mechanism": "Pest / Pollinator", "source": "PMC6316212", "confidence": "Moderate" },
    { "id": 13, "combination": ["Bell Pepper", "Sunflower", "Grain Sorghum"], "mechanism": "Trap cropping", "source": "PMC6316212", "confidence": "Moderate" },
    { "id": 14, "combination": ["Peanut", "Corn"], "mechanism": "Nutrient (P-activation)", "source": "PMC10331949", "confidence": "High" },
    { "id": 15, "combination": ["Cowpea", "Sorghum"], "mechanism": "Nutrient (P-activation)", "source": "PMC10331949", "confidence": "High" },
    { "id": 16, "combination": ["Cabbage", "Clover"], "mechanism": "Pest (reduces cabbage aphid/cabbageworm)", "source": "General literature", "confidence": "Moderate" },
    { "id": 17, "combination": ["Tomato", "Basil"], "mechanism": "Pest (repels aphids, hornworms)", "source": "General literature", "confidence": "Moderate" },
    { "id": 18, "combination": ["Tomato", "Marigold"], "mechanism": "Pest (nematode suppression)", "source": "General literature", "confidence": "Moderate" },
    { "id": 19, "combination": ["Tomato", "Carrot", "Celery", "Onion family", "Lettuce", "Parsley", "Spinach", "Asparagus"], "mechanism": "Space/Pest", "source": "General literature", "confidence": "Moderate" },
    { "id": 20, "combination": ["Corn", "Beans", "Squash"], "mechanism": "Nitrogen fixation, structural support, weed suppression", "source": "General literature (Three Sisters)", "confidence": "High" },
    { "id": 21, "combination": ["Brassicas", "Thyme"], "mechanism": "Pest (repels cabbage moth)", "source": "General literature", "confidence": "Moderate" },
    { "id": 22, "combination": ["Cucumber", "Nasturtium"], "mechanism": "Pest (aphid trap)", "source": "General literature", "confidence": "Moderate" },
    { "id": 23, "combination": ["Lettuce", "Radish"], "mechanism": "Pest (flea beetle deterrent)", "source": "General literature", "confidence": "Moderate" },
    { "id": 24, "combination": ["Potato", "Beans"], "mechanism": "Nutrient (N-fixation) / Pest (potato repels bean beetle)", "source": "General literature", "confidence": "Moderate" },
    { "id": 25, "combination": ["Onion", "Carrot"], "mechanism": "Pest (masks carrot fly)", "source": "General literature", "confidence": "Moderate" },
    { "id": 26, "combination": ["Banana", "Coconut", "Turmeric or Ginger"], "mechanism": "Space (shade-tolerant intercrop), nutrient use efficiency", "source": "General agronomic practice — verify locally", "confidence": "Contextual" },
    { "id": 27, "combination": ["Coconut", "Black Pepper"], "mechanism": "Space (living support), income diversification", "source": "General agronomic practice", "confidence": "Contextual" },
    { "id": 28, "combination": ["Coffee", "Cardamom", "Rubber"], "mechanism": "Space (shade requirement match)", "source": "General agronomic practice", "confidence": "Contextual" }
];
// 3. SEED AVOID PAIRS
export const SEED_AVOID_PAIRS = [
    { "id": 1, "combination": ["Tomato", "Potato"], "reason": "Both nightshades; share early/late blight and Colorado potato beetle risk", "confidence": "High" },
    { "id": 2, "combination": ["Tomato", "Corn"], "reason": "Both attacked by the same pest (corn earworm = tomato fruitworm)", "confidence": "High" },
    { "id": 3, "combination": ["Tomato", "Cabbage/Brassicas"], "reason": "Brassicas are heavy feeders and compete for the same nutrients; tomatoes can stunt them", "confidence": "Moderate" },
    { "id": 4, "combination": ["Tomato", "Fennel"], "reason": "Fennel is allelopathic, exudes root compounds that inhibit tomato growth", "confidence": "High" },
    { "id": 5, "combination": ["Tomato", "Dill (mature)"], "reason": "Mature dill can inhibit tomato growth and attract hornworms", "confidence": "Moderate" },
    { "id": 6, "combination": ["Tomato", "Eggplant/Pepper (dense planting)"], "reason": "Same nightshade family — shared pest/disease pressure", "confidence": "Moderate" },
    { "id": 7, "combination": ["Onion/Garlic family", "Beans/Peas"], "reason": "Alliums inhibit legume growth/nodulation", "confidence": "High" },
    { "id": 8, "combination": ["Onion", "Asparagus"], "reason": "Competitive root growth patterns", "confidence": "Moderate" },
    { "id": 9, "combination": ["Cabbage family", "Strawberries"], "reason": "Shared pests/diseases; poor mutual growth habit", "confidence": "Moderate" },
    { "id": 10, "combination": ["Cabbage/Brassicas", "Tomato"], "reason": "See id 3", "confidence": "Moderate" },
    { "id": 11, "combination": ["Potato", "Sunflower"], "reason": "Sunflower seed compounds suppress potato growth (allelopathy)", "confidence": "Moderate" },
    { "id": 12, "combination": ["Potato", "Cucumber/Squash (vine crops)"], "reason": "Increases blight/fungal disease risk in humid conditions", "confidence": "Moderate" },
    { "id": 13, "combination": ["Potato", "Tomato/Eggplant"], "reason": "See id 1", "confidence": "High" },
    { "id": 14, "combination": ["Carrot", "Dill (mature)"], "reason": "Mature dill cross-pollinates and can stunt carrot", "confidence": "Moderate" },
    { "id": 15, "combination": ["Beans/Peas", "Onion/Garlic/Leek"], "reason": "See id 7", "confidence": "High" },
    { "id": 16, "combination": ["Beans", "Sunflower"], "reason": "Sunflower allelopathy suppresses bean growth in some studies", "confidence": "Low-Moderate" },
    { "id": 17, "combination": ["Corn", "Tomato"], "reason": "See id 2", "confidence": "High" },
    { "id": 18, "combination": ["Sugarcane", "Okra/Peppers/Sunflower"], "reason": "Documented poor pairing in sugarcane intercropping guides", "confidence": "Moderate" },
    { "id": 19, "combination": ["Watermelon", "Irish Potato/Mustard"], "reason": "Documented poor pairing", "confidence": "Moderate" },
    { "id": 20, "combination": ["Radish", "Cabbage/Broccoli/Cauliflower/Turnip/Mustard"], "reason": "Same brassica family, dense planting — germination competition, shared pests", "confidence": "Moderate" },
    { "id": 21, "combination": ["Walnut (Juglans)", "Tomato/Pepper/Eggplant/Potato"], "reason": "Walnut roots exude juglone, toxic to nightshades", "confidence": "High" },
    { "id": 22, "combination": ["Fennel", "almost any vegetable"], "reason": "Strong allelopath; isolate in its own bed/container", "confidence": "High" },
    { "id": 23, "combination": ["Rice", "weeds/allelopathy-sensitive intercrops in flooded systems"], "reason": "Standing water limits true intercropping; treat rice as largely monoculture at field level", "confidence": "Contextual" },
    { "id": 24, "combination": ["Groundnut/Soyabean", "tall shading crops planted too close"], "reason": "Oilseeds need full sun; shading reduces pod fill", "confidence": "Moderate" },
    { "id": 25, "combination": ["Mustard/Sesamum", "Brassica-family pests nearby in bloom stage"], "reason": "Shared aphid/flea-beetle pressure at flowering", "confidence": "Moderate" },
    { "id": 26, "combination": ["Turmeric/Chili/Cardamom/Black Pepper", "waterlogging-prone companions"], "reason": "Rhizome/root crops are highly sensitive to excess soil moisture from co-planted heavy-water-use species", "confidence": "Contextual" }
];
// FIRESTORE QUERY LAYER (Section 4 Specified Query Pattern)
export async function queryFirestoreCompanions(cropName) {
    try {
        const q = query(collection(db, "companions"), where("combination", "array-contains", cropName));
        const snap = await getDocs(q);
        if (!snap.empty) {
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    }
    catch (e) {
        console.warn('Firestore companions query fallback to local engine:', e);
    }
    return SEED_COMPANIONS;
}
export async function queryFirestoreAvoidPairs(cropName) {
    try {
        const avoidQ = query(collection(db, "avoidPairs"), where("combination", "array-contains", cropName));
        const snap = await getDocs(avoidQ);
        if (!snap.empty) {
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    }
    catch (e) {
        console.warn('Firestore avoidPairs query fallback to local engine:', e);
    }
    return SEED_AVOID_PAIRS;
}
// USER PROFILE FIRESTORE HELPER (Gated behind Auth - users/{uid})
export async function saveUserFarmProfile(uid, profileData) {
    if (!uid)
        return;
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
    }, { merge: true });
}
export function subscribeUserProfile(uid, callback) {
    if (!uid)
        return () => { };
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
            callback(snap.data());
        }
    });
}
// BUSINESS LOGIC RULE 1: Check AVOID table conflict. AVOID always wins!
export function isPairInAvoidTable(cropA, cropB) {
    const cA = cropA.toLowerCase();
    const cB = cropB.toLowerCase();
    for (const avoid of SEED_AVOID_PAIRS) {
        const list = avoid.combination.map(c => c.toLowerCase());
        const matchA = list.some(item => cA.includes(item) || item.includes(cA));
        const matchB = list.some(item => cB.includes(item) || item.includes(cB));
        if (matchA && matchB) {
            return { isAvoided: true, reason: avoid.reason, confidence: avoid.confidence };
        }
    }
    return { isAvoided: false };
}
// MAIN RECOMMENDATION ENGINE FUNCTION
export function getEngineRecommendations(targetCropName, stage = 'Growth', mode = 'Integrated', landAreaHa = 1.0) {
    const crop = MASTER_CROPS.find(c => c.name.toLowerCase() === targetCropName.toLowerCase()) || MASTER_CROPS[0];
    const isMonocropAdvisory = landAreaHa > 10;
    const avoidList = [];
    const cNameLower = targetCropName.toLowerCase();
    SEED_AVOID_PAIRS.forEach(avoid => {
        const list = avoid.combination.map(c => c.toLowerCase());
        if (list.some(item => cNameLower.includes(item) || item.includes(cNameLower))) {
            const partner = avoid.combination.find(item => !cNameLower.includes(item.toLowerCase())) || avoid.combination[1] || 'Antagonistic Crop';
            avoidList.push({
                cropName: partner,
                reason: avoid.reason,
                confidence: avoid.confidence
            });
        }
    });
    const companionList = [];
    if (!isMonocropAdvisory) {
        SEED_COMPANIONS.forEach(comp => {
            const list = comp.combination.map(c => c.toLowerCase());
            if (list.some(item => cNameLower.includes(item) || item.includes(cNameLower))) {
                comp.combination.forEach(item => {
                    const itemLower = item.toLowerCase();
                    if (!cNameLower.includes(itemLower) && !itemLower.includes(cNameLower)) {
                        const avoidCheck = isPairInAvoidTable(targetCropName, item);
                        if (!avoidCheck.isAvoided) {
                            let mechTag = 'Nutrient';
                            const m = comp.mechanism.toLowerCase();
                            if (m.includes('soil'))
                                mechTag = 'Soil';
                            else if (m.includes('pest') || m.includes('trap'))
                                mechTag = 'Pest';
                            else if (m.includes('space') || m.includes('shade'))
                                mechTag = 'Space';
                            const stageSuitability = (stage === 'Germination' && (itemLower.includes('brassica') || itemLower.includes('radish')))
                                ? 'Caution at Germination'
                                : 'Suitable';
                            companionList.push({
                                cropName: item,
                                mechanism: comp.mechanism,
                                source: comp.source,
                                confidence: comp.confidence,
                                stageSuitability,
                                mechanismTag: mechTag
                            });
                        }
                    }
                });
            }
        });
        if (companionList.length === 0) {
            const defaultPartners = [
                { cropName: 'Cowpea', mechanism: 'Nitrogen fixation & soil microbial enhancement', source: 'PMC10331949', confidence: 'High', mechanismTag: 'Nutrient' },
                { cropName: 'Marigold', mechanism: 'Nematode control & natural pest repellent', source: 'PMC6316212', confidence: 'High', mechanismTag: 'Pest' },
                { cropName: 'Sunflower', mechanism: 'Pollinator attraction & solar radiation harvesting', source: 'PMC6316212', confidence: 'Moderate', mechanismTag: 'Pest' }
            ];
            defaultPartners.forEach(p => {
                if (!isPairInAvoidTable(targetCropName, p.cropName).isAvoided) {
                    companionList.push({
                        ...p,
                        stageSuitability: 'Suitable'
                    });
                }
            });
        }
    }
    return {
        isMonocropAdvisory,
        targetCrop: crop,
        companions: companionList,
        avoids: avoidList,
        rotationAdvice: [
            `Rotate ${crop.name} with leguminous pulse crops (Cowpea/Mung) to restore soil N-reserves.`,
            `Incorporate green manure (Dhaincha/Sunnhemp) 45 days prior to next crop cycle.`,
            `Avoid continuous ${crop.name} monoculture to suppress soil-borne fungal pathogens.`
        ]
    };
}
// NUTRIENT LOGIC FUNCTION
export function getEngineNutrientGuidance(cropName, mode, soilReport) {
    const isSoilReportOverridden = !!(soilReport && (soilReport.ph || soilReport.nitrogen));
    if (mode === 'Conventional') {
        return {
            mode,
            isSoilReportOverridden,
            npkSummary: isSoilReportOverridden
                ? `Soil Test Based: N=${soilReport.nitrogen} kg/ha, P=${soilReport.phosphorus} kg/ha, K=${soilReport.potassium} kg/ha (pH ${soilReport.ph})`
                : `120:60:60 NPK kg/ha (Standard Synthetic Recommendation for ${cropName})`,
            details: {
                basalDose: [`Apply 50% Nitrogen + 100% Phosphorus + 100% Potassium at sowing of ${cropName}.`],
                biofertilizers: ['Azospirillum / Rhizobium @ 2 kg/ha seed treatment'],
                foliarMicronutrients: ['Zinc Sulphate (0.5%) + Borax (0.2%) at vegetative stage'],
                stageSplits: ['Split 1: 25% N at 30 DAS', 'Split 2: 25% N at flowering stage']
            }
        };
    }
    if (mode === 'Organic') {
        return {
            mode,
            isSoilReportOverridden,
            npkSummary: `Organic Nutrient Protocol for ${cropName} (Zero Synthetic Chemical Inputs)`,
            details: {
                basalDose: ['FYM / Well-rotted compost @ 15-20 tonnes/ha', 'Vermicompost @ 5 tonnes/ha'],
                biofertilizers: ['Rhizobium / Azotobacter @ 5 kg/ha', 'PSB (Phosphorus Solubilizing Bacteria) @ 5 kg/ha'],
                foliarMicronutrients: ['Neem Cake @ 250 kg/ha for N-release & soil pest suppression'],
                stageSplits: ['Green manure incorporation (Dhaincha) 45 days prior to planting']
            }
        };
    }
    return {
        mode: 'Integrated',
        isSoilReportOverridden,
        npkSummary: isSoilReportOverridden
            ? `INM Soil Test Based for ${cropName}: 75% NPK (${(soilReport.nitrogen * 0.75).toFixed(0)} N) + 25% Organic Substitution`
            : `75:25 INM Rule for ${cropName}: 75% Synthetic NPK + 25% FYM/Biofertilizer Substitution`,
        details: {
            basalDose: ['FYM @ 10 t/ha + 75% recommended synthetic NPK'],
            biofertilizers: ['Azotobacter / PSB bio-inoculants @ 2 kg/ha'],
            foliarMicronutrients: ['Foliar Zinc Sulphate (0.2%) + Humic Acid @ 3 kg/ha'],
            stageSplits: ['Drip fertigation splits: 50% pre-blooming, 50% post fruit set']
        }
    };
}
