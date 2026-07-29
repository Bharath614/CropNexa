/* eslint-disable */
const fs = require('fs');
const path = require('path');

const enDict = {
  welcomeBack: 'Welcome back',
  smartAlerts: 'Smart Alerts',
  logout: 'Logout',
  login: 'Login',
  register: 'Register',
  settings: 'Settings',
  language: 'Language',
  dashTitle: 'Farm Command Center',
  dashSoilScore: 'Soil Health Score',
  dashCurrentCrop: 'Current Active Crop',
  dashFarmingMode: 'Farming Mode',
  dashWeatherSummary: 'Current Weather',
  dashPendingTasks: 'Pending Operations',
  dashAiRecommendation: 'AI Agronomist Recommendation',
  soilTitle: 'Dynamic Soil Health Evaluation Engine',
  soilScoreTitle: 'Soil Health Index',
  soilUploadTitle: 'Upload Soil Test Report',
  soilUploadSubtitle: 'Supports PDF, JPG, JPEG, PNG',
  soilManualEntry: 'Manual Metric Entry',
  soilClassExcellent: 'Excellent',
  soilClassGood: 'Good',
  soilClassModerate: 'Moderate',
  soilClassPoor: 'Poor',
  soilClassCritical: 'Critical',
  authLoginTitle: 'Farmer Sign In',
  authRegisterTitle: 'New Farmer Registration',
  authEmailOrMobile: 'Email Address or Mobile Number',
  authPassword: 'Password',
  authConfirmPassword: 'Confirm Password',
  authFullName: 'Full Farmer Name',
  authFarmName: 'Farm Name',
  authState: 'State',
  authDistrict: 'District',
  authVillage: 'Village / Tehsil',
  authTotalArea: 'Total Farm Area (Hectares)',
  weatherTitle: 'Weather Intelligence',
  weatherTemp: 'Temperature',
  weatherRain: 'Rainfall',
  weatherHumidity: 'Humidity',
  weatherWind: 'Wind Speed',
  companionTitle: 'Companion Planner',
  nutrientTitle: 'Nutrient Management',
  aiInsightsTitle: 'AI Yield Analytics',
  calendarTitle: 'Farming Schedule',
  reportsTitle: 'Seasonal Reports',
  notificationsTitle: 'Notification Center',
  targetCrop: 'Target Crop',
  landAndActiveCrop: 'Land & Active Crop',
  hectares: 'Hectares',
  irrigated: 'Irrigated',
  systemMode: 'System Mode',
  weatherDetails: 'Weather Details',
  optimalCompanion: 'Optimal Companion Planting Strategy',
  liveChemistry: 'Live Chemistry Match',
  splitNutrient: 'Split Nutrient Dosage Schedule',
  growthStage: 'Growth Stage',
  pairWith: 'Pair',
  with: 'with',
  totalArea: 'Total Area (Ha)',
  farmingPractice: 'Farming Practice',
  primaryCrop: 'Primary Crop',
  secondaryCrop: 'Secondary Crop / Companion'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Swap getTranslation for useTranslation hook
  if (content.includes("import { getTranslation }") || content.includes("import { LanguageCode, SUPPORTED_LANGUAGES, getTranslation }")) {
    content = content.replace(/import \{.*?getTranslation.*?\} from '.*?i18n';/g, "import { useTranslation } from 'react-i18next';\nimport { LanguageCode, SUPPORTED_LANGUAGES } from '@/utils/i18n';");
    changed = true;
  }
  
  // Replace the t function definition
  if (content.includes('const t = (key: string) => getTranslation(currentLanguage, key);')) {
    content = content.replace(/const t = \(key: string\) => getTranslation\(currentLanguage, key\);/g, 'const { t } = useTranslation();');
    changed = true;
  }
  
  // Replace text fragments
  for (const [key, val] of Object.entries(enDict)) {
    const regex1 = new RegExp('>' + val + '<', 'g');
    if (regex1.test(content)) {
      content = content.replace(regex1, '>{t(\'' + key + '\')}<');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
  }
}

console.log('Refactoring complete.');
