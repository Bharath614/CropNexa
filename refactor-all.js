/* eslint-disable */
const fs = require('fs');
const path = require('path');

const DICTIONARY = {
    // Weather
    "Temperature": "temperature",
    "Rainfall": "rainfall",
    "Humidity": "humidity",
    "Dew Point": "dewPoint",
    "Wind Speed": "windSpeed",
    "Wind Direction": "windDirection",
    "Weather Conditions": "weatherConditions",
    "Sunny": "sunny",
    "Rainy": "rainy",
    "Cloudy": "cloudy",
    "Partly Cloudy": "partlyCloudy",
    "Stormy": "stormy",
    "Weather Forecast": "forecast",
    "Weather Alerts": "weatherAlerts",
    
    // Soil
    "Soil Health Score": "soilHealthScore",
    "Soil pH": "soilPh",
    "Organic Carbon": "organicCarbon",
    "Nitrogen (N)": "nitrogen",
    "Phosphorus (P)": "phosphorus",
    "Potassium (K)": "potassium",
    "Zinc (Zn)": "zinc",
    "Iron (Fe)": "iron",
    "Boron (B)": "boron",
    "Deficiency Status": "deficiencyStatus",
    "Soil Recommendations": "soilRecommendations",
    "Fertilizer Suggestions": "fertilizerSuggestions",
    
    // Companion
    "Companion Plants": "companionPlantNames",
    "Plants to Avoid": "plantsToAvoid",
    "Compatibility Score": "compatibilityScore",
    "Soil Benefits": "soilBenefits",
    "Pest Control": "pestControl",
    "Disease Control": "diseaseControl",
    "Pollinator Benefits": "pollinatorBenefits",
    "Scientific Explanation": "scientificExplanation",
    "Recommendation Cards": "recommendationCards",
    
    // AI Insights
    "Yield Prediction": "yieldPrediction",
    "Disease Prediction": "diseasePrediction",
    "Pest Prediction": "pestPrediction",
    "Water Management Recommendation": "waterRecommendation",
    "Weather Impact": "weatherImpact",
    "Nutrient Management Recommendation": "nutrientRecommendation",
    
    // Farm Calendar
    "Germination Phase": "germination",
    "Vegetative Growth": "growth",
    "Flowering Stage": "flowering",
    "Fruiting Stage": "fruiting",
    "Harvesting": "harvest",
    "Irrigation Schedule": "irrigationSchedule",
    "Fertilizer Schedule": "fertilizerSchedule",
    "Weed Management": "weedManagement",
    "Disease Monitoring": "diseaseMonitoring",
    "Harvest Reminder": "harvestReminder",
    
    // Profile
    "Farmer Name": "farmerNameLabel",
    "Farm Name": "farmNameLabel",
    "Address": "addressLabel",
    "Location": "locationLabel",
    "District": "districtLabel",
    "State": "stateLabel",
    "Country": "countryLabel",
    "Farm Area (Hectares)": "farmAreaLabel",
    "Primary Soil Type": "soilTypeLabel",
    "Farming Mode": "farmingModeLabel",
    "Language Preference": "languagePreference",
    
    "Organic Farming": "organicFarming",
    "Conventional Farming": "conventionalFarming",
    "Integrated Nutrient Management": "inm",
    
    "Excellent": "soilClassExcellent",
    "Good": "soilClassGood",
    "Moderate": "soilClassModerate",
    "Poor": "soilClassPoor",
    "Critical": "soilClassCritical",
    "Save": "save",
    "Cancel": "cancel",
    "Submit": "submit",
    "Download Report": "download"
};

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    
    // Skip if it doesn't even contain 'useTranslation' yet, 
    // actually we should probably ensure it has it, but it's safe to just replace strings.
    // Ensure useTranslation exists if we make replacements
    let madeReplacements = false;
    
    for (const [english, key] of Object.entries(DICTIONARY)) {
        // 1. Replace JSX Text `>Text<`
        const jsxRegex = new RegExp(`>\\s*${escapeRegExp(english)}\\s*<`, 'g');
        if (jsxRegex.test(content)) {
            content = content.replace(jsxRegex, `>{t('${key}')}<`);
            madeReplacements = true;
        }
        
        // 2. Replace String literals inside components `"Text"` or `'Text'` (Be careful not to replace object keys)
        // We will only do this for specific known labels safely by looking for common patterns
        const quoteRegex1 = new RegExp(`'${escapeRegExp(english)}'`, 'g');
        const quoteRegex2 = new RegExp(`"${escapeRegExp(english)}"`, 'g');
        
        // Let's replace ONLY if it's inside JSX curly braces or a variable assignment that looks safe
        // A safer way is to just wrap the text if we know it's a known string.
        // Actually replacing string literals is risky. Let's do it specifically for JSX props like title="Text" -> title={t('key')}
        const propRegex = new RegExp(`([a-zA-Z]+)="\\s*${escapeRegExp(english)}\\s*"`, 'g');
        if (propRegex.test(content)) {
            content = content.replace(propRegex, `$1={t('${key}')}`);
            madeReplacements = true;
        }
    }
    
    // Add useTranslation if not present but we made replacements
    if (madeReplacements) {
        if (!content.includes("useTranslation")) {
            content = `import { useTranslation } from 'react-i18next';\n` + content;
            
            // Try to find the component definition to inject const { t } = useTranslation();
            const compRegex = /export const ([a-zA-Z0-9_]+): React\.FC[a-zA-Z<>]* = \([^)]*\) => {/g;
            content = content.replace(compRegex, (match) => {
                return match + `\n  const { t } = useTranslation();\n`;
            });
            
            const defRegex = /export default function ([a-zA-Z0-9_]+)\([^)]*\) {/g;
            content = content.replace(defRegex, (match) => {
                return match + `\n  const { t } = useTranslation();\n`;
            });
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^$\{key\}()|[\\]\\]/g, '\\$&'); // $& means the whole matched string
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

walk(path.join(__dirname, 'src'));
console.log('Done refactoring!');
