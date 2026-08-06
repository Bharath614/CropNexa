package com.cropnexa.app.ui.dashboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.cropnexa.app.R;
import com.cropnexa.app.data.MockCropData;
import com.cropnexa.app.model.Crop;

import java.util.List;

public class CropsFragment extends Fragment {

    private RecyclerView cropsRecyclerView;
    private CropsAdapter cropsAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_crops, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        cropsRecyclerView = view.findViewById(R.id.cropsRecyclerView);
        cropsRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        // Start loading from Firebase
        com.cropnexa.app.FirebaseManager.getInstance().getDb()
            .collection("crops")
            .get()
            .addOnSuccessListener(queryDocumentSnapshots -> {
                List<Crop> crops = new java.util.ArrayList<>();
                for (com.google.firebase.firestore.DocumentSnapshot doc : queryDocumentSnapshots) {
                    try {
                        String id = doc.getString("id");
                        String name = doc.getString("name");
                        String category = doc.getString("category");
                        String water = doc.getString("waterRequirement");
                        if (water == null && doc.contains("waterRequirement")) {
                            water = String.valueOf(doc.getDouble("waterRequirement").intValue()) + "mm";
                        }
                        
                        Crop crop = new Crop(
                            id != null ? id : "1",
                            name != null ? name : "Unknown Crop",
                            category != null ? category : "Vegetables",
                            water != null ? water : "Moderate",
                            doc.getString("lightRequirement") != null ? doc.getString("lightRequirement") : "Full Sun",
                            doc.getString("emoji") != null ? doc.getString("emoji") : "🌾"
                        );
                        crops.add(crop);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                
                // If Firestore is empty (demo mode), fallback to MockData so it isn't blank
                if (crops.isEmpty()) {
                    crops = MockCropData.getMasterCrops();
                }

                cropsAdapter = new CropsAdapter(crops);
                cropsRecyclerView.setAdapter(cropsAdapter);
            })
            .addOnFailureListener(e -> {
                // Fallback to MockData if offline or rules block read
                cropsAdapter = new CropsAdapter(MockCropData.getMasterCrops());
                cropsRecyclerView.setAdapter(cropsAdapter);
                android.widget.Toast.makeText(requireContext(), "Loaded offline crops", android.widget.Toast.LENGTH_SHORT).show();
            });
    }
}
