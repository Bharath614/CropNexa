package com.cropnexa.app;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SoilEvaluator {

    public static class FertilizerRecommendations {
        public List<String> organic = new ArrayList<>();
        public List<String> inm = new ArrayList<>();
        public List<String> conventional = new ArrayList<>();
    }

    public static class SoilEvaluationResult {
        public int score;
        public String classification;
        public FertilizerRecommendations fertilizerRecommendations;
        
        public SoilEvaluationResult(int score, String classification, FertilizerRecommendations fert) {
            this.score = score;
            this.classification = classification;
            this.fertilizerRecommendations = fert;
        }
    }

    public static SoilEvaluationResult evaluateSoilHealth(Map<String, Object> report, String farmingMode) {
        if (report == null) return new SoilEvaluationResult(0, "Critical", new FertilizerRecommendations());

        double score = 0;
        if (farmingMode != null && farmingMode.toLowerCase().contains("organic")) {
            score += 1;
        }

        double ph = getDouble(report, "ph", 6.8);
        double ec = getDouble(report, "ec", 1.2);
        double organicCarbon = getDouble(report, "organicCarbon", 0.85);
        double nitrogen = getDouble(report, "nitrogen", 310);
        double phosphorus = getDouble(report, "phosphorus", 28);
        double potassium = getDouble(report, "potassium", 220);
        double sulphur = getDouble(report, "sulphur", 12.5);
        double zinc = getDouble(report, "zinc", 0.95);
        double iron = getDouble(report, "iron", 5.8);
        double boron = getDouble(report, "boron", 0.55);
        double copper = getDouble(report, "copper", 0.38);
        double manganese = getDouble(report, "manganese", 3.5);

        // Score Calculation
        if (ph >= 6.2 && ph <= 7.3) score += 15;
        else if ((ph >= 5.8 && ph < 6.2) || (ph > 7.3 && ph <= 7.8)) score += 12;
        else if ((ph >= 5.2 && ph < 5.8) || (ph > 7.8 && ph <= 8.3)) score += 7;
        else if ((ph >= 4.5 && ph < 5.2) || (ph > 8.3 && ph <= 9.0)) score += 3;

        if (ec >= 0.5 && ec <= 1.2) score += 10;
        else if ((ec >= 0.2 && ec < 0.5) || (ec > 1.2 && ec <= 1.8)) score += 8;
        else if (ec > 1.8 && ec <= 2.5) score += 4;
        else if (ec > 2.5) score += 1;

        if (organicCarbon >= 0.9) score += 15;
        else if (organicCarbon >= 0.7) score += 12;
        else if (organicCarbon >= 0.5) score += 8;
        else if (organicCarbon >= 0.3) score += 4;
        else score += 1;

        if (nitrogen >= 280 && nitrogen <= 560) score += 15;
        else if (nitrogen >= 220 && nitrogen < 280) score += 11;
        else if (nitrogen >= 160 && nitrogen < 220) score += 7;
        else if (nitrogen > 560) score += 10;
        else score += 3;

        if (phosphorus >= 23 && phosphorus <= 57) score += 10;
        else if (phosphorus >= 16 && phosphorus < 23) score += 7;
        else if (phosphorus >= 10 && phosphorus < 16) score += 4;
        else if (phosphorus > 57) score += 7;
        else score += 2;

        if (potassium >= 140 && potassium <= 330) score += 10;
        else if (potassium >= 110 && potassium < 140) score += 7;
        else if (potassium >= 80 && potassium < 110) score += 4;
        else if (potassium > 330) score += 7;
        else score += 2;

        if (sulphur >= 12) score += 5;
        else if (sulphur >= 8) score += 3.5;
        else if (sulphur >= 5) score += 2;
        else score += 0.5;

        if (zinc >= 0.8) score += 5;
        else if (zinc >= 0.5) score += 3.5;
        else score += 1;

        if (iron >= 5.0) score += 5;
        else if (iron >= 3.5) score += 3.5;
        else score += 1;

        if (boron >= 0.5) score += 4;
        else if (boron >= 0.3) score += 2.5;
        else score += 0.5;

        if (copper >= 0.2) score += 3;
        else score += 1;

        if (manganese >= 2.0) score += 3;
        else score += 1;

        int finalScore = Math.min(100, Math.max(0, (int) Math.round(score)));

        String classification;
        if (finalScore >= 90) classification = "Excellent";
        else if (finalScore >= 75) classification = "Good";
        else if (finalScore >= 60) classification = "Moderate";
        else if (finalScore >= 40) classification = "Poor";
        else classification = "Critical";

        // Generate Fertilizer Recommendations based on deficiencies
        FertilizerRecommendations ferts = new FertilizerRecommendations();
        
        if (nitrogen < 280) {
            ferts.organic.add("Apply Vermicompost (4 tonnes/ha) & Neem Cake (250 kg/ha)");
            ferts.inm.add("Apply Neem Coated Urea (75% dose) combined with Vermicompost (2 tonnes/ha)");
            ferts.conventional.add("Topdress Urea @ 100 kg/ha in 2 split doses");
        }
        if (phosphorus < 23) {
            ferts.organic.add("Apply Rock Phosphate with Phosphate Solubilizing Bacteria (PSB) @ 5 kg/ha");
            ferts.inm.add("Apply Single Super Phosphate (SSP) @ 150 kg/ha + PSB bio-inoculant");
            ferts.conventional.add("Apply DAP (Di-Ammonium Phosphate) @ 120 kg/ha basal dose");
        }
        if (potassium < 140) {
            ferts.organic.add("Apply Wood Ash & Banana Peel Compost / Potash Mobilizing Bacteria (KMB)");
            ferts.inm.add("Apply Muriate of Potash (MOP) @ 50 kg/ha + Bio-potash");
            ferts.conventional.add("Apply MOP (Muriate of Potash) @ 80 kg/ha");
        }
        if (ph < 6.0) {
            ferts.organic.add("Incorporate Agricultural Lime (Calcium Carbonate) @ 500 kg/ha");
            ferts.inm.add("Apply Dolomitic Lime to balance Magnesium & increase pH");
            ferts.conventional.add("Apply Calcium Oxide / Lime @ recommended buffering dose");
        } else if (ph > 7.5) {
            ferts.organic.add("Incorporate Pressmud compost and Elemental Sulphur @ 25 kg/ha");
            ferts.inm.add("Apply Agricultural Gypsum @ 500 kg/ha with irrigation");
            ferts.conventional.add("Apply Ammonium Sulphate fertilizer to reduce rhizosphere alkalinity");
        }
        if (zinc < 0.6) {
            ferts.organic.add("Soil application of Zinc Solubilizing Bacteria (ZSB)");
            ferts.inm.add("Foliar spray of Zinc Sulphate (0.5%) + Citric acid");
            ferts.conventional.add("Soil apply Zinc Sulphate @ 25 kg/ha");
        }
        
        if (ferts.organic.isEmpty()) {
            ferts.organic.add("Soil is well-balanced. Maintain routine FYM compost @ 10 tonnes/ha per crop season.");
            ferts.inm.add("Balanced soil profile. Apply maintenance split NPK application.");
            ferts.conventional.add("Standard maintenance dose of NPK (19:19:19) foliar spray.");
        }

        return new SoilEvaluationResult(finalScore, classification, ferts);
    }

    private static double getDouble(Map<String, Object> map, String key, double defaultValue) {
        if (map == null || !map.containsKey(key)) return defaultValue;
        Object val = map.get(key);
        if (val instanceof Number) {
            return ((Number) val).doubleValue();
        }
        return defaultValue;
    }
}
