package com.cropnexa.app.ui.dashboard;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.cropnexa.app.R;
import com.cropnexa.app.model.SoilNutrient;

import java.util.List;

public class SoilNutrientAdapter extends RecyclerView.Adapter<SoilNutrientAdapter.NutrientViewHolder> {

    private final List<SoilNutrient> nutrientList;

    public SoilNutrientAdapter(List<SoilNutrient> nutrientList) {
        this.nutrientList = nutrientList;
    }

    @NonNull
    @Override
    public NutrientViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_soil_nutrient, parent, false);
        return new NutrientViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull NutrientViewHolder holder, int position) {
        SoilNutrient nutrient = nutrientList.get(position);
        
        holder.nutrientName.setText(nutrient.getName());
        holder.nutrientSymbol.setText(nutrient.getSymbol());
        holder.nutrientIdeal.setText("Ideal: " + nutrient.getIdeal() + " " + nutrient.getUnit());
        holder.nutrientMeasured.setText(nutrient.getMeasured() + " " + nutrient.getUnit());
        
        holder.nutrientStatusBadge.setText(nutrient.getStatusLabel());
        holder.nutrientStatusBadge.setTextColor(Color.parseColor(nutrient.getStatusColorHex()));
        
        holder.nutrientProgressBar.setProgress(nutrient.getProgressPct());
        holder.nutrientProgressBar.setProgressTintList(ColorStateList.valueOf(Color.parseColor(nutrient.getStatusColorHex())));
    }

    @Override
    public int getItemCount() {
        return nutrientList.size();
    }

    static class NutrientViewHolder extends RecyclerView.ViewHolder {
        TextView nutrientName;
        TextView nutrientSymbol;
        TextView nutrientIdeal;
        TextView nutrientMeasured;
        TextView nutrientStatusBadge;
        ProgressBar nutrientProgressBar;

        public NutrientViewHolder(@NonNull View itemView) {
            super(itemView);
            nutrientName = itemView.findViewById(R.id.nutrientName);
            nutrientSymbol = itemView.findViewById(R.id.nutrientSymbol);
            nutrientIdeal = itemView.findViewById(R.id.nutrientIdeal);
            nutrientMeasured = itemView.findViewById(R.id.nutrientMeasured);
            nutrientStatusBadge = itemView.findViewById(R.id.nutrientStatusBadge);
            nutrientProgressBar = itemView.findViewById(R.id.nutrientProgressBar);
        }
    }
}
