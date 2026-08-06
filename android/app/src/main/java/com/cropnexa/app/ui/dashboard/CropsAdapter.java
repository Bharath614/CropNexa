package com.cropnexa.app.ui.dashboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.cropnexa.app.R;
import com.cropnexa.app.model.Crop;

import java.util.List;

public class CropsAdapter extends RecyclerView.Adapter<CropsAdapter.CropViewHolder> {

    private final List<Crop> cropList;

    public CropsAdapter(List<Crop> cropList) {
        this.cropList = cropList;
    }

    @NonNull
    @Override
    public CropViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_crop_card, parent, false);
        return new CropViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CropViewHolder holder, int position) {
        Crop crop = cropList.get(position);
        holder.emojiText.setText(crop.getEmoji());
        holder.cropNameText.setText(crop.getName());
        holder.cropCategoryText.setText(crop.getCategory().toUpperCase());
        holder.waterText.setText(crop.getWaterRequirement());
        holder.sunText.setText(crop.getLightRequirement());

        holder.itemView.setOnClickListener(v -> {
            Bundle bundle = new Bundle();
            bundle.putString("cropName", crop.getName());
            bundle.putString("cropCategory", crop.getCategory());
            Navigation.findNavController(v).navigate(R.id.action_cropsFragment_to_cropDetailFragment, bundle);
        });
    }

    @Override
    public int getItemCount() {
        return cropList.size();
    }

    static class CropViewHolder extends RecyclerView.ViewHolder {
        TextView emojiText;
        TextView cropNameText;
        TextView cropCategoryText;
        TextView waterText;
        TextView sunText;

        public CropViewHolder(@NonNull View itemView) {
            super(itemView);
            emojiText = itemView.findViewById(R.id.emojiText);
            cropNameText = itemView.findViewById(R.id.cropNameText);
            cropCategoryText = itemView.findViewById(R.id.cropCategoryText);
            waterText = itemView.findViewById(R.id.waterText);
            sunText = itemView.findViewById(R.id.sunText);
        }
    }
}
