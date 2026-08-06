package com.cropnexa.app.ui.dashboard;

import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.CompanionEngine;
import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentSnapshot;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class CompanionFragment extends Fragment {

    private Spinner spinCrop, spinStage, spinMode;
    private EditText etLandArea;
    private Button btnSoilOverride, btnTabRecs, btnTabNutrients;
    private LinearLayout llDynamicContainer;

    private boolean useSoilTestOverride = true;
    private String activeTab = "recs";
    private Map<String, Object> cachedSoilReport = null;

    private String targetCrop = "Maize";
    private String growthStage = "Growth";
    private String farmingMode = "Integrated";
    private double landAreaHa = 1.0;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_companion, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        spinCrop = view.findViewById(R.id.spinCrop);
        spinStage = view.findViewById(R.id.spinStage);
        spinMode = view.findViewById(R.id.spinMode);
        etLandArea = view.findViewById(R.id.etLandArea);
        btnSoilOverride = view.findViewById(R.id.btnSoilOverride);
        btnTabRecs = view.findViewById(R.id.btnTabRecs);
        btnTabNutrients = view.findViewById(R.id.btnTabNutrients);
        llDynamicContainer = view.findViewById(R.id.llDynamicContainer);

        setupSpinners();

        btnTabRecs.setOnClickListener(v -> { activeTab = "recs"; updateUI(); });
        btnTabNutrients.setOnClickListener(v -> { activeTab = "nutrients"; updateUI(); });
        
        btnSoilOverride.setOnClickListener(v -> {
            useSoilTestOverride = !useSoilTestOverride;
            if (useSoilTestOverride) {
                btnSoilOverride.setText("Soil Report Active ✓");
                btnSoilOverride.setBackgroundColor(Color.parseColor("#064e3b"));
                btnSoilOverride.setTextColor(Color.parseColor("#34d399"));
            } else {
                btnSoilOverride.setText("Use Default NPK");
                btnSoilOverride.setBackgroundColor(Color.parseColor("#020617"));
                btnSoilOverride.setTextColor(Color.parseColor("#64748b"));
            }
            updateUI();
        });

        etLandArea.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
            @Override public void afterTextChanged(Editable s) {
                try {
                    landAreaHa = Double.parseDouble(s.toString());
                    updateUI();
                } catch (NumberFormatException ignored) {}
            }
        });

        fetchUserProfile();
    }

    private void setupSpinners() {
        List<String> cropNames = new ArrayList<>();
        for (CompanionEngine.Crop c : CompanionEngine.MASTER_CROPS) cropNames.add(c.name);
        ArrayAdapter<String> adapterCrop = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_item, cropNames);
        adapterCrop.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinCrop.setAdapter(adapterCrop);

        ArrayAdapter<String> adapterStage = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_item, new String[]{"Germination", "Growth", "Harvesting"});
        adapterStage.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinStage.setAdapter(adapterStage);

        ArrayAdapter<String> adapterMode = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_item, new String[]{"Conventional", "Organic", "Integrated"});
        adapterMode.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinMode.setAdapter(adapterMode);

        AdapterView.OnItemSelectedListener listener = new AdapterView.OnItemSelectedListener() {
            @Override public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                targetCrop = spinCrop.getSelectedItem().toString();
                growthStage = spinStage.getSelectedItem().toString();
                farmingMode = spinMode.getSelectedItem().toString();
                updateUI();
            }
            @Override public void onNothingSelected(AdapterView<?> parent) {}
        };
        spinCrop.setOnItemSelectedListener(listener);
        spinStage.setOnItemSelectedListener(listener);
        spinMode.setOnItemSelectedListener(listener);
    }

    private void fetchUserProfile() {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;
        
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(auth.getCurrentUser().getUid())
            .get()
            .addOnSuccessListener(doc -> {
                if (doc.exists()) {
                    String curCrop = doc.getString("profile.currentCrop");
                    if (curCrop != null) {
                        for(int i=0; i<spinCrop.getCount(); i++) {
                            if(spinCrop.getItemAtPosition(i).toString().equalsIgnoreCase(curCrop)){
                                spinCrop.setSelection(i);
                                targetCrop = curCrop;
                                break;
                            }
                        }
                    }
                    String curStage = doc.getString("profile.currentStage");
                    if (curStage != null) {
                        for(int i=0; i<spinStage.getCount(); i++) {
                            if(spinStage.getItemAtPosition(i).toString().equalsIgnoreCase(curStage)){
                                spinStage.setSelection(i);
                                growthStage = curStage;
                                break;
                            }
                        }
                    }
                    String farmMode = doc.getString("profile.farmingPractice");
                    if (farmMode != null) {
                        for(int i=0; i<spinMode.getCount(); i++) {
                            if(spinMode.getItemAtPosition(i).toString().equalsIgnoreCase(farmMode)){
                                spinMode.setSelection(i);
                                farmingMode = farmMode;
                                break;
                            }
                        }
                    }
                    Double area = doc.getDouble("profile.totalLandArea");
                    if (area != null) {
                        landAreaHa = area;
                        etLandArea.setText(String.valueOf(area));
                    }
                    
                    Object srObj = doc.get("soilReport");
                    if (srObj instanceof Map) {
                        cachedSoilReport = (Map<String, Object>) srObj;
                    }
                    updateUI();
                }
            });
    }

    private void updateUI() {
        if (getContext() == null || llDynamicContainer == null) return;
        
        if (activeTab.equals("recs")) {
            btnTabRecs.setBackgroundColor(Color.parseColor("#064e3b"));
            btnTabRecs.setTextColor(Color.parseColor("#34d399"));
            btnTabNutrients.setBackgroundColor(Color.parseColor("#1e293b"));
            btnTabNutrients.setTextColor(Color.parseColor("#94a3b8"));
        } else {
            btnTabNutrients.setBackgroundColor(Color.parseColor("#064e3b"));
            btnTabNutrients.setTextColor(Color.parseColor("#34d399"));
            btnTabRecs.setBackgroundColor(Color.parseColor("#1e293b"));
            btnTabRecs.setTextColor(Color.parseColor("#94a3b8"));
        }

        llDynamicContainer.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(getContext());

        if (activeTab.equals("recs")) {
            CompanionEngine.EngineRecommendations recs = CompanionEngine.getEngineRecommendations(targetCrop, growthStage, farmingMode, landAreaHa);
            
            if (recs.isMonocropAdvisory) {
                TextView tvAdvisory = new TextView(getContext());
                tvAdvisory.setText("Large Commercial Plot Monocropping Advisory\nFocus on crop rotation and trap cropping.");
                tvAdvisory.setTextColor(Color.parseColor("#fbbf24"));
                tvAdvisory.setPadding(32, 32, 32, 32);
                tvAdvisory.setBackgroundColor(Color.parseColor("#451a03"));
                llDynamicContainer.addView(tvAdvisory);
            } else {
                for (CompanionEngine.CompanionResult comp : recs.companions) {
                    View card = inflater.inflate(R.layout.item_companion_card, llDynamicContainer, false);
                    TextView tvEmoji = card.findViewById(R.id.tvCompanionEmoji);
                    TextView tvName = card.findViewById(R.id.tvCompanionName);
                    TextView tvConfidence = card.findViewById(R.id.tvCompanionConfidence);
                    TextView tvTag = card.findViewById(R.id.tvCompanionTag);
                    TextView tvMech = card.findViewById(R.id.tvCompanionMechanism);
                    TextView tvSource = card.findViewById(R.id.tvCompanionSource);
                    Button btnAdd = card.findViewById(R.id.btnAddCompanion);
                    
                    tvEmoji.setText(CompanionEngine.getCropEmoji(comp.cropName));
                    tvName.setText(comp.cropName);
                    tvConfidence.setText(comp.confidence.equals("High") ? "Excellent" : "Good");
                    if (comp.confidence.equals("High")) {
                        tvConfidence.setTextColor(Color.parseColor("#34d399"));
                        tvConfidence.setBackgroundColor(Color.parseColor("#022c22"));
                    } else {
                        tvConfidence.setTextColor(Color.parseColor("#fbbf24"));
                        tvConfidence.setBackgroundColor(Color.parseColor("#451a03"));
                    }
                    tvTag.setText(comp.mechanismTag);
                    tvMech.setText(comp.mechanism);
                    tvSource.setText("Source: " + comp.source);
                    
                    btnAdd.setOnClickListener(v -> {
                        btnAdd.setText("Added ✓");
                        btnAdd.setBackgroundColor(Color.parseColor("#1e293b"));
                    });
                    
                    llDynamicContainer.addView(card);
                }
            }

            if (!recs.avoids.isEmpty()) {
                TextView tvAvoidHeader = new TextView(getContext());
                tvAvoidHeader.setText("PROHIBITED PAIRS (" + recs.avoids.size() + ")");
                tvAvoidHeader.setTextColor(Color.parseColor("#fb7185"));
                tvAvoidHeader.setTextSize(14f);
                tvAvoidHeader.setPadding(0, 32, 0, 16);
                llDynamicContainer.addView(tvAvoidHeader);

                for (CompanionEngine.AvoidResult avoid : recs.avoids) {
                    View card = inflater.inflate(R.layout.item_avoid_card, llDynamicContainer, false);
                    TextView tvName = card.findViewById(R.id.tvAvoidName);
                    TextView tvConfidence = card.findViewById(R.id.tvAvoidConfidence);
                    TextView tvReason = card.findViewById(R.id.tvAvoidReason);
                    
                    tvName.setText(avoid.cropName);
                    tvConfidence.setText(avoid.confidence + " Confidence");
                    tvReason.setText(avoid.reason);
                    llDynamicContainer.addView(card);
                }
            }

        } else {
            CompanionEngine.EngineNutrients nuts = CompanionEngine.getEngineNutrientGuidance(targetCrop, farmingMode, useSoilTestOverride ? cachedSoilReport : null);
            
            View nutrientView = inflater.inflate(R.layout.layout_nutrients_view, llDynamicContainer, false);
            
            TextView tvNutrientHeaderTitle = nutrientView.findViewById(R.id.tvNutrientHeaderTitle);
            TextView tvNutrientHeaderMode = nutrientView.findViewById(R.id.tvNutrientHeaderMode);
            TextView tvNutrientSoilBadge = nutrientView.findViewById(R.id.tvNutrientSoilBadge);
            TextView tvNutrientSummary = nutrientView.findViewById(R.id.tvNutrientSummary);
            TextView tvNutrientBasal = nutrientView.findViewById(R.id.tvNutrientBasal);
            TextView tvNutrientBio = nutrientView.findViewById(R.id.tvNutrientBio);
            TextView tvNutrientMicro = nutrientView.findViewById(R.id.tvNutrientMicro);
            TextView tvNutrientSplit = nutrientView.findViewById(R.id.tvNutrientSplit);
            
            tvNutrientHeaderTitle.setText("Nutrient Protocol Engine for " + targetCrop);
            tvNutrientHeaderMode.setText(nuts.mode);
            tvNutrientSoilBadge.setVisibility(nuts.isSoilReportOverridden ? View.VISIBLE : View.GONE);
            
            tvNutrientSummary.setText(nuts.npkSummary);
            
            StringBuilder basalSb = new StringBuilder();
            for(String s : nuts.details.basalDose) basalSb.append("• ").append(s).append("\n");
            tvNutrientBasal.setText(basalSb.toString().trim());
            
            StringBuilder bioSb = new StringBuilder();
            for(String s : nuts.details.biofertilizers) bioSb.append("• ").append(s).append("\n");
            tvNutrientBio.setText(bioSb.toString().trim());
            
            StringBuilder microSb = new StringBuilder();
            for(String s : nuts.details.foliarMicronutrients) microSb.append("• ").append(s).append("\n");
            tvNutrientMicro.setText(microSb.toString().trim());
            
            StringBuilder splitSb = new StringBuilder();
            for(String s : nuts.details.stageSplits) splitSb.append("• ").append(s).append("\n");
            tvNutrientSplit.setText(splitSb.toString().trim());
            
            llDynamicContainer.addView(nutrientView);
        }
    }
}
