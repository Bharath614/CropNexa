package com.cropnexa.app.ui.dashboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.cropnexa.app.SoilEvaluator;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;

import java.util.Map;

public class DashboardFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_dashboard, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        View ivLogout = view.findViewById(R.id.ivLogoutDashboard);
        if (ivLogout != null) {
            ivLogout.setOnClickListener(v -> {
                FirebaseAuth.getInstance().signOut();
                androidx.navigation.Navigation.findNavController(view).navigate(R.id.loginFragment);
            });
        }
        
        fetchUserProfile(view);
    }

    private void fetchUserProfile(View view) {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) {
            return;
        }

        String userId = auth.getCurrentUser().getUid();
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(userId)
            .addSnapshotListener((documentSnapshot, error) -> {
                if (error != null) {
                    return;
                }
                if (documentSnapshot != null && documentSnapshot.exists()) {
                    try {
                        updateUI(view, documentSnapshot);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
    }
    
    private void updateUI(View view, DocumentSnapshot doc) {
        // Fetch Profile Fields
        String farmerName = doc.getString("profile.farmerName");
        String farmName = doc.getString("profile.farmName");
        String currentCrop = doc.getString("profile.currentCrop");
        String cropStage = doc.getString("profile.currentStage");
        String village = doc.getString("profile.village");
        String state = doc.getString("profile.state");
        String farmingPractice = doc.getString("profile.farmingPractice");
        Double totalLandArea = doc.getDouble("profile.totalLandArea");
        Double irrigatedArea = doc.getDouble("profile.irrigatedArea");
        
        // Populate Welcome Banner
        TextView tvFarmName = view.findViewById(R.id.tvFarmName);
        TextView tvLocation = view.findViewById(R.id.tvLocation);
        TextView tvBannerCrop = view.findViewById(R.id.tvBannerCrop);
        
        if (tvFarmName != null && farmName != null) tvFarmName.setText(farmName);
        if (tvLocation != null && village != null && state != null) tvLocation.setText("📍 " + village + ", " + state);
        if (tvBannerCrop != null && currentCrop != null) tvBannerCrop.setText("🌱 " + currentCrop + " (" + (cropStage != null ? cropStage : "Growth") + " Stage)");
        
        // Populate Active Crop Metric
        TextView tvActiveCropTitle = view.findViewById(R.id.tvActiveCropTitle);
        if (tvActiveCropTitle != null && currentCrop != null) tvActiveCropTitle.setText(currentCrop);
        
        // We cannot get TextViews that do not have an ID yet in fragment_dashboard.xml
        // Let's find by traversing or by assigning IDs if needed.
        // Actually, in our new fragment_dashboard.xml, we DO have some IDs!
        // We have: R.id.tvActiveCropTitle, R.id.tvWeatherTemp, R.id.tvSoilScoreNum, R.id.btnSoilScore
        
        TextView tvSoilScoreNum = view.findViewById(R.id.tvSoilScoreNum);
        Button btnSoilScore = view.findViewById(R.id.btnSoilScore);
        
        // Calculate Soil Score from live soilReport
        Object soilReportObj = doc.get("soilReport");
        if (soilReportObj instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> soilReport = (Map<String, Object>) soilReportObj;
            SoilEvaluator.SoilEvaluationResult result = SoilEvaluator.evaluateSoilHealth(soilReport, farmingPractice);
            
            if (tvSoilScoreNum != null) {
                tvSoilScoreNum.setText(String.valueOf(result.score));
            }
            if (btnSoilScore != null) {
                btnSoilScore.setText("Soil Score: " + result.score + "/100");
            }
        }
    }
}
