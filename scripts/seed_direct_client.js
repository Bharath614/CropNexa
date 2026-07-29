/**
 * Standalone Firestore Direct Seeder Script
 * Run: node scripts/seed_direct_client.js
 */

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, writeBatch } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBCZ4yvnmi9khM_veHWAek7Ml0ZtaEB--U",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cropnexa-c059f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cropnexa-c059f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cropnexa-c059f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "964090441818",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:964090441818:web:2b22f18ba94a0be444a863",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JW8DE4MWX1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. CROPS
const crops = [
  { id: 'rice', name: 'Rice', category: 'cereal', light_requirement: 'full', water_requirement: '2.2 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'wheat', name: 'Wheat', category: 'cereal', light_requirement: 'full', water_requirement: '1.2 inches/week', daylength_sensitivity: 'long-day' },
  { id: 'millets', name: 'Millets', category: 'millet', light_requirement: 'full', water_requirement: '0.9 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'maize', name: 'Maize', category: 'cereal', light_requirement: 'full', water_requirement: '1.5 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'sugarcane', name: 'Sugarcane', category: 'sugar', light_requirement: 'full', water_requirement: '2.5 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'cotton', name: 'Cotton', category: 'fiber', light_requirement: 'full', water_requirement: '1.8 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'jute', name: 'Jute', category: 'fiber', light_requirement: 'full', water_requirement: '1.6 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'groundnut', name: 'Groundnut', category: 'oilseed', light_requirement: 'full', water_requirement: '1.1 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'sunflower', name: 'Sunflower', category: 'oilseed', light_requirement: 'full', water_requirement: '1.2 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'soyabean', name: 'Soyabean', category: 'oilseed', light_requirement: 'full', water_requirement: '1.1 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'mustard', name: 'Mustard', category: 'oilseed', light_requirement: 'full', water_requirement: '1.0 inches/week', daylength_sensitivity: 'long-day' },
  { id: 'sesamum', name: 'Sesamum', category: 'oilseed', light_requirement: 'full', water_requirement: '0.8 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'tea', name: 'Tea', category: 'plantation', light_requirement: 'partial', water_requirement: '2.0 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'coffee', name: 'Coffee', category: 'plantation', light_requirement: 'partial', water_requirement: '1.8 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'rubber', name: 'Rubber', category: 'plantation', light_requirement: 'full', water_requirement: '2.2 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'turmeric', name: 'Turmeric', category: 'spice', light_requirement: 'partial', water_requirement: '1.5 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'chili', name: 'Chili', category: 'spice', light_requirement: 'full', water_requirement: '1.3 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'cardamom', name: 'Cardamom', category: 'spice', light_requirement: 'shade', water_requirement: '2.1 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'blackpepper', name: 'Black Pepper', category: 'spice', light_requirement: 'partial', water_requirement: '1.9 inches/week', daylength_sensitivity: 'short-day' },
  { id: 'grapes', name: 'Grapes', category: 'fruit', light_requirement: 'full', water_requirement: '1.4 inches/week', daylength_sensitivity: 'long-day' },
  { id: 'mango', name: 'Mango', category: 'fruit', light_requirement: 'full', water_requirement: '1.8 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'banana', name: 'Banana', category: 'fruit', light_requirement: 'full', water_requirement: '2.4 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'onion', name: 'Onion', category: 'vegetable', light_requirement: 'full', water_requirement: '1.0 inches/week', daylength_sensitivity: 'long-day' },
  { id: 'cashew', name: 'Cashew', category: 'fruit', light_requirement: 'full', water_requirement: '1.2 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'walnut', name: 'Walnut', category: 'fruit', light_requirement: 'full', water_requirement: '1.5 inches/week', daylength_sensitivity: 'long-day' },
  { id: 'fig', name: 'Fig', category: 'fruit', light_requirement: 'full', water_requirement: '1.1 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'tomato', name: 'Tomato', category: 'vegetable', light_requirement: 'full', water_requirement: '1.3 inches/week', daylength_sensitivity: 'day-neutral' },
  { id: 'potato', name: 'Potato', category: 'vegetable', light_requirement: 'full', water_requirement: '1.2 inches/week', daylength_sensitivity: 'long-day' },
  { id: 'coconut', name: 'Coconut', category: 'plantation', light_requirement: 'full', water_requirement: '2.3 inches/week', daylength_sensitivity: 'day-neutral' }
];

// 2. COMPANIONS
const companions = [
  { id: 1, combination: ["Wheat", "White Lupin"], mechanism: "Soil (P-solubilization)", source: "PMC10331949", confidence: "High" },
  { id: 2, combination: ["Green Onion", "Cucumber"], mechanism: "Nutrient (K-uptake)", source: "PMC10331949", confidence: "High" },
  { id: 3, combination: ["Cucumber", "Garlic"], mechanism: "Pest deterrence", source: "PMC10331949", confidence: "High" },
  { id: 4, combination: ["Cucumber", "Mustard", "Sesame"], mechanism: "Pest / Soil", source: "PMC10331949", confidence: "Moderate" },
  { id: 5, combination: ["Cotton", "Sorghum"], mechanism: "Trap cropping (Pest)", source: "PMC6316212", confidence: "High" },
  { id: 6, combination: ["Sweet Corn", "Black Mustard"], mechanism: "Trap cropping", source: "PMC6316212", confidence: "High" },
  { id: 7, combination: ["Cucumber", "Butternut Squash", "Watermelon", "Squash varieties"], mechanism: "Trap cropping", source: "PMC6316212", confidence: "Moderate" },
  { id: 8, combination: ["Cotton", "Mung Bean"], mechanism: "Nitrogen fixation / Pest", source: "PMC6316212", confidence: "High" },
  { id: 9, combination: ["Tomato", "Corn"], mechanism: "Space/Pest — CAUTION: see avoidPairs id 2", source: "PMC6316212", confidence: "Low" },
  { id: 10, combination: ["Cauliflower", "Chinese Cabbage", "Marigold", "Rapeseed", "Sunflower"], mechanism: "Trap cropping", source: "PMC6316212", confidence: "Moderate" },
  { id: 11, combination: ["Desmodium grasses", "Napier grass"], mechanism: "Push-pull pest control", source: "PMC6316212", confidence: "High" },
  { id: 12, combination: ["Onion", "Buckwheat"], mechanism: "Pest / Pollinator", source: "PMC6316212", confidence: "Moderate" },
  { id: 13, combination: ["Bell Pepper", "Sunflower", "Grain Sorghum"], mechanism: "Trap cropping", source: "PMC6316212", confidence: "Moderate" },
  { id: 14, combination: ["Peanut", "Corn"], mechanism: "Nutrient (P-activation)", source: "PMC10331949", confidence: "High" },
  { id: 15, combination: ["Cowpea", "Sorghum"], mechanism: "Nutrient (P-activation)", source: "PMC10331949", confidence: "High" },
  { id: 16, combination: ["Cabbage", "Clover"], mechanism: "Pest (reduces cabbage aphid/cabbageworm)", source: "General literature", confidence: "Moderate" },
  { id: 17, combination: ["Tomato", "Basil"], mechanism: "Pest (repels aphids, hornworms)", source: "General literature", confidence: "Moderate" },
  { id: 18, combination: ["Tomato", "Marigold"], mechanism: "Pest (nematode suppression)", source: "General literature", confidence: "Moderate" },
  { id: 19, combination: ["Tomato", "Carrot", "Celery", "Onion family", "Lettuce", "Parsley", "Spinach", "Asparagus"], mechanism: "Space/Pest", source: "General literature", confidence: "Moderate" },
  { id: 20, combination: ["Corn", "Beans", "Squash"], mechanism: "Nitrogen fixation, structural support, weed suppression", source: "General literature (Three Sisters)", confidence: "High" },
  { id: 21, combination: ["Brassicas", "Thyme"], mechanism: "Pest (repels cabbage moth)", source: "General literature", confidence: "Moderate" },
  { id: 22, combination: ["Cucumber", "Nasturtium"], mechanism: "Pest (aphid trap)", source: "General literature", confidence: "Moderate" },
  { id: 23, combination: ["Lettuce", "Radish"], mechanism: "Pest (flea beetle deterrent)", source: "General literature", confidence: "Moderate" },
  { id: 24, combination: ["Potato", "Beans"], mechanism: "Nutrient (N-fixation) / Pest", source: "General literature", confidence: "Moderate" },
  { id: 25, combination: ["Onion", "Carrot"], mechanism: "Pest (masks carrot fly)", source: "General literature", confidence: "Moderate" },
  { id: 26, combination: ["Banana", "Coconut", "Turmeric or Ginger"], mechanism: "Space (shade-tolerant intercrop), nutrient use efficiency", source: "General agronomic practice — verify locally", confidence: "Contextual" },
  { id: 27, combination: ["Coconut", "Black Pepper"], mechanism: "Space (living support), income diversification", source: "General agronomic practice", confidence: "Contextual" },
  { id: 28, combination: ["Coffee", "Cardamom", "Rubber"], mechanism: "Space (shade requirement match)", source: "General agronomic practice", confidence: "Contextual" }
];

// 3. AVOID PAIRS
const avoidPairs = [
  { id: 1, combination: ["Tomato", "Potato"], reason: "Both nightshades; share early/late blight and Colorado potato beetle risk", confidence: "High" },
  { id: 2, combination: ["Tomato", "Corn"], reason: "Both attacked by the same pest (corn earworm = tomato fruitworm)", confidence: "High" },
  { id: 3, combination: ["Tomato", "Cabbage/Brassicas"], reason: "Brassicas are heavy feeders and compete for the same nutrients; tomatoes can stunt them", confidence: "Moderate" },
  { id: 4, combination: ["Tomato", "Fennel"], reason: "Fennel is allelopathic, exudes root compounds that inhibit tomato growth", confidence: "High" },
  { id: 5, combination: ["Tomato", "Dill (mature)"], reason: "Mature dill can inhibit tomato growth and attract hornworms", confidence: "Moderate" },
  { id: 6, combination: ["Tomato", "Eggplant/Pepper (dense planting)"], reason: "Same nightshade family — shared pest/disease pressure", confidence: "Moderate" },
  { id: 7, combination: ["Onion/Garlic family", "Beans/Peas"], reason: "Alliums inhibit legume growth/nodulation", confidence: "High" },
  { id: 8, combination: ["Onion", "Asparagus"], reason: "Competitive root growth patterns", confidence: "Moderate" },
  { id: 9, combination: ["Cabbage family", "Strawberries"], reason: "Shared pests/diseases; poor mutual growth habit", confidence: "Moderate" },
  { id: 10, combination: ["Cabbage/Brassicas", "Tomato"], reason: "See id 3", confidence: "Moderate" },
  { id: 11, combination: ["Potato", "Sunflower"], reason: "Sunflower seed compounds suppress potato growth (allelopathy)", confidence: "Moderate" },
  { id: 12, combination: ["Potato", "Cucumber/Squash (vine crops)"], reason: "Increases blight/fungal disease risk in humid conditions", confidence: "Moderate" },
  { id: 13, combination: ["Potato", "Tomato/Eggplant"], reason: "See id 1", confidence: "High" },
  { id: 14, combination: ["Carrot", "Dill (mature)"], reason: "Mature dill cross-pollinates and can stunt carrot", confidence: "Moderate" },
  { id: 15, combination: ["Beans/Peas", "Onion/Garlic/Leek"], reason: "See id 7", confidence: "High" },
  { id: 16, combination: ["Beans", "Sunflower"], reason: "Sunflower allelopathy suppresses bean growth in some studies", confidence: "Low-Moderate" },
  { id: 17, combination: ["Corn", "Tomato"], reason: "See id 2", confidence: "High" },
  { id: 18, combination: ["Sugarcane", "Okra/Peppers/Sunflower"], reason: "Documented poor pairing in sugarcane intercropping guides", confidence: "Moderate" },
  { id: 19, combination: ["Watermelon", "Irish Potato/Mustard"], reason: "Documented poor pairing", confidence: "Moderate" },
  { id: 20, combination: ["Radish", "Cabbage/Broccoli/Cauliflower/Turnip/Mustard"], reason: "Same brassica family, dense planting — germination competition, shared pests", confidence: "Moderate" },
  { id: 21, combination: ["Walnut (Juglans)", "Tomato/Pepper/Eggplant/Potato"], reason: "Walnut roots exude juglone, toxic to nightshades", confidence: "High" },
  { id: 22, combination: ["Fennel", "almost any vegetable"], reason: "Strong allelopath; isolate in its own bed/container", confidence: "High" },
  { id: 23, combination: ["Rice", "weeds/allelopathy-sensitive intercrops in flooded systems"], reason: "Standing water limits true intercropping", confidence: "Contextual" },
  { id: 24, combination: ["Groundnut/Soyabean", "tall shading crops planted too close"], reason: "Oilseeds need full sun; shading reduces pod fill", confidence: "Moderate" },
  { id: 25, combination: ["Mustard/Sesamum", "Brassica-family pests nearby in bloom stage"], reason: "Shared aphid/flea-beetle pressure at flowering", confidence: "Moderate" },
  { id: 26, combination: ["Turmeric/Chili/Cardamom/Black Pepper", "waterlogging-prone companions"], reason: "Rhizome/root crops are highly sensitive to excess soil moisture", confidence: "Contextual" }
];

// 4. NUTRIENT RULES
const nutrientRules = [
  { id: 'rule_conventional', mode: 'Conventional', npkDefault: '120:60:60 NPK kg/ha', splitAdvice: '50% N + 100% PK basal, 50% N split at flowering' },
  { id: 'rule_organic', mode: 'Organic', npkDefault: 'Zero synthetic chemicals', splitAdvice: 'FYM 20 t/ha + Rhizobium/Azotobacter 5 kg/ha + PSB' },
  { id: 'rule_integrated', mode: 'Integrated', npkDefault: '75:25 INM Rule', splitAdvice: '75% synthetic NPK + 25% FYM/Biofertilizers + Foliar Zinc' }
];

async function runSeeding() {
  console.log("🚀 Starting Direct Firestore Seeding for project:", firebaseConfig.projectId);

  // Seed Crops
  const batch1 = writeBatch(db);
  crops.forEach(c => {
    const ref = doc(db, "crops", `crop_${c.id}`);
    batch1.set(ref, c, { merge: true });
  });
  await batch1.commit();
  console.log(`✅ Seeded ${crops.length} crops into Firestore.`);

  // Seed Companions
  const batch2 = writeBatch(db);
  companions.forEach(c => {
    const ref = doc(db, "companions", `companion_${c.id}`);
    batch2.set(ref, c, { merge: true });
  });
  await batch2.commit();
  console.log(`✅ Seeded ${companions.length} companions into Firestore.`);

  // Seed Avoid Pairs
  const batch3 = writeBatch(db);
  avoidPairs.forEach(a => {
    const ref = doc(db, "avoidPairs", `avoid_${a.id}`);
    batch3.set(ref, a, { merge: true });
  });
  await batch3.commit();
  console.log(`✅ Seeded ${avoidPairs.length} avoid pairs into Firestore.`);

  // Seed Nutrient Rules
  const batch4 = writeBatch(db);
  nutrientRules.forEach(n => {
    const ref = doc(db, "nutrientRules", n.id);
    batch4.set(ref, n, { merge: true });
  });
  await batch4.commit();
  console.log(`✅ Seeded ${nutrientRules.length} nutrient rules into Firestore.`);

  console.log("🎉 Firestore Database Seeding Completed Successfully!");
  process.exit(0);
}

runSeeding().catch(err => {
  console.error("❌ Firestore Seeding Error:", err);
  process.exit(1);
});
