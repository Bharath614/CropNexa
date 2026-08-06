package com.cropnexa.app.ui.dashboard;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.R;
import com.github.mikephil.charting.charts.PieChart;
import com.github.mikephil.charting.data.PieData;
import com.github.mikephil.charting.data.PieDataSet;
import com.github.mikephil.charting.data.PieEntry;

import java.util.ArrayList;

public class AdminFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_admin, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        PieChart pieChart = view.findViewById(R.id.pieChartAdmin);
        setupPieChart(pieChart);
    }

    private void setupPieChart(PieChart pieChart) {
        if (pieChart == null) return;

        ArrayList<PieEntry> entries = new ArrayList<>();
        entries.add(new PieEntry(40f, "Login"));
        entries.add(new PieEntry(20f, "Weather"));
        entries.add(new PieEntry(15f, "Soil Health"));
        entries.add(new PieEntry(25f, "Companion"));

        PieDataSet dataSet = new PieDataSet(entries, "Activity by Category");
        
        ArrayList<Integer> colors = new ArrayList<>();
        colors.add(Color.parseColor("#10b981"));
        colors.add(Color.parseColor("#3b82f6"));
        colors.add(Color.parseColor("#f59e0b"));
        colors.add(Color.parseColor("#8b5cf6"));
        dataSet.setColors(colors);
        
        dataSet.setValueTextColor(Color.WHITE);
        dataSet.setValueTextSize(12f);

        PieData pieData = new PieData(dataSet);
        pieChart.setData(pieData);
        
        pieChart.getDescription().setEnabled(false);
        pieChart.getLegend().setTextColor(Color.WHITE);
        pieChart.setHoleColor(Color.parseColor("#0f172a"));
        pieChart.setTransparentCircleColor(Color.parseColor("#0f172a"));
        pieChart.setTransparentCircleAlpha(110);
        pieChart.setHoleRadius(58f);
        pieChart.setTransparentCircleRadius(61f);
        pieChart.animateY(1400);
    }
}
