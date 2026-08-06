package com.cropnexa.app.ui.weather;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;

import java.util.ArrayList;
import java.util.List;

public class WeatherFragment extends Fragment {

    private LineChart weatherChart;
    private Button btnTemp, btnRain, btnHumid, btnDew;
    
    // Mock hours matching web app
    private final String[] hours = {"00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"};
    
    // Mock data matching web app
    private final float[] temps = {22f, 21f, 20f, 23f, 26f, 28f, 25f, 23f};
    private final float[] rain = {0f, 2f, 15f, 5f, 0f, 0f, 0f, 0f};
    private final float[] humid = {82f, 75f, 62f, 60f, 68f, 76f, 80f, 85f};
    private final float[] dew = {21f, 20f, 18f, 19f, 20f, 21f, 22f, 22f};

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_weather, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        weatherChart = view.findViewById(R.id.weatherChart);
        btnTemp = view.findViewById(R.id.btnTemp);
        btnRain = view.findViewById(R.id.btnRain);
        btnHumid = view.findViewById(R.id.btnHumid);
        btnDew = view.findViewById(R.id.btnDew);

        btnTemp.setOnClickListener(v -> renderChart("temp"));
        btnRain.setOnClickListener(v -> renderChart("rain"));
        btnHumid.setOnClickListener(v -> renderChart("humid"));
        btnDew.setOnClickListener(v -> renderChart("dew"));

        // Render initial
        renderChart("temp");
        
        // Populate Forecast
        populateForecast(view);

        // Fetch User Location and Crop data from Firebase
        fetchUserData(view);
    }

    private void fetchUserData(View view) {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;

        String userId = auth.getCurrentUser().getUid();
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(userId)
            .get()
            .addOnSuccessListener(documentSnapshot -> {
                if (documentSnapshot.exists()) {
                    String village = documentSnapshot.getString("profile.village");
                    String state = documentSnapshot.getString("profile.state");
                    String gps = documentSnapshot.getString("profile.gpsLocation");
                    String plannedCrop = documentSnapshot.getString("profile.plannedCrop");

                    TextView tvVillage = view.findViewById(R.id.tvVillage);
                    TextView tvState = view.findViewById(R.id.tvState);
                    TextView tvGps = view.findViewById(R.id.tvGps);
                    TextView tvPlannedCrop = view.findViewById(R.id.tvPlannedCrop);

                    if (tvVillage != null && village != null) tvVillage.setText("Village: " + village);
                    if (tvState != null && state != null) tvState.setText(state);
                    if (tvGps != null && gps != null) tvGps.setText("GPS: " + gps);
                    if (tvPlannedCrop != null && plannedCrop != null) tvPlannedCrop.setText("Optimal for: " + plannedCrop);
                }
            });
    }

    private void renderChart(String type) {
        // Reset Buttons
        btnTemp.setBackgroundColor(Color.parseColor("#0f172a"));
        btnTemp.setTextColor(Color.parseColor("#94a3b8"));
        btnRain.setBackgroundColor(Color.parseColor("#0f172a"));
        btnRain.setTextColor(Color.parseColor("#94a3b8"));
        btnHumid.setBackgroundColor(Color.parseColor("#0f172a"));
        btnHumid.setTextColor(Color.parseColor("#94a3b8"));
        btnDew.setBackgroundColor(Color.parseColor("#0f172a"));
        btnDew.setTextColor(Color.parseColor("#94a3b8"));

        List<Entry> entries = new ArrayList<>();
        float[] sourceData;
        String label;
        String colorHex;

        switch (type) {
            case "rain":
                btnRain.setBackgroundColor(Color.parseColor("#082f49"));
                btnRain.setTextColor(Color.parseColor("#38bdf8"));
                sourceData = rain;
                label = "Rainfall (mm)";
                colorHex = "#38bdf8";
                break;
            case "humid":
                btnHumid.setBackgroundColor(Color.parseColor("#022c22"));
                btnHumid.setTextColor(Color.parseColor("#34d399"));
                sourceData = humid;
                label = "Humidity (%)";
                colorHex = "#10b981";
                break;
            case "dew":
                btnDew.setBackgroundColor(Color.parseColor("#3b0764"));
                btnDew.setTextColor(Color.parseColor("#c084fc"));
                sourceData = dew;
                label = "Dew Point (°C)";
                colorHex = "#a855f7";
                break;
            default: // temp
                btnTemp.setBackgroundColor(Color.parseColor("#4c0519"));
                btnTemp.setTextColor(Color.parseColor("#fb7185"));
                sourceData = temps;
                label = "Temperature (°C)";
                colorHex = "#fb7185";
                break;
        }

        for (int i = 0; i < sourceData.length; i++) {
            entries.add(new Entry(i, sourceData[i]));
        }

        LineDataSet dataSet = new LineDataSet(entries, label);
        dataSet.setColor(Color.parseColor(colorHex));
        dataSet.setLineWidth(2.5f);
        dataSet.setDrawCircles(false);
        dataSet.setDrawFilled(true);
        dataSet.setFillColor(Color.parseColor(colorHex));
        dataSet.setFillAlpha(40);
        dataSet.setMode(LineDataSet.Mode.CUBIC_BEZIER);

        LineData lineData = new LineData(dataSet);
        weatherChart.setData(lineData);

        weatherChart.getDescription().setEnabled(false);
        weatherChart.getLegend().setTextColor(Color.parseColor("#f8fafc"));

        XAxis xAxis = weatherChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.parseColor("#64748b"));
        xAxis.setValueFormatter(new IndexAxisValueFormatter(hours));
        xAxis.setGranularity(1f);
        xAxis.setDrawGridLines(true);
        xAxis.setGridColor(Color.parseColor("#1e293b"));

        YAxis leftAxis = weatherChart.getAxisLeft();
        leftAxis.setTextColor(Color.parseColor("#64748b"));
        leftAxis.setDrawGridLines(true);
        leftAxis.setGridColor(Color.parseColor("#1e293b"));

        weatherChart.getAxisRight().setEnabled(false);
        weatherChart.animateX(500);
    }
    
    private void populateForecast(View view) {
        LinearLayout container = view.findViewById(R.id.forecastContainer);
        if (container == null) return;
        
        container.removeAllViews();
        
        addForecastRow(container, "Today", "Scattered Showers", "24°C", "12 mm");
        addForecastRow(container, "Tomorrow", "Thunderstorms", "22°C", "35 mm");
        addForecastRow(container, "Wednesday", "Partly Cloudy", "26°C", "0 mm");
    }
    
    private void addForecastRow(LinearLayout container, String day, String status, String temp, String rain) {
        LinearLayout row = new LinearLayout(getContext());
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setBackgroundColor(Color.parseColor("#0f172a"));
        row.setPadding(32, 32, 32, 32);
        row.setGravity(android.view.Gravity.CENTER_VERTICAL);
        
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 0, 0, 16);
        row.setLayoutParams(params);
        
        LinearLayout leftCol = new LinearLayout(getContext());
        leftCol.setOrientation(LinearLayout.VERTICAL);
        leftCol.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
        
        TextView tvDay = new TextView(getContext());
        tvDay.setText(day);
        tvDay.setTextColor(Color.parseColor("#e2e8f0"));
        tvDay.setTextSize(14);
        tvDay.setTypeface(null, android.graphics.Typeface.BOLD);
        
        TextView tvStatus = new TextView(getContext());
        tvStatus.setText(status);
        tvStatus.setTextColor(Color.parseColor("#64748b"));
        tvStatus.setTextSize(12);
        
        leftCol.addView(tvDay);
        leftCol.addView(tvStatus);
        
        LinearLayout midCol = new LinearLayout(getContext());
        midCol.setOrientation(LinearLayout.VERTICAL);
        midCol.setGravity(android.view.Gravity.END);
        midCol.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        midCol.setPadding(0, 0, 48, 0);
        
        TextView tvTempLabel = new TextView(getContext());
        tvTempLabel.setText("TEMP");
        tvTempLabel.setTextColor(Color.parseColor("#64748b"));
        tvTempLabel.setTextSize(10);
        
        TextView tvTemp = new TextView(getContext());
        tvTemp.setText(temp);
        tvTemp.setTextColor(Color.parseColor("#cbd5e1"));
        tvTemp.setTextSize(14);
        tvTemp.setTypeface(null, android.graphics.Typeface.BOLD);
        
        midCol.addView(tvTempLabel);
        midCol.addView(tvTemp);
        
        LinearLayout rightCol = new LinearLayout(getContext());
        rightCol.setOrientation(LinearLayout.VERTICAL);
        rightCol.setGravity(android.view.Gravity.END);
        rightCol.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        
        TextView tvRainLabel = new TextView(getContext());
        tvRainLabel.setText("RAIN");
        tvRainLabel.setTextColor(Color.parseColor("#64748b"));
        tvRainLabel.setTextSize(10);
        
        TextView tvRain = new TextView(getContext());
        tvRain.setText(rain);
        tvRain.setTextColor(Color.parseColor("#38bdf8"));
        tvRain.setTextSize(14);
        tvRain.setTypeface(null, android.graphics.Typeface.BOLD);
        
        rightCol.addView(tvRainLabel);
        rightCol.addView(tvRain);
        
        row.addView(leftCol);
        row.addView(midCol);
        row.addView(rightCol);
        
        container.addView(row);
    }
}
