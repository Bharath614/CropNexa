package com.cropnexa.app;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class CompanionEngine {

    public static class Crop {
        public String id;
        public String name;
        public String category;
        public Crop(String id, String name, String category) {
            this.id = id; this.name = name; this.category = category;
        }
    }

    public static final List<Crop> MASTER_CROPS = Arrays.asList(
        new Crop("rice", "Rice", "cereal"),
        new Crop("wheat", "Wheat", "cereal"),
        new Crop("millets", "Millets", "millet"),
        new Crop("maize", "Maize", "cereal"),
        new Crop("sugarcane", "Sugarcane", "sugar"),
        new Crop("cotton", "Cotton", "fiber"),
        new Crop("jute", "Jute", "fiber"),
        new Crop("groundnut", "Groundnut", "oilseed"),
        new Crop("sunflower", "Sunflower", "oilseed"),
        new Crop("soyabean", "Soyabean", "oilseed"),
        new Crop("mustard", "Mustard", "oilseed"),
        new Crop("sesamum", "Sesamum", "oilseed"),
        new Crop("tea", "Tea", "plantation"),
        new Crop("coffee", "Coffee", "plantation"),
        new Crop("rubber", "Rubber", "plantation"),
        new Crop("turmeric", "Turmeric", "spice"),
        new Crop("chili", "Chili", "spice"),
        new Crop("cardamom", "Cardamom", "spice"),
        new Crop("blackpepper", "Black Pepper", "spice"),
        new Crop("grapes", "Grapes", "fruit"),
        new Crop("mango", "Mango", "fruit"),
        new Crop("banana", "Banana", "fruit"),
        new Crop("onion", "Onion", "vegetable"),
        new Crop("cashew", "Cashew", "fruit"),
        new Crop("walnut", "Walnut", "fruit"),
        new Crop("fig", "Fig", "fruit"),
        new Crop("tomato", "Tomato", "vegetable"),
        new Crop("potato", "Potato", "vegetable"),
        new Crop("coconut", "Coconut", "plantation")
    );

    public static class CompanionPair {
        public List<String> combination;
        public String mechanism;
        public String source;
        public String confidence;
        public CompanionPair(List<String> combination, String mechanism, String source, String confidence) {
            this.combination = combination; this.mechanism = mechanism; this.source = source; this.confidence = confidence;
        }
    }

    public static final List<CompanionPair> SEED_COMPANIONS = Arrays.asList(
        new CompanionPair(Arrays.asList("Wheat", "White Lupin"), "Soil (P-solubilization)", "PMC10331949", "High"),
        new CompanionPair(Arrays.asList("Green Onion", "Cucumber"), "Nutrient (K-uptake)", "PMC10331949", "High"),
        new CompanionPair(Arrays.asList("Cucumber", "Garlic"), "Pest deterrence", "PMC10331949", "High"),
        new CompanionPair(Arrays.asList("Cucumber", "Mustard", "Sesame"), "Pest / Soil", "PMC10331949", "Moderate"),
        new CompanionPair(Arrays.asList("Cotton", "Sorghum"), "Trap cropping (Pest)", "PMC6316212", "High"),
        new CompanionPair(Arrays.asList("Sweet Corn", "Black Mustard"), "Trap cropping", "PMC6316212", "High"),
        new CompanionPair(Arrays.asList("Cucumber", "Butternut Squash", "Watermelon", "Squash varieties"), "Trap cropping", "PMC6316212", "Moderate"),
        new CompanionPair(Arrays.asList("Cotton", "Mung Bean"), "Nitrogen fixation / Pest", "PMC6316212", "High"),
        new CompanionPair(Arrays.asList("Tomato", "Corn"), "Space/Pest — CAUTION: see avoid_pairs id 2", "PMC6316212", "Low"),
        new CompanionPair(Arrays.asList("Cauliflower", "Chinese Cabbage", "Marigold", "Rapeseed", "Sunflower"), "Trap cropping", "PMC6316212", "Moderate"),
        new CompanionPair(Arrays.asList("Desmodium grasses", "Napier grass"), "Push-pull pest control", "PMC6316212", "High"),
        new CompanionPair(Arrays.asList("Onion", "Buckwheat"), "Pest / Pollinator", "PMC6316212", "Moderate"),
        new CompanionPair(Arrays.asList("Bell Pepper", "Sunflower", "Grain Sorghum"), "Trap cropping", "PMC6316212", "Moderate"),
        new CompanionPair(Arrays.asList("Peanut", "Corn"), "Nutrient (P-activation)", "PMC10331949", "High"),
        new CompanionPair(Arrays.asList("Cowpea", "Sorghum"), "Nutrient (P-activation)", "PMC10331949", "High"),
        new CompanionPair(Arrays.asList("Cabbage", "Clover"), "Pest (reduces cabbage aphid)", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Tomato", "Basil"), "Pest (repels aphids, hornworms)", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Tomato", "Marigold"), "Pest (nematode suppression)", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Tomato", "Carrot", "Celery", "Onion family", "Lettuce", "Parsley", "Spinach", "Asparagus"), "Space/Pest", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Corn", "Beans", "Squash"), "Nitrogen fixation, structural support", "General literature", "High"),
        new CompanionPair(Arrays.asList("Brassicas", "Thyme"), "Pest (repels cabbage moth)", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Cucumber", "Nasturtium"), "Pest (aphid trap)", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Lettuce", "Radish"), "Pest (flea beetle deterrent)", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Potato", "Beans"), "Nutrient (N-fixation) / Pest", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Onion", "Carrot"), "Pest (masks carrot fly)", "General literature", "Moderate"),
        new CompanionPair(Arrays.asList("Banana", "Coconut", "Turmeric", "Ginger"), "Space (shade-tolerant intercrop)", "General agronomic", "Contextual"),
        new CompanionPair(Arrays.asList("Coconut", "Black Pepper"), "Space (living support)", "General agronomic", "Contextual"),
        new CompanionPair(Arrays.asList("Coffee", "Cardamom", "Rubber"), "Space (shade requirement match)", "General agronomic", "Contextual")
    );

    public static class AvoidPair {
        public List<String> combination;
        public String reason;
        public String confidence;
        public AvoidPair(List<String> combination, String reason, String confidence) {
            this.combination = combination; this.reason = reason; this.confidence = confidence;
        }
    }

    public static final List<AvoidPair> SEED_AVOID_PAIRS = Arrays.asList(
        new AvoidPair(Arrays.asList("Tomato", "Potato"), "Both nightshades; share early/late blight risk", "High"),
        new AvoidPair(Arrays.asList("Tomato", "Corn"), "Both attacked by same pest (corn earworm)", "High"),
        new AvoidPair(Arrays.asList("Tomato", "Cabbage", "Brassicas"), "Brassicas are heavy feeders; tomatoes can stunt them", "Moderate"),
        new AvoidPair(Arrays.asList("Tomato", "Fennel"), "Fennel is allelopathic, inhibits tomato growth", "High"),
        new AvoidPair(Arrays.asList("Tomato", "Dill"), "Mature dill can inhibit tomato growth", "Moderate"),
        new AvoidPair(Arrays.asList("Tomato", "Eggplant", "Pepper"), "Same nightshade family — shared pest pressure", "Moderate"),
        new AvoidPair(Arrays.asList("Onion", "Garlic", "Beans", "Peas"), "Alliums inhibit legume nodulation", "High"),
        new AvoidPair(Arrays.asList("Onion", "Asparagus"), "Competitive root growth patterns", "Moderate"),
        new AvoidPair(Arrays.asList("Cabbage", "Strawberries"), "Shared pests/diseases; poor growth habit", "Moderate"),
        new AvoidPair(Arrays.asList("Potato", "Sunflower"), "Sunflower seeds suppress potato growth", "Moderate"),
        new AvoidPair(Arrays.asList("Potato", "Cucumber", "Squash"), "Increases blight risk", "Moderate"),
        new AvoidPair(Arrays.asList("Carrot", "Dill"), "Mature dill cross-pollinates and stunts carrot", "Moderate"),
        new AvoidPair(Arrays.asList("Beans", "Sunflower"), "Sunflower allelopathy suppresses bean growth", "Low-Moderate"),
        new AvoidPair(Arrays.asList("Sugarcane", "Okra", "Peppers", "Sunflower"), "Poor pairing in sugarcane intercropping", "Moderate"),
        new AvoidPair(Arrays.asList("Watermelon", "Irish Potato", "Mustard"), "Documented poor pairing", "Moderate"),
        new AvoidPair(Arrays.asList("Radish", "Cabbage", "Broccoli", "Cauliflower"), "Same family, dense planting competition", "Moderate"),
        new AvoidPair(Arrays.asList("Walnut", "Tomato", "Pepper", "Eggplant", "Potato"), "Walnut exudes juglone, toxic to nightshades", "High"),
        new AvoidPair(Arrays.asList("Fennel", "vegetable"), "Strong allelopath; isolate", "High"),
        new AvoidPair(Arrays.asList("Rice", "weeds"), "Standing water limits true intercropping", "Contextual"),
        new AvoidPair(Arrays.asList("Groundnut", "Soyabean", "tall crop"), "Oilseeds need full sun; shading reduces yield", "Moderate"),
        new AvoidPair(Arrays.asList("Mustard", "Sesamum", "Brassica"), "Shared aphid pressure at flowering", "Moderate"),
        new AvoidPair(Arrays.asList("Turmeric", "Chili", "Cardamom", "Black Pepper", "waterlogging crop"), "Sensitive to excess moisture", "Contextual")
    );

    public static class AvoidCheckResult {
        public boolean isAvoided;
        public String reason;
        public String confidence;
    }

    public static AvoidCheckResult isPairInAvoidTable(String cropA, String cropB) {
        String cA = cropA.toLowerCase();
        String cB = cropB.toLowerCase();
        AvoidCheckResult res = new AvoidCheckResult();
        res.isAvoided = false;

        for (AvoidPair avoid : SEED_AVOID_PAIRS) {
            boolean matchA = false;
            boolean matchB = false;
            for (String item : avoid.combination) {
                String i = item.toLowerCase();
                if (cA.contains(i) || i.contains(cA)) matchA = true;
                if (cB.contains(i) || i.contains(cB)) matchB = true;
            }
            if (matchA && matchB) {
                res.isAvoided = true;
                res.reason = avoid.reason;
                res.confidence = avoid.confidence;
                return res;
            }
        }
        return res;
    }

    public static class CompanionResult {
        public String cropName;
        public String mechanism;
        public String source;
        public String confidence;
        public String stageSuitability;
        public String mechanismTag;
    }

    public static class AvoidResult {
        public String cropName;
        public String reason;
        public String confidence;
    }

    public static class EngineRecommendations {
        public boolean isMonocropAdvisory;
        public Crop targetCrop;
        public List<CompanionResult> companions = new ArrayList<>();
        public List<AvoidResult> avoids = new ArrayList<>();
        public List<String> rotationAdvice = new ArrayList<>();
    }

    public static EngineRecommendations getEngineRecommendations(String targetCropName, String stage, String mode, double landAreaHa) {
        EngineRecommendations recs = new EngineRecommendations();
        Crop target = MASTER_CROPS.get(0);
        for (Crop c : MASTER_CROPS) {
            if (c.name.equalsIgnoreCase(targetCropName)) {
                target = c;
                break;
            }
        }
        recs.targetCrop = target;
        recs.isMonocropAdvisory = landAreaHa > 10.0;
        
        String cNameLower = targetCropName.toLowerCase();
        
        for (AvoidPair avoid : SEED_AVOID_PAIRS) {
            boolean match = false;
            for (String item : avoid.combination) {
                String i = item.toLowerCase();
                if (cNameLower.contains(i) || i.contains(cNameLower)) {
                    match = true;
                    break;
                }
            }
            if (match) {
                String partner = avoid.combination.size() > 1 ? avoid.combination.get(1) : "Antagonistic Crop";
                for (String item : avoid.combination) {
                    if (!item.toLowerCase().contains(cNameLower) && !cNameLower.contains(item.toLowerCase())) {
                        partner = item;
                        break;
                    }
                }
                AvoidResult ar = new AvoidResult();
                ar.cropName = partner;
                ar.reason = avoid.reason;
                ar.confidence = avoid.confidence;
                recs.avoids.add(ar);
            }
        }

        if (!recs.isMonocropAdvisory) {
            for (CompanionPair comp : SEED_COMPANIONS) {
                boolean match = false;
                for (String item : comp.combination) {
                    String i = item.toLowerCase();
                    if (cNameLower.contains(i) || i.contains(cNameLower)) {
                        match = true;
                        break;
                    }
                }
                if (match) {
                    for (String item : comp.combination) {
                        String i = item.toLowerCase();
                        if (!cNameLower.contains(i) && !i.contains(cNameLower)) {
                            AvoidCheckResult check = isPairInAvoidTable(targetCropName, item);
                            if (!check.isAvoided) {
                                CompanionResult cr = new CompanionResult();
                                cr.cropName = item;
                                cr.mechanism = comp.mechanism;
                                cr.source = comp.source;
                                cr.confidence = comp.confidence;
                                
                                String m = comp.mechanism.toLowerCase();
                                String tag = "Nutrient";
                                if (m.contains("soil")) tag = "Soil";
                                else if (m.contains("pest") || m.contains("trap")) tag = "Pest";
                                else if (m.contains("space") || m.contains("shade")) tag = "Space";
                                
                                cr.mechanismTag = (comp.confidence.equals("High") && mode.toLowerCase().contains("organic")) ? "Organic Certified" : tag;
                                
                                cr.stageSuitability = (stage.equalsIgnoreCase("Germination") && (i.contains("brassica") || i.contains("radish"))) 
                                    ? "Caution at Germination" : "Suitable";
                                
                                recs.companions.add(cr);
                            }
                        }
                    }
                }
            }

            if (recs.companions.isEmpty()) {
                String[] defCrops = {"Cowpea", "Marigold", "Sunflower"};
                String[] defMechs = {"Nitrogen fixation", "Nematode control", "Pollinator attraction"};
                String[] defConf = {"High", "High", "Moderate"};
                String[] defTags = {"Nutrient", "Pest", "Pest"};
                for(int i=0; i<3; i++) {
                    if (!isPairInAvoidTable(targetCropName, defCrops[i]).isAvoided) {
                        CompanionResult cr = new CompanionResult();
                        cr.cropName = defCrops[i];
                        cr.mechanism = defMechs[i];
                        cr.source = "Default";
                        cr.confidence = defConf[i];
                        cr.mechanismTag = defTags[i];
                        cr.stageSuitability = "Suitable";
                        recs.companions.add(cr);
                    }
                }
            }
        }
        
        recs.rotationAdvice.add("Rotate " + target.name + " with leguminous crops.");
        recs.rotationAdvice.add("Incorporate green manure 45 days prior.");
        recs.rotationAdvice.add("Avoid continuous monoculture to suppress pathogens.");

        return recs;
    }

    public static class NutrientDetails {
        public List<String> basalDose = new ArrayList<>();
        public List<String> biofertilizers = new ArrayList<>();
        public List<String> foliarMicronutrients = new ArrayList<>();
        public List<String> stageSplits = new ArrayList<>();
    }

    public static class EngineNutrients {
        public String mode;
        public boolean isSoilReportOverridden;
        public String npkSummary;
        public NutrientDetails details = new NutrientDetails();
    }

    public static EngineNutrients getEngineNutrientGuidance(String cropName, String mode, Map<String, Object> soilReport) {
        EngineNutrients res = new EngineNutrients();
        res.mode = mode;
        res.isSoilReportOverridden = (soilReport != null && (soilReport.containsKey("ph") || soilReport.containsKey("nitrogen")));
        
        Double n = 0.0, p = 0.0, k = 0.0, ph = 0.0;
        if (res.isSoilReportOverridden) {
            n = soilReport.containsKey("nitrogen") ? Double.valueOf(soilReport.get("nitrogen").toString()) : 0.0;
            p = soilReport.containsKey("phosphorus") ? Double.valueOf(soilReport.get("phosphorus").toString()) : 0.0;
            k = soilReport.containsKey("potassium") ? Double.valueOf(soilReport.get("potassium").toString()) : 0.0;
            ph = soilReport.containsKey("ph") ? Double.valueOf(soilReport.get("ph").toString()) : 0.0;
        }

        if (mode.equalsIgnoreCase("Conventional")) {
            res.npkSummary = res.isSoilReportOverridden 
                ? "Soil Test Based: N=" + n + " kg/ha, P=" + p + " kg/ha, K=" + k + " kg/ha (pH " + ph + ")"
                : "120:60:60 NPK kg/ha (Standard Synthetic Recommendation for " + cropName + ")";
            res.details.basalDose.add("Apply 50% Nitrogen + 100% Phosphorus + 100% Potassium at sowing.");
            res.details.biofertilizers.add("Azospirillum / Rhizobium @ 2 kg/ha seed treatment");
            res.details.foliarMicronutrients.add("Zinc Sulphate (0.5%) + Borax (0.2%) at vegetative stage");
            res.details.stageSplits.add("Split 1: 25% N at 30 DAS");
            res.details.stageSplits.add("Split 2: 25% N at flowering stage");
        } else if (mode.equalsIgnoreCase("Organic")) {
            res.npkSummary = "Organic Nutrient Protocol for " + cropName + " (Zero Synthetic Chemical Inputs)";
            res.details.basalDose.add("FYM / Well-rotted compost @ 15-20 tonnes/ha");
            res.details.basalDose.add("Vermicompost @ 5 tonnes/ha");
            res.details.biofertilizers.add("Rhizobium / Azotobacter @ 5 kg/ha");
            res.details.biofertilizers.add("PSB @ 5 kg/ha");
            res.details.foliarMicronutrients.add("Neem Cake @ 250 kg/ha for N-release");
            res.details.stageSplits.add("Green manure incorporation 45 days prior to planting");
        } else {
            res.npkSummary = res.isSoilReportOverridden
                ? "INM Soil Test Based: 75% NPK (" + (n * 0.75) + " N) + 25% Organic Substitution"
                : "75:25 INM Rule: 75% Synthetic NPK + 25% FYM/Biofertilizer Substitution";
            res.details.basalDose.add("FYM @ 10 t/ha + 75% recommended synthetic NPK");
            res.details.biofertilizers.add("Azotobacter / PSB bio-inoculants @ 2 kg/ha");
            res.details.foliarMicronutrients.add("Foliar Zinc Sulphate (0.2%) + Humic Acid @ 3 kg/ha");
            res.details.stageSplits.add("Drip fertigation splits: 50% pre-blooming, 50% post fruit set");
        }

        return res;
    }

    public static String getCropEmoji(String name) {
        String n = name.toLowerCase();
        if (n.contains("cowpea") || n.contains("bean") || n.contains("gram") || n.contains("lupin") || n.contains("pea")) return "🫘";
        if (n.contains("sunflower")) return "🌻";
        if (n.contains("marigold")) return "🌼";
        if (n.contains("sesame") || n.contains("mustard") || n.contains("wheat") || n.contains("sorghum") || n.contains("azolla") || n.contains("corn")) return "🌾";
        if (n.contains("onion") || n.contains("garlic")) return "🧅";
        if (n.contains("cucumber") || n.contains("squash") || n.contains("nasturtium")) return "🥒";
        if (n.contains("basil") || n.contains("thyme") || n.contains("clover") || n.contains("grass")) return "🌿";
        if (n.contains("carrot") || n.contains("radish")) return "🥕";
        if (n.contains("turmeric") || n.contains("pepper") || n.contains("chili")) return "🌶️";
        if (n.contains("tomato") || n.contains("potato") || n.contains("cabbage")) return "🍅";
        return "🌱";
    }
}
