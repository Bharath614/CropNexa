package com.cropnexa.app.ui.dashboard;

import android.app.Dialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.cropnexa.app.R;

public class NutrientGuideDialogFragment extends DialogFragment {

    public static class NutrientInfo {
        String name, symbol, category, role, deficiency, dosage;
        public NutrientInfo(String name, String symbol, String category, String role, String deficiency, String dosage) {
            this.name = name; this.symbol = symbol; this.category = category;
            this.role = role; this.deficiency = deficiency; this.dosage = dosage;
        }
    }

    private final NutrientInfo[] nutrients = {
        new NutrientInfo("Nitrogen", "N", "Macronutrient", "Essential for vegetative growth, chlorophyll synthesis, protein formation, and leaf development.", "Yellowing of older lower leaves (chlorosis), stunted growth.", "100 - 150 kg/ha N equivalent"),
        new NutrientInfo("Phosphorus", "P", "Macronutrient", "Critical for early root elongation, seed germination, flowering, ATP energy transfer.", "Purplish or reddish discoloration on underside of mature leaves.", "40 - 80 kg/ha P2O5 equivalent"),
        new NutrientInfo("Potassium", "K", "Macronutrient", "Regulates stomatal opening, drought tolerance, fruit size, disease resistance.", "Marginal leaf scorch (browning/burning of leaf margins).", "50 - 100 kg/ha K2O equivalent"),
        new NutrientInfo("Calcium", "Ca", "Secondary Nutrient", "Forms cell wall middle lamella, drives shoot apex expansion.", "Blossom end rot in fruit, cupped young leaves.", "20 - 50 kg/ha elemental Ca"),
        new NutrientInfo("Magnesium", "Mg", "Secondary Nutrient", "Central atom in chlorophyll molecule; activates enzyme reactions.", "Interveinal chlorosis starting on older lower leaves.", "15 - 30 kg/ha Epsom salt"),
        new NutrientInfo("Sulphur", "S", "Secondary Nutrient", "Essential component of amino acids, oil synthesis.", "General uniform pale yellowing starting on NEW young leaves.", "20 - 40 kg/ha elemental S"),
        new NutrientInfo("Zinc", "Zn", "Micronutrient", "Synthesis of growth hormone, internode expansion.", "Little leaf disease, severely shortened internodes.", "10 - 25 kg/ha Zinc Sulphate"),
        new NutrientInfo("Iron", "Fe", "Micronutrient", "Electron transport catalyst in photosynthesis.", "Interveinal chlorosis on youngest emerging leaves turning white.", "5 - 10 kg/ha Fe-EDTA"),
        new NutrientInfo("Boron", "B", "Micronutrient", "Cell wall cross-linking, pollen tube growth.", "Hollow heart in root crops, poor fruit set.", "5 - 10 kg/ha Borax"),
        new NutrientInfo("Copper", "Cu", "Micronutrient", "Lignin synthesis for cell structural strength.", "Wilting young leaves, dieback of terminal shoots.", "2.5 - 5 kg/ha Copper Sulphate"),
        new NutrientInfo("Manganese", "Mn", "Micronutrient", "Drives water-splitting reaction in photosynthesis.", "Interveinal chlorosis on middle leaves with small necrotic spots.", "5 - 10 kg/ha Manganese Sulphate"),
        new NutrientInfo("Molybdenum", "Mo", "Micronutrient", "Essential for nitrogen fixation in legumes.", "Whiptail in cauliflower (narrow cupped leaves).", "0.5 - 1 kg/ha Sodium Molybdate")
    };

    @Override
    public void onStart() {
        super.onStart();
        Dialog dialog = getDialog();
        if (dialog != null) {
            int width = ViewGroup.LayoutParams.MATCH_PARENT;
            int height = ViewGroup.LayoutParams.MATCH_PARENT;
            dialog.getWindow().setLayout(width, height);
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if (getDialog() != null && getDialog().getWindow() != null) {
            getDialog().getWindow().requestFeature(Window.FEATURE_NO_TITLE);
        }
        return inflater.inflate(R.layout.dialog_nutrient_guide, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        ImageButton btnClose = view.findViewById(R.id.btnClose);
        btnClose.setOnClickListener(v -> dismiss());

        LinearLayout container = view.findViewById(R.id.container_nutrients);
        LayoutInflater inflater = LayoutInflater.from(getContext());

        for (NutrientInfo nut : nutrients) {
            View itemView = inflater.inflate(R.layout.item_nutrient_guide, container, false);
            
            TextView tvSymbol = itemView.findViewById(R.id.tvSymbol);
            TextView tvName = itemView.findViewById(R.id.tvName);
            TextView tvCategory = itemView.findViewById(R.id.tvCategory);
            TextView tvRole = itemView.findViewById(R.id.tvRole);
            TextView tvDeficiency = itemView.findViewById(R.id.tvDeficiency);
            TextView tvDosage = itemView.findViewById(R.id.tvDosage);

            tvSymbol.setText(nut.symbol);
            tvName.setText(nut.name);
            tvCategory.setText(nut.category);
            tvRole.setText(nut.role);
            tvDeficiency.setText(nut.deficiency);
            tvDosage.setText(nut.dosage);

            container.addView(itemView);
        }
    }
}
