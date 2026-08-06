package com.cropnexa.app.ui.dashboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseAuth;

import java.util.HashMap;
import java.util.Map;

public class SettingsFragment extends Fragment {

    private TextInputEditText etFarmerName, etMobile, etEmail, etAddress;
    private TextInputEditText etFarmName, etGps, etVillage, etDistrict, etState;
    private TextInputEditText etTotalLand, etIrrigated, etRainfed;
    private TextInputEditText etSoilType, etPreviousCrop, etCurrentCrop, etPlannedCrop, etFarmingPractice;
    
    private Map<String, Object> currentProfile = new HashMap<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_settings, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        // Initialize views
        etFarmerName = view.findViewById(R.id.etFarmerName);
        etMobile = view.findViewById(R.id.etMobile);
        etEmail = view.findViewById(R.id.etEmail);
        etAddress = view.findViewById(R.id.etAddress);
        
        etFarmName = view.findViewById(R.id.etFarmName);
        etGps = view.findViewById(R.id.etGps);
        etVillage = view.findViewById(R.id.etVillage);
        etDistrict = view.findViewById(R.id.etDistrict);
        etState = view.findViewById(R.id.etState);
        
        etTotalLand = view.findViewById(R.id.etTotalLand);
        etIrrigated = view.findViewById(R.id.etIrrigated);
        etRainfed = view.findViewById(R.id.etRainfed);
        
        etSoilType = view.findViewById(R.id.etSoilType);
        etPreviousCrop = view.findViewById(R.id.etPreviousCrop);
        etCurrentCrop = view.findViewById(R.id.etCurrentCrop);
        etPlannedCrop = view.findViewById(R.id.etPlannedCrop);
        etFarmingPractice = view.findViewById(R.id.etFarmingPractice);

        Button btnSaveSettings = view.findViewById(R.id.btnSaveSettings);
        btnSaveSettings.setOnClickListener(v -> saveProfile());
        
        Button btnLogout = view.findViewById(R.id.btnLogout);
        if (btnLogout != null) {
            btnLogout.setOnClickListener(v -> {
                FirebaseAuth.getInstance().signOut();
                Navigation.findNavController(view).navigate(R.id.loginFragment);
            });
        }

        fetchProfile();
    }
    
    private void fetchProfile() {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;
        
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(auth.getCurrentUser().getUid())
            .get()
            .addOnSuccessListener(documentSnapshot -> {
                if (documentSnapshot.exists() && documentSnapshot.contains("profile")) {
                    currentProfile = (Map<String, Object>) documentSnapshot.get("profile");
                    populateFields();
                }
            })
            .addOnFailureListener(e -> {
                Toast.makeText(requireContext(), "Failed to load profile", Toast.LENGTH_SHORT).show();
            });
    }
    
    private void populateFields() {
        if (currentProfile == null) return;
        
        setTextSafe(etFarmerName, "farmerName");
        setTextSafe(etMobile, "mobileNumber");
        setTextSafe(etEmail, "email");
        setTextSafe(etAddress, "address");
        
        setTextSafe(etFarmName, "farmName");
        setTextSafe(etGps, "gpsLocation");
        setTextSafe(etVillage, "village");
        setTextSafe(etDistrict, "district");
        setTextSafe(etState, "state");
        
        setTextSafe(etTotalLand, "totalLandArea");
        setTextSafe(etIrrigated, "irrigatedArea");
        setTextSafe(etRainfed, "rainfedArea");
        
        setTextSafe(etSoilType, "soilType");
        setTextSafe(etPreviousCrop, "previousCrop");
        setTextSafe(etCurrentCrop, "currentCrop");
        setTextSafe(etPlannedCrop, "plannedCrop");
        setTextSafe(etFarmingPractice, "farmingPractice");
    }
    
    private void setTextSafe(TextInputEditText et, String key) {
        if (et != null && currentProfile.containsKey(key)) {
            Object value = currentProfile.get(key);
            if (value != null) {
                et.setText(String.valueOf(value));
            }
        }
    }
    
    private void saveProfile() {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) {
            Toast.makeText(requireContext(), "Not logged in", Toast.LENGTH_SHORT).show();
            return;
        }
        
        Map<String, Object> updatedProfile = new HashMap<>(currentProfile);
        
        updatedProfile.put("farmerName", getTextSafe(etFarmerName));
        updatedProfile.put("mobileNumber", getTextSafe(etMobile));
        updatedProfile.put("email", getTextSafe(etEmail));
        updatedProfile.put("address", getTextSafe(etAddress));
        
        updatedProfile.put("farmName", getTextSafe(etFarmName));
        updatedProfile.put("gpsLocation", getTextSafe(etGps));
        updatedProfile.put("village", getTextSafe(etVillage));
        updatedProfile.put("district", getTextSafe(etDistrict));
        updatedProfile.put("state", getTextSafe(etState));
        
        try { updatedProfile.put("totalLandArea", Double.parseDouble(getTextSafe(etTotalLand))); } catch (Exception e) {}
        try { updatedProfile.put("irrigatedArea", Double.parseDouble(getTextSafe(etIrrigated))); } catch (Exception e) {}
        try { updatedProfile.put("rainfedArea", Double.parseDouble(getTextSafe(etRainfed))); } catch (Exception e) {}
        
        updatedProfile.put("soilType", getTextSafe(etSoilType));
        updatedProfile.put("previousCrop", getTextSafe(etPreviousCrop));
        updatedProfile.put("currentCrop", getTextSafe(etCurrentCrop));
        updatedProfile.put("plannedCrop", getTextSafe(etPlannedCrop));
        updatedProfile.put("farmingPractice", getTextSafe(etFarmingPractice));

        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(auth.getCurrentUser().getUid())
            .update("profile", updatedProfile)
            .addOnSuccessListener(aVoid -> {
                Toast.makeText(requireContext(), "Profile & Preferences Saved!", Toast.LENGTH_SHORT).show();
            })
            .addOnFailureListener(e -> {
                Toast.makeText(requireContext(), "Error saving profile: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            });
    }
    
    private String getTextSafe(TextInputEditText et) {
        return et.getText() != null ? et.getText().toString().trim() : "";
    }
}
