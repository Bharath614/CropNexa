package com.cropnexa.app.ui.dashboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.R;

public class CropDetailFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_crop_detail, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        TextView detailCropName = view.findViewById(R.id.detailCropName);
        TextView detailCategory = view.findViewById(R.id.detailCategory);

        if (getArguments() != null) {
            String cropName = getArguments().getString("cropName", "Unknown Crop");
            String cropCategory = getArguments().getString("cropCategory", "CATEGORY");
            
            detailCropName.setText(cropName);
            detailCategory.setText(cropCategory.toUpperCase());
        }
    }
}
