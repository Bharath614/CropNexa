package com.cropnexa.app.ui.dashboard;

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
import com.cropnexa.app.SoilEvaluator;
import com.google.android.material.card.MaterialCardView;
import com.google.firebase.auth.FirebaseAuth;

import java.util.Map;
import java.util.List;

public class NutrientFragment extends Fragment {

    private Button btnOrganic, btnInm, btnConventional;
    private double landArea = 1.0;
    private SoilEvaluator.FertilizerRecommendations currentRecommendations = null;
    private String currentTab = "Organic Farming";

    private LinearLayout viewConventional, viewOrganic, viewInm;
    private MaterialCardView aiPrescriptionCard;
    private LinearLayout aiPrescriptionContainer;

    // View References
    private TextView tvConvBasalTotal, tvConvTop1Total, tvConvTop2Total;
    private TextView tvConvUreaTotal, tvConvSspTotal, tvConvMopTotal;
    
    private TextView tvOrgFym, tvOrgVermi, tvOrgNeem, tvOrgGroundnut;
    
    private TextView tvInmChemical, tvInmOrganic, tvInmUrea, tvInmSsp, tvInmHumic, tvInmVam;
    private TextView tvInmZinc, tvInmBorax, tvInmSulphur;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_nutrient, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        btnOrganic = view.findViewById(R.id.btnOrganic);
        btnInm = view.findViewById(R.id.btnInm);
        btnConventional = view.findViewById(R.id.btnConventional);
        
        viewConventional = view.findViewById(R.id.viewConventional);
        viewOrganic = view.findViewById(R.id.viewOrganic);
        viewInm = view.findViewById(R.id.viewInm);
        
        aiPrescriptionCard = view.findViewById(R.id.aiPrescriptionCard);
        aiPrescriptionContainer = view.findViewById(R.id.aiPrescriptionContainer);

        // Map Conventional
        tvConvBasalTotal = view.findViewById(R.id.tvConvBasalTotal);
        tvConvTop1Total = view.findViewById(R.id.tvConvTop1Total);
        tvConvTop2Total = view.findViewById(R.id.tvConvTop2Total);
        tvConvUreaTotal = view.findViewById(R.id.tvConvUreaTotal);
        tvConvSspTotal = view.findViewById(R.id.tvConvSspTotal);
        tvConvMopTotal = view.findViewById(R.id.tvConvMopTotal);
        
        // Map Organic
        tvOrgFym = view.findViewById(R.id.tvOrgFym);
        tvOrgVermi = view.findViewById(R.id.tvOrgVermi);
        tvOrgNeem = view.findViewById(R.id.tvOrgNeem);
        tvOrgGroundnut = view.findViewById(R.id.tvOrgGroundnut);
        
        // Map INM
        tvInmChemical = view.findViewById(R.id.tvInmChemical);
        tvInmOrganic = view.findViewById(R.id.tvInmOrganic);
        tvInmUrea = view.findViewById(R.id.tvInmUrea);
        tvInmSsp = view.findViewById(R.id.tvInmSsp);
        tvInmHumic = view.findViewById(R.id.tvInmHumic);
        tvInmVam = view.findViewById(R.id.tvInmVam);
        tvInmZinc = view.findViewById(R.id.tvInmZinc);
        tvInmBorax = view.findViewById(R.id.tvInmBorax);
        tvInmSulphur = view.findViewById(R.id.tvInmSulphur);

        btnOrganic.setOnClickListener(v -> updateTab("Organic Farming"));
        btnInm.setOnClickListener(v -> updateTab("Integrated Nutrient Management (INM)"));
        btnConventional.setOnClickListener(v -> updateTab("Conventional Farming"));

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
                    
                    String farmingPractice = documentSnapshot.getString("profile.farmingPractice");
                    if (farmingPractice != null) {
                        currentTab = farmingPractice;
                    }

                    TextView tvLandAreaInfo = view.findViewById(R.id.tvLandAreaInfo);
                    if (tvLandAreaInfo != null) {
                        tvLandAreaInfo.setText(String.format("Calculations are adjusted for a land area of %.1f Hectares.", landArea));
                    }

                    Object soilReportObj = documentSnapshot.get("soilReport");
                    if (soilReportObj instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> report = (Map<String, Object>) soilReportObj;
                        SoilEvaluator.SoilEvaluationResult result = SoilEvaluator.evaluateSoilHealth(report, farmingPractice);
                        currentRecommendations = result.fertilizerRecommendations;
                    }
                    
                    populateStaticData();
                    updateTab(currentTab);
                }
            });
    }

    private void populateStaticData() {
        if (tvConvBasalTotal == null) return; // View not fully created

        // Conventional
        tvConvBasalTotal.setText(String.format("%.1f kg", 140 * landArea));
        tvConvTop1Total.setText(String.format("%.1f kg", 40 * landArea));
        tvConvTop2Total.setText(String.format("%.1f kg", 60 * landArea));
        tvConvUreaTotal.setText(String.format("%.1f kg total", 260 * landArea));
        tvConvSspTotal.setText(String.format("%.1f kg total", 375 * landArea));
        tvConvMopTotal.setText(String.format("%.1f kg total", 100 * landArea));

        // Organic
        tvOrgFym.setText(String.format("%.1f tonnes", 15 * landArea));
        tvOrgVermi.setText(String.format("%.1f tonnes", 5 * landArea));
        tvOrgNeem.setText(String.format("%.1f kg", 250 * landArea));
        tvOrgGroundnut.setText(String.format("%.1f kg", 300 * landArea));

        // INM
        tvInmChemical.setText(String.format("%.1f kg NPK", 120 * landArea));
        tvInmOrganic.setText(String.format("%.2f t Vermi", 5 * landArea * 0.25));
        tvInmUrea.setText(String.format("%.1f kg", 150 * landArea));
        tvInmSsp.setText(String.format("%.1f kg", 220 * landArea));
        tvInmHumic.setText(String.format("%.1f L", 5 * landArea));
        tvInmVam.setText(String.format("%.1f kg", 10 * landArea));
        
        tvInmZinc.setText(String.format("%.1f kg", 25 * landArea));
        tvInmBorax.setText(String.format("%.1f kg", 10 * landArea));
        tvInmSulphur.setText(String.format("%.1f kg", 20 * landArea));
    }

    private void updateTab(String tab) {
        currentTab = tab;
        btnOrganic.setBackgroundColor(Color.parseColor("#1e293b"));
        btnOrganic.setTextColor(Color.parseColor("#94a3b8"));
        btnInm.setBackgroundColor(Color.parseColor("#1e293b"));
        btnInm.setTextColor(Color.parseColor("#94a3b8"));
        btnConventional.setBackgroundColor(Color.parseColor("#1e293b"));
        btnConventional.setTextColor(Color.parseColor("#94a3b8"));

        viewConventional.setVisibility(View.GONE);
        viewOrganic.setVisibility(View.GONE);
        viewInm.setVisibility(View.GONE);
        aiPrescriptionCard.setVisibility(View.GONE);
        
        // Remove old AI alerts except the title
        int childCount = aiPrescriptionContainer.getChildCount();
        if (childCount > 1) {
            aiPrescriptionContainer.removeViews(1, childCount - 1);
        }

        if (tab.equals("Organic Farming") || tab.equals("Organic")) {
            btnOrganic.setBackgroundColor(Color.parseColor("#064e3b"));
            btnOrganic.setTextColor(Color.parseColor("#34d399"));
            viewOrganic.setVisibility(View.VISIBLE);
            if (currentRecommendations != null && !currentRecommendations.organic.isEmpty()) {
                showAiAlerts(currentRecommendations.organic);
            }
        } else if (tab.equals("Integrated Nutrient Management (INM)") || tab.equals("INM")) {
            btnInm.setBackgroundColor(Color.parseColor("#064e3b"));
            btnInm.setTextColor(Color.parseColor("#34d399"));
            viewInm.setVisibility(View.VISIBLE);
            if (currentRecommendations != null && !currentRecommendations.inm.isEmpty()) {
                showAiAlerts(currentRecommendations.inm);
            }
        } else {
            btnConventional.setBackgroundColor(Color.parseColor("#064e3b"));
            btnConventional.setTextColor(Color.parseColor("#34d399"));
            viewConventional.setVisibility(View.VISIBLE);
            if (currentRecommendations != null && !currentRecommendations.conventional.isEmpty()) {
                showAiAlerts(currentRecommendations.conventional);
            }
        }
    }

    private void showAiAlerts(List<String> alerts) {
        aiPrescriptionCard.setVisibility(View.VISIBLE);
        for (String alert : alerts) {
            TextView tv = new TextView(getContext());
            tv.setText("• " + alert);
            tv.setTextColor(Color.parseColor("#e0e7ff")); // indigo-100
            tv.setTextSize(12);
            tv.setPadding(0, 0, 0, 8);
            aiPrescriptionContainer.addView(tv);
        }
    }
}
