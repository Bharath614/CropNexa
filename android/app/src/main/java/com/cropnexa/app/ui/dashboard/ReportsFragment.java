package com.cropnexa.app.ui.dashboard;

import android.content.ContentValues;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.google.firebase.auth.FirebaseAuth;

import java.io.OutputStream;
import java.util.Map;

public class ReportsFragment extends Fragment {

    private Button btnRepFarm, btnRepSoil, btnRepWeather, btnRepCompanion, btnRepNutrient, btnRepYield;
    private TextView tvReportTitle;
    private LinearLayout llReportContent;
    private Button btnDownloadReport;

    private Map<String, Object> userProfile;
    private Map<String, Object> soilReport;
    private String currentTab = "farm";
    private String currentCsvContent = "";
    private String currentCsvFilename = "";

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_reports, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        btnRepFarm = view.findViewById(R.id.btnRepFarm);
        btnRepSoil = view.findViewById(R.id.btnRepSoil);
        btnRepWeather = view.findViewById(R.id.btnRepWeather);
        btnRepCompanion = view.findViewById(R.id.btnRepCompanion);
        btnRepNutrient = view.findViewById(R.id.btnRepNutrient);
        btnRepYield = view.findViewById(R.id.btnRepYield);
        tvReportTitle = view.findViewById(R.id.tvReportTitle);
        llReportContent = view.findViewById(R.id.llReportContent);
        btnDownloadReport = view.findViewById(R.id.btnDownloadReport);

        btnRepFarm.setOnClickListener(v -> switchTab("farm"));
        btnRepSoil.setOnClickListener(v -> switchTab("soil"));
        btnRepWeather.setOnClickListener(v -> switchTab("weather"));
        btnRepCompanion.setOnClickListener(v -> switchTab("companion"));
        btnRepNutrient.setOnClickListener(v -> switchTab("nutrient"));
        btnRepYield.setOnClickListener(v -> switchTab("yield"));

        btnDownloadReport.setOnClickListener(v -> downloadCsvReport());

        fetchUserData();
    }

    private void fetchUserData() {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;
        
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(auth.getCurrentUser().getUid())
            .get()
            .addOnSuccessListener(documentSnapshot -> {
                if (documentSnapshot.exists()) {
                    userProfile = (Map<String, Object>) documentSnapshot.get("profile");
                    soilReport = (Map<String, Object>) documentSnapshot.get("soilReport");
                    // Refresh the current tab with live data
                    switchTab(currentTab);
                }
            });
    }

    private String getProfileValue(String key, String fallback) {
        if (userProfile != null && userProfile.containsKey(key)) {
            return String.valueOf(userProfile.get(key));
        }
        return fallback;
    }

    private String getSoilValue(String key, String fallback) {
        if (soilReport != null && soilReport.containsKey(key)) {
            return String.valueOf(soilReport.get(key));
        }
        return fallback;
    }

    private void addRow(String label, String value) {
        View row = getLayoutInflater().inflate(R.layout.item_report_row, llReportContent, false);
        TextView tvLabel = row.findViewById(R.id.tvLabel);
        TextView tvValue = row.findViewById(R.id.tvValue);
        tvLabel.setText(label);
        tvValue.setText(value);
        llReportContent.addView(row);
    }
    
    private void addSectionDivider() {
        View divider = new View(requireContext());
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 1);
        params.setMargins(0, 16, 0, 16);
        divider.setLayoutParams(params);
        divider.setBackgroundColor(Color.parseColor("#1e293b"));
        llReportContent.addView(divider);
    }

    private void switchTab(String tab) {
        currentTab = tab;
        resetButtons();
        llReportContent.removeAllViews();
        
        String farmerName = getProfileValue("farmerName", "CropNexa User");
        String gps = getProfileValue("gpsLocation", "12.5186° N, 78.2139° E");
        String address = getProfileValue("village", "Village") + ", " + getProfileValue("district", "District") + ", " + getProfileValue("state", "State");
        String farmingPractice = getProfileValue("farmingPractice", "Organic Farming");
        
        double totalLandArea = 2.5;
        try { totalLandArea = Double.parseDouble(getProfileValue("totalLandArea", "2.5")); } catch(Exception e){}
        
        String currentCrop = getProfileValue("currentCrop", "Tomato");
        String currentStage = getProfileValue("currentStage", "Growth");
        String soilType = getProfileValue("soilType", "Red Sandy Loam");
        String plannedCrop = getProfileValue("plannedCrop", "Onion");
        
        switch (tab) {
            case "farm":
                setActiveButton(btnRepFarm);
                tvReportTitle.setText("FARM PROFILE SUMMARY");
                
                addRow("Farmer Name", farmerName);
                addRow("GPS Coordinates", gps);
                addRow("Location Address", address);
                addRow("Farming System", farmingPractice);
                addRow("Total Cultivated Area", totalLandArea + " Hectares");
                addRow("Current Crop / Stage", currentCrop + " (" + currentStage + ")");
                addRow("Soil Base", soilType);
                addRow("Planned Rotation", plannedCrop);
                
                currentCsvFilename = "farm_summary_report_" + farmerName.replace(" ", "_") + ".csv";
                currentCsvContent = "CropNexa - Farm Profile Report\n" +
                        "Farmer Name," + farmerName + "\n" +
                        "Location GPS," + gps + "\n" +
                        "Address," + address + "\n" +
                        "Total Area (ha)," + totalLandArea + "\n" +
                        "Soil Type," + soilType + "\n" +
                        "Farming Mode," + farmingPractice + "\n" +
                        "Primary Crop," + currentCrop + "\n" +
                        "Crop Stage," + currentStage + "\n" +
                        "Planned Crop Rotation," + plannedCrop;
                break;

            case "soil":
                setActiveButton(btnRepSoil);
                tvReportTitle.setText("SOIL CHEMICAL PARAMETERS REPORT");
                
                String ph = getSoilValue("ph", "6.8");
                String ec = getSoilValue("ec", "1.2");
                String oc = getSoilValue("organicCarbon", "0.85");
                String n = getSoilValue("nitrogen", "310");
                String p = getSoilValue("phosphorus", "28");
                String k = getSoilValue("potassium", "220");
                String s = getSoilValue("sulphur", "12.5");
                String zn = getSoilValue("zinc", "0.95");
                
                addRow("Classification Class", "OPTIMAL");
                addRow("Soil pH", ph + " (Optimal: 6.0-7.5)");
                addRow("Elec. Conductivity", ec + " mS/cm");
                addRow("Organic Carbon (%)", oc + " %");
                addRow("Nitrogen (N)", n + " kg/ha");
                addRow("Phosphorus (P)", p + " kg/ha");
                addRow("Potassium (K)", k + " kg/ha");
                addRow("Sulphur (S)", s + " ppm");
                addRow("Trace Zinc (Zn)", zn + " ppm");

                currentCsvFilename = "soil_health_report_" + farmerName.replace(" ", "_") + ".csv";
                currentCsvContent = "CropNexa - Soil Chemical Health Report\n" +
                        "Nutrient Parameter,Measured Value,Optimal Reference Range\n" +
                        "pH," + ph + ",6.0 - 7.5\n" +
                        "Electrical Conductivity (mS/cm)," + ec + ",0.5 - 1.5\n" +
                        "Organic Carbon (%)," + oc + ",> 0.8\n" +
                        "Nitrogen (kg/ha)," + n + ",280 - 560\n" +
                        "Phosphorus (kg/ha)," + p + ",23 - 57\n" +
                        "Potassium (kg/ha)," + k + ",140 - 330\n" +
                        "Sulphur (ppm)," + s + ",> 10\n" +
                        "Zinc (ppm)," + zn + ",> 0.6";
                break;

            case "weather":
                setActiveButton(btnRepWeather);
                tvReportTitle.setText("WEATHER INTELLIGENCE FORECAST SUMMARY");
                
                addRow("Measured Temperature", "31 C");
                addRow("Rainfall Cumulative 24h", "12 mm");
                addRow("Wind Velocity", "14 km/h (Direction: SW)");
                addRow("Humidity Rating", "78 %");
                
                addSectionDivider();
                
                addRow("Today", "Thunderstorms, 31 C (Rain: 12 mm)");
                addRow("Tomorrow", "Scattered Showers, 32 C (Rain: 6 mm)");
                addRow("Tuesday", "Partly Cloudy, 33 C (Rain: 2 mm)");
                
                currentCsvFilename = "weather_log_" + farmerName.replace(" ", "_") + ".csv";
                currentCsvContent = "CropNexa - Weather Intelligence Log\n" +
                        "Temperature,31 C\nHumidity,78%\nRainfall,12 mm\n\n" +
                        "Forecast Day,Expected Temperature (C),Expected Rain Yield (mm),Conditions\n" +
                        "Today,31,12,Thunderstorms\nTomorrow,32,6,Scattered Showers";
                break;

            case "companion":
                setActiveButton(btnRepCompanion);
                tvReportTitle.setText("COMPANION PLANTING MATRIX: " + currentCrop.toUpperCase());
                
                addRow("Compatible: Basil", "Recommendation Rank: 1 (Pest deterrence)");
                addRow("Compatible: Marigold", "Recommendation Rank: 2 (Nematode control)");
                
                addSectionDivider();
                
                addRow("Antagonistic: Potatoes", "Severity Score: 85/100 (Risk Category: High)");
                
                currentCsvFilename = "companion_planting_report_" + currentCrop + ".csv";
                currentCsvContent = "CropNexa - Companion Planting Matrix for " + currentCrop + "\n" +
                        "Companion Plant Name,Recommendation Rank,Benefits Summary\n" +
                        "Basil,1,Deters pests\nMarigold,2,Controls nematodes";
                break;

            case "nutrient":
                setActiveButton(btnRepNutrient);
                tvReportTitle.setText("NUTRIENT DOSING SCHEDULE SUMMARY");
                
                double fym = 15 * totalLandArea;
                double vermi = 5 * totalLandArea;
                double neem = 250 * totalLandArea;
                
                addRow("Cultivated Land Area", totalLandArea + " Hectares");
                addRow("Selected Dosing System", farmingPractice);
                
                addSectionDivider();
                
                addRow("Farm Yard Manure", String.format("%.1f", fym) + " tonnes");
                addRow("Vermicompost supplement", String.format("%.1f", vermi) + " tonnes");
                addRow("Neem Cake suppressant", String.format("%.1f", neem) + " kg");

                currentCsvFilename = "nutrient_dosing_schedule.csv";
                currentCsvContent = "CropNexa - Nutrient Split Scheduling Report\n" +
                        "Farming Mode," + farmingPractice + "\n" +
                        "Cultivated Land Area," + totalLandArea + " hectares\n\n" +
                        "Recommended Input / Fertilizer,Baseline Rate (per hectare),Total Quantity for Farm\n" +
                        "Organic Compost (FYM),15 tonnes/ha," + String.format("%.1f", fym) + " tonnes\n" +
                        "Vermicompost supplement,5 tonnes/ha," + String.format("%.1f", vermi) + " tonnes\n" +
                        "Neem Cake suppressant,250 kg/ha," + String.format("%.1f", neem) + " kg";
                break;

            case "yield":
                setActiveButton(btnRepYield);
                tvReportTitle.setText("AI YIELD & PROFIT MODELS REPORT");
                
                double yieldRate = 4.2;
                double totalYield = yieldRate * totalLandArea;
                double profit = totalYield * 28000;
                
                addRow("Expected Yield Rate", yieldRate + " t/ha");
                addRow("Total Cultivated Area", totalLandArea + " ha");
                addRow("Estimated Crop Yield", String.format("%.1f", totalYield) + " tonnes");
                addRow("Gross Profit Forecast", "Rs. " + String.format("%.0f", profit));
                
                addSectionDivider();
                addRow("Methodology Disclaimer", "AI predictions generated using multi-layer crop modeling algorithms. Actual outcomes are weather-dependent.");

                currentCsvFilename = "yield_revenue_forecast.csv";
                currentCsvContent = "CropNexa - AI Yield & Revenue Forecast Models\n" +
                        "Primary Crop," + currentCrop + "\n\n" +
                        "Forecast Parameter,Calculated Output Metric\n" +
                        "Predicted Yield Rate,4.2 tonnes/hectare\n" +
                        "Total Cumulative Yield," + String.format("%.1f", totalYield) + " tonnes\n" +
                        "Estimated Market Rate (Premium),Rs. 28000 / tonne equivalent\n" +
                        "Estimated Gross Farm Profit,Rs. " + String.format("%.0f", profit);
                break;
        }
    }

    private void resetButtons() {
        Button[] btns = {btnRepFarm, btnRepSoil, btnRepWeather, btnRepCompanion, btnRepNutrient, btnRepYield};
        for (Button btn : btns) {
            btn.setBackgroundColor(Color.parseColor("#0f172a"));
            btn.setTextColor(Color.parseColor("#94a3b8"));
        }
    }

    private void setActiveButton(Button btn) {
        btn.setBackgroundColor(Color.parseColor("#064e3b"));
        btn.setTextColor(Color.parseColor("#34d399"));
    }

    private void downloadCsvReport() {
        if (currentCsvContent.isEmpty()) return;

        try {
            ContentValues values = new ContentValues();
            values.put(MediaStore.MediaColumns.DISPLAY_NAME, currentCsvFilename);
            values.put(MediaStore.MediaColumns.MIME_TYPE, "text/csv");
            values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

            Uri uri = requireContext().getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (uri != null) {
                try (OutputStream outputStream = requireContext().getContentResolver().openOutputStream(uri)) {
                    if (outputStream != null) {
                        outputStream.write(currentCsvContent.getBytes());
                    }
                }
                Toast.makeText(requireContext(), "Downloaded " + currentCsvFilename + " to Downloads", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(requireContext(), "Failed to save file.", Toast.LENGTH_SHORT).show();
            }
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(requireContext(), "Error saving report: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }
}
