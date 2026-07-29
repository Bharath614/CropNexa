import os
import json
import time
from deep_translator import GoogleTranslator

# The list of target languages provided by the user.
# Google translate language codes: 
# ta: Tamil, hi: Hindi, te: Telugu, kn: Kannada, ml: Malayalam, 
# bn: Bengali, gu: Gujarati, mr: Marathi, pa: Punjabi, or: Odia
LANGUAGES = ['ta', 'hi', 'te', 'kn', 'ml', 'bn', 'gu', 'mr', 'pa', 'or']

# The comprehensive dictionary requested by the user
en_dict = {
    # Dashboard & General
    "welcomeMessage": "Welcome to Companion Planting DSS",
    "weatherSummary": "Weather Summary",
    "soilHealthCard": "Soil Health Status",
    "aiInsights": "AI Insights & Recommendations",
    "companionPlannerCard": "Companion Planting Recommendations",
    "calendarOfOperations": "Calendar of Operations",
    "notificationsTitle": "Notifications",
    "statistics": "Farm Statistics",
    "charts": "Performance Charts",
    "save": "Save",
    "cancel": "Cancel",
    "submit": "Submit",
    "download": "Download Report",
    
    # Weather Module
    "temperature": "Temperature",
    "rainfall": "Rainfall",
    "humidity": "Humidity",
    "dewPoint": "Dew Point",
    "windSpeed": "Wind Speed",
    "windDirection": "Wind Direction",
    "weatherConditions": "Weather Conditions",
    "sunny": "Sunny",
    "rainy": "Rainy",
    "cloudy": "Cloudy",
    "partlyCloudy": "Partly Cloudy",
    "stormy": "Stormy",
    "forecast": "Weather Forecast",
    "weatherAlerts": "Weather Alerts",
    
    # Soil Health Module
    "soilHealthScore": "Soil Health Score",
    "soilPh": "Soil pH",
    "organicCarbon": "Organic Carbon",
    "nitrogen": "Nitrogen (N)",
    "phosphorus": "Phosphorus (P)",
    "potassium": "Potassium (K)",
    "zinc": "Zinc (Zn)",
    "iron": "Iron (Fe)",
    "boron": "Boron (B)",
    "deficiencyStatus": "Deficiency Status",
    "soilRecommendations": "Soil Recommendations",
    "fertilizerSuggestions": "Fertilizer Suggestions",
    
    # Companion Planner
    "cropNames": "Crop Names",
    "companionPlantNames": "Companion Plants",
    "plantsToAvoid": "Plants to Avoid",
    "compatibilityScore": "Compatibility Score",
    "soilBenefits": "Soil Benefits",
    "pestControl": "Pest Control",
    "diseaseControl": "Disease Control",
    "pollinatorBenefits": "Pollinator Benefits",
    "scientificExplanation": "Scientific Explanation",
    "recommendationCards": "Recommendation Cards",
    
    # AI Insights
    "yieldPrediction": "Yield Prediction",
    "diseasePrediction": "Disease Prediction",
    "pestPrediction": "Pest Prediction",
    "waterRecommendation": "Water Management Recommendation",
    "weatherImpact": "Weather Impact",
    "nutrientRecommendation": "Nutrient Management Recommendation",
    
    # Nutrient Guide
    "nutrientNames": "Nutrient Requirements",
    "deficiencySymptoms": "Deficiency Symptoms",
    "organicSources": "Organic Sources",
    "chemicalSources": "Chemical Sources",
    "dosage": "Recommended Dosage",
    "applicationMethod": "Application Method",
    
    # Farm Calendar
    "germination": "Germination Phase",
    "growth": "Vegetative Growth",
    "flowering": "Flowering Stage",
    "fruiting": "Fruiting Stage",
    "harvest": "Harvesting",
    "irrigationSchedule": "Irrigation Schedule",
    "fertilizerSchedule": "Fertilizer Schedule",
    "weedManagement": "Weed Management",
    "diseaseMonitoring": "Disease Monitoring",
    "harvestReminder": "Harvest Reminder",
    
    # Profile
    "farmerNameLabel": "Farmer Name",
    "farmNameLabel": "Farm Name",
    "addressLabel": "Address",
    "locationLabel": "Location",
    "districtLabel": "District",
    "stateLabel": "State",
    "countryLabel": "Country",
    "farmAreaLabel": "Farm Area (Hectares)",
    "soilTypeLabel": "Primary Soil Type",
    "farmingModeLabel": "Farming Mode",
    "languagePreference": "Language Preference",
    
    # Dynamic Elements Base
    "organicFarming": "Organic Farming",
    "conventionalFarming": "Conventional Farming",
    "inm": "Integrated Nutrient Management",
    
    # Soil Classes
    "soilClassExcellent": "Excellent",
    "soilClassGood": "Good",
    "soilClassModerate": "Moderate",
    "soilClassPoor": "Poor",
    "soilClassCritical": "Critical"
}

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

# Path setup
locales_dir = os.path.join(os.getcwd(), 'public', 'locales')
ensure_dir(locales_dir)

# Merge with existing en.json if it exists
en_dir = os.path.join(locales_dir, 'en')
ensure_dir(en_dir)
en_file = os.path.join(en_dir, 'translation.json')

existing_en = {}
if os.path.exists(en_file):
    with open(en_file, 'r', encoding='utf-8') as f:
        try:
            existing_en = json.load(f)
        except Exception:
            pass

final_en = {**existing_en, **en_dict}

# Write english file
with open(en_file, 'w', encoding='utf-8') as f:
    json.dump(final_en, f, indent=2, ensure_ascii=False)

print(f"Total English keys: {len(final_en)}")

# Translate for each language
for lang in LANGUAGES:
    lang_dir = os.path.join(locales_dir, lang)
    ensure_dir(lang_dir)
    lang_file = os.path.join(lang_dir, 'translation.json')
    
    # Load existing if available to skip translating already translated keys
    existing_lang = {}
    if os.path.exists(lang_file):
        with open(lang_file, 'r', encoding='utf-8') as f:
            try:
                existing_lang = json.load(f)
            except Exception:
                pass
    
    # we need to translate final_en keys that are missing or are equal to the English key or have the '[LANG]' prefix from the dummy script
    keys_to_translate = []
    for k, v in final_en.items():
        if k not in existing_lang:
            keys_to_translate.append((k, v))
        else:
            # Check if it was a dummy translation e.g. "[TA] Welcome back"
            if existing_lang[k].startswith('[') and ']' in existing_lang[k]:
                keys_to_translate.append((k, v))
    
    if not keys_to_translate:
        print(f"{lang} is already fully translated.")
        continue
    
    print(f"Translating {len(keys_to_translate)} keys for {lang}...")
    translator = GoogleTranslator(source='en', target=lang)
    
    for i in range(0, len(keys_to_translate), 50): # Translate in chunks of 50 to avoid API blocks
        chunk = keys_to_translate[i:i+50]
        texts = [c[1] for c in chunk]
        try:
            translated = translator.translate_batch(texts)
            for j, t in enumerate(translated):
                key = chunk[j][0]
                existing_lang[key] = t
        except Exception as e:
            print(f"Error translating chunk for {lang}: {e}")
            # fallback to individual translation
            for k, text in chunk:
                try:
                    res = translator.translate(text)
                    existing_lang[k] = res
                    time.sleep(0.5)
                except Exception as ex:
                    print(f"Failed to translate {k} for {lang}: {ex}")
                    existing_lang[k] = text
        time.sleep(1) # delay between batches
        
    with open(lang_file, 'w', encoding='utf-8') as f:
        json.dump(existing_lang, f, indent=2, ensure_ascii=False)
        
print("Translation generation complete!")
