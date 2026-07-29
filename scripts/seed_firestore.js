/**
 * seed_firestore.js
 *
 * One-time (or re-runnable) seeder that loads the companion planting
 * knowledge base into Firestore.
 *
 * SETUP:
 *   1. npm install firebase-admin
 *   2. Download a service account key from:
 *      Firebase Console → Project Settings → Service Accounts → Generate new private key
 *      Save it as ./serviceAccountKey.json (DO NOT commit this file)
 *   3. node scripts/seed_firestore.js
 *
 * Re-running is safe: it uses deterministic doc IDs (e.g. "companion_1"),
 * so it overwrites rather than duplicates.
 */

const admin = require("firebase-admin");

let serviceAccount;
try {
  serviceAccount = require("./serviceAccountKey.json");
} catch (e) {
  // Graceful fallback if running in environment with application default credentials
  console.log("No serviceAccountKey.json found, attempting default initialization...");
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || "cropnexa-c059f"
  });
}

const db = admin.firestore();

// ---------------------------------------------------------------------------
// 1. CROPS
// ---------------------------------------------------------------------------
const crops = [
  "Rice", "Wheat", "Millets", "Maize", "Sugarcane", "Cotton", "Jute",
  "Groundnut", "Sunflower", "Soyabean", "Mustard", "Sesamum",
  "Tea", "Coffee", "Rubber", "Turmeric", "Chili", "Cardamom",
  "Black Pepper", "Grapes", "Mango", "Banana", "Onion", "Cashew",
  "Walnut", "Fig", "Tomato", "Potato", "Coconut",
].map((name, i) => ({
  id: `crop_${i + 1}`,
  name,
}));

// ---------------------------------------------------------------------------
// 2. COMPANIONS (good pairings)
// ---------------------------------------------------------------------------
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
  { id: 28, combination: ["Coffee", "Cardamom", "Rubber"], mechanism: "Space (shade requirement match)", source: "General agronomic practice", confidence: "Contextual" },
];

// ---------------------------------------------------------------------------
// 3. AVOID PAIRS (antagonistic combinations)
// ---------------------------------------------------------------------------
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
  { id: 26, combination: ["Turmeric/Chili/Cardamom/Black Pepper", "waterlogging-prone companions"], reason: "Rhizome/root crops are highly sensitive to excess soil moisture", confidence: "Contextual" },
];

// ---------------------------------------------------------------------------
// SEED RUNNER
// ---------------------------------------------------------------------------
async function seedCollection(collectionName, docs, idPrefix) {
  const batch = db.batch();
  docs.forEach((doc) => {
    const docId = `${idPrefix}_${doc.id || doc.name}`;
    const ref = db.collection(collectionName).doc(String(docId));
    batch.set(ref, doc, { merge: true });
  });
  await batch.commit();
  console.log(`Seeded ${docs.length} docs into "${collectionName}"`);
}

async function main() {
  await seedCollection("crops", crops, "crop");
  await seedCollection("companions", companions, "companion");
  await seedCollection("avoidPairs", avoidPairs, "avoid");
  console.log("✅ Firestore seeding complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
