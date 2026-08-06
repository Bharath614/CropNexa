package com.cropnexa.app.ui.dashboard;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.cropnexa.app.SoilEvaluator;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.google.firebase.auth.FirebaseAuth;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class InsightsFragment extends Fragment {

    private double landArea = 1.0;
    private String currentCrop = "Crop";
    private String farmingPractice = "Conventional Farming";
    private int soilScore = 50;
    
    // Weather
    private double temperature = 28.0;
    private double humidity = 60.0;
    private double rainfall = 10.0;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_insights, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }
        
        Button btnOpenNutrientGuide = view.findViewById(R.id.btnOpenNutrientGuide);
        if (btnOpenNutrientGuide != null) {
            btnOpenNutrientGuide.setOnClickListener(v -> {
                NutrientGuideDialogFragment dialog = new NutrientGuideDialogFragment();
                dialog.show(getParentFragmentManager(), "NutrientGuide");
            });
        }

        fetchData(view);
    }

    private void fetchData(View view) {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;

        String userId = auth.getCurrentUser().getUid();
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(userId)
            .get()
            .addOnSuccessListener(documentSnapshot -> {
                if (documentSnapshot.exists()) {
                    Double area = documentSnapshot.getDouble("profile.totalLandArea");
                    if (area != null) landArea = area;
                    
                    String crop = documentSnapshot.getString("profile.currentCrop");
                    if (crop != null) currentCrop = crop;
                    
                    String practice = documentSnapshot.getString("profile.farmingPractice");
                    if (practice != null) farmingPractice = practice;
                    
                    Object weatherObj = documentSnapshot.get("weather");
                    if (weatherObj instanceof Map) {
                        Map<String, Object> w = (Map<String, Object>) weatherObj;
                        if (w.containsKey("temperature")) temperature = ((Number) w.get("temperature")).doubleValue();
                        if (w.containsKey("humidity")) humidity = ((Number) w.get("humidity")).doubleValue();
                        if (w.containsKey("rainfall")) rainfall = ((Number) w.get("rainfall")).doubleValue();
                    }
                    
                    Object soilReportObj = documentSnapshot.get("soilReport");
                    if (soilReportObj instanceof Map) {
                        Map<String, Object> report = (Map<String, Object>) soilReportObj;
                        SoilEvaluator.SoilEvaluationResult result = SoilEvaluator.evaluateSoilHealth(report, farmingPractice);
                        soilScore = result.score;
                    }

                    updateUI(view);
                }
            });
    }

    private void updateUI(View view) {
        // Yield Metrics Calculation
        String cropLow = currentCrop.toLowerCase();
        double baseYield = 4.0;
        double basePricePerTonne = 450;
        
        if (cropLow.equals("rice")) { baseYield = 5.2; basePricePerTonne = 350; }
        else if (cropLow.equals("wheat")) { baseYield = 3.8; basePricePerTonne = 320; }
        else if (cropLow.equals("maize")) { baseYield = 6.5; basePricePerTonne = 280; }
        else if (cropLow.equals("tomato")) { baseYield = 18.0; basePricePerTonne = 150; }
        else if (cropLow.equals("potato")) { baseYield = 22.0; basePricePerTonne = 130; }
        else if (cropLow.equals("sugarcane")) { baseYield = 70.0; basePricePerTonne = 45; }
        else if (cropLow.equals("cotton")) { baseYield = 2.2; basePricePerTonne = 850; }
        
        double soilMultiplier = 0.7 + (soilScore / 100.0) * 0.4;
        double practiceMultiplier = 1.0;
        
        if (farmingPractice.equals("Organic Farming")) {
            practiceMultiplier = 0.92;
        } else if (farmingPractice.equals("Integrated Nutrient Management (INM)")) {
            practiceMultiplier = 1.05;
        }
        
        double predictedYield = baseYield * soilMultiplier * practiceMultiplier;
        double priceTonne = basePricePerTonne;
        if (farmingPractice.equals("Organic Farming")) {
            priceTonne = Math.round(basePricePerTonne * 1.35);
        }
        
        double totalYield = predictedYield * landArea;
        long predictedRevenue = Math.round(totalYield * priceTonne);
        
        int companionImpact = 88;
        if (farmingPractice.equals("Organic Farming")) companionImpact = 95;
        else if (farmingPractice.equals("Integrated Nutrient Management (INM)")) companionImpact = 92;

        // View Binding
        TextView tvYield = view.findViewById(R.id.tvYield);
        TextView tvTotalYield = view.findViewById(R.id.tvTotalYield);
        TextView tvRevenue = view.findViewById(R.id.tvRevenue);
        TextView tvPremium = view.findViewById(R.id.tvPremium);
        TextView tvCompanionImpact = view.findViewById(R.id.tvCompanionImpact);
        TextView tvWeatherImpact = view.findViewById(R.id.tvWeatherImpact);

        if (tvYield != null) tvYield.setText(String.format("%.2f t/ha", predictedYield));
        if (tvTotalYield != null) tvTotalYield.setText(String.format("Total harvest projection: %.1f tonnes", totalYield));
        // Revenue * 80 (INR multiplier from JS)
        if (tvRevenue != null) tvRevenue.setText("₹" + String.format("%,d", predictedRevenue * 80));
        
        if (tvPremium != null) {
            tvPremium.setText("Organic premiums: " + (farmingPractice.equals("Organic Farming") ? "Enabled (+35%)" : "Disabled"));
            if (farmingPractice.equals("Organic Farming")) tvPremium.setTextColor(Color.parseColor("#10b981")); // Emerald
        }
        
        if (tvCompanionImpact != null) tvCompanionImpact.setText(companionImpact + "%");
        
        if (tvWeatherImpact != null) {
            tvWeatherImpact.setText(String.format("Elevated humidity levels (%.0f%%) combined with temperature spikes stimulate pest propagation cycles. Keep companion traps in place.", humidity));
        }

        // Biological Risk Assessment
        int pestRiskScore = (int) Math.min(100, Math.round(40 + (humidity - 60) * 1.5 + (temperature - 28) * 2));
        int diseaseRiskScore = (int) Math.min(100, Math.round(35 + (humidity - 50) * 1.8));

        ProgressBar pestRiskProgress = view.findViewById(R.id.pestRiskProgress);
        ProgressBar diseaseRiskProgress = view.findViewById(R.id.diseaseRiskProgress);
        
        if (pestRiskProgress != null) pestRiskProgress.setProgress(pestRiskScore);
        if (diseaseRiskProgress != null) diseaseRiskProgress.setProgress(diseaseRiskScore);

        // Water Chart
        LineChart waterLineChart = view.findViewById(R.id.waterLineChart);
        if (waterLineChart != null) {
            setupWaterChart(waterLineChart, landArea, rainfall);
        }
    }

    private void setupWaterChart(LineChart chart, double landArea, double rainfall) {
        List<Entry> demandEntries = new ArrayList<>();
        demandEntries.add(new Entry(1f, (float)Math.round(15 * landArea)));
        demandEntries.add(new Entry(2f, (float)Math.round(16 * landArea)));
        demandEntries.add(new Entry(3f, (float)Math.round(18 * landArea)));
        demandEntries.add(new Entry(4f, (float)Math.round(17 * landArea)));

        List<Entry> rainfallEntries = new ArrayList<>();
        rainfallEntries.add(new Entry(1f, (float)Math.round(rainfall * landArea)));
        rainfallEntries.add(new Entry(2f, (float)Math.round(10 * landArea)));
        rainfallEntries.add(new Entry(3f, (float)Math.round(5 * landArea)));
        rainfallEntries.add(new Entry(4f, (float)Math.round(2 * landArea)));

        LineDataSet demandSet = new LineDataSet(demandEntries, "Demand (kL)");
        demandSet.setColor(Color.parseColor("#38bdf8")); // Sky
        demandSet.setLineWidth(2f);
        demandSet.setDrawCircles(false);
        demandSet.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        demandSet.setDrawFilled(true);
        demandSet.setFillColor(Color.parseColor("#38bdf8"));
        demandSet.setFillAlpha(50);

        LineDataSet rainfallSet = new LineDataSet(rainfallEntries, "Rain Yield (kL)");
        rainfallSet.setColor(Color.parseColor("#10b981")); // Emerald
        rainfallSet.setLineWidth(2f);
        rainfallSet.setDrawCircles(false);
        rainfallSet.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        rainfallSet.setDrawFilled(true);
        rainfallSet.setFillColor(Color.parseColor("#10b981"));
        rainfallSet.setFillAlpha(50);

        LineData lineData = new LineData(demandSet, rainfallSet);
        chart.setData(lineData);

        // Styling
        chart.getDescription().setEnabled(false);
        chart.getLegend().setTextColor(Color.WHITE);
        
        XAxis xAxis = chart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.WHITE);
        
        YAxis leftAxis = chart.getAxisLeft();
        leftAxis.setTextColor(Color.WHITE);
        
        chart.getAxisRight().setEnabled(false);
        chart.invalidate();
    }
}
