package com.cropnexa.app.data;

import com.cropnexa.app.model.Crop;
import java.util.ArrayList;
import java.util.List;

public class MockCropData {
    public static List<Crop> getMasterCrops() {
        List<Crop> crops = new ArrayList<>();
        crops.add(new Crop("rice", "Rice", "cereal", "High 1000-1500mm", "Full", "🌾"));
        crops.add(new Crop("wheat", "Wheat", "cereal", "Moderate 450-650mm", "Full", "🌾"));
        crops.add(new Crop("maize", "Maize (Corn)", "cereal", "Moderate 500-800mm", "Full", "🌽"));
        crops.add(new Crop("cotton", "Cotton", "fiber", "Moderate 500-700mm", "Full", "🌸"));
        crops.add(new Crop("sugarcane", "Sugarcane", "sugar", "Very High 1500-2500mm", "Full", "🎋"));
        crops.add(new Crop("tomato", "Tomato", "vegetable", "Moderate 400-600mm", "Full", "🍅"));
        return crops;
    }
}
