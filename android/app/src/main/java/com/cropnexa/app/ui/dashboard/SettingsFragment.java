package com.cropnexa.app.ui.dashboard;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.LocaleHelper;
import com.cropnexa.app.R;
import com.google.android.material.switchmaterial.SwitchMaterial;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseAuth;

import java.util.HashMap;
import java.util.Map;

public class SettingsFragment extends Fragment {

    private TextInputEditText etFarmerName, etMobile, etEmail, etAddress;
    private TextInputEditText etFarmName, etGps, etVillage, etDistrict, etState;
    private TextInputEditText etTotalLand, etIrrigated, etRainfed;
    private TextInputEditText etSoilType, etPreviousCrop, etCurrentCrop, etPlannedCrop, etFarmingPractice;
    private SwitchMaterial switchSms;
    private Spinner spinnerLanguage;
    private RadioGroup rgTheme;

    private Map<String, Object> currentProfile = new HashMap<>();

    private static final String[] LANG_CODES = {
        "en", "ta", "hi", "te", "kn", "ml", "bn", "gu", "mr", "pa", "or"
    };

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

        switchSms = view.findViewById(R.id.switchSms);
        spinnerLanguage = view.findViewById(R.id.spinnerLanguage);
        rgTheme = view.findViewById(R.id.rgTheme);

        setupLanguageSpinner();
        setupThemeRadio();
        setupSmsSwitch();

        Button btnSaveSettings = view.findViewById(R.id.btnSaveSettings);
        if (btnSaveSettings != null) {
            btnSaveSettings.setOnClickListener(v -> saveSettings(view));
        }

        Button btnLogout = view.findViewById(R.id.btnLogout);
        if (btnLogout != null) {
            btnLogout.setOnClickListener(v -> {
                FirebaseAuth.getInstance().signOut();
                Navigation.findNavController(view).navigate(R.id.loginFragment);
            });
        }

        fetchProfile();
    }

    private void setupLanguageSpinner() {
        String[] langNames = getResources().getStringArray(R.array.language_names);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(),
                android.R.layout.simple_spinner_item, langNames);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerLanguage.setAdapter(adapter);

        String savedLang = LocaleHelper.getSavedLanguage(requireContext());
        for (int i = 0; i < LANG_CODES.length; i++) {
            if (LANG_CODES[i].equals(savedLang)) {
                spinnerLanguage.setSelection(i);
                break;
            }
        }
    }

    private void setupThemeRadio() {
        String savedTheme = LocaleHelper.getSavedTheme(requireContext());
        if (LocaleHelper.THEME_LIGHT.equals(savedTheme)) {
            rgTheme.check(R.id.rbLight);
        } else {
            rgTheme.check(R.id.rbDark);
        }
    }

    private void setupSmsSwitch() {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(auth.getCurrentUser().getUid())
            .get()
            .addOnSuccessListener(doc -> {
                if (doc.exists() && switchSms != null) {
                    Boolean smsEnabled = doc.getBoolean("smsEnabled");
                    switchSms.setChecked(smsEnabled == null || smsEnabled);
                }
            });
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
            .addOnFailureListener(e ->
                Toast.makeText(requireContext(), "Failed to load profile", Toast.LENGTH_SHORT).show());
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
        if (et != null && currentProfile != null && currentProfile.containsKey(key)) {
            Object value = currentProfile.get(key);
            if (value != null) et.setText(String.valueOf(value));
        }
    }

    private void saveSettings(View view) {
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
        try { updatedProfile.put("totalLandArea", Double.parseDouble(getTextSafe(etTotalLand))); } catch (Exception ignored) {}
        try { updatedProfile.put("irrigatedArea", Double.parseDouble(getTextSafe(etIrrigated))); } catch (Exception ignored) {}
        try { updatedProfile.put("rainfedArea", Double.parseDouble(getTextSafe(etRainfed))); } catch (Exception ignored) {}
        updatedProfile.put("soilType", getTextSafe(etSoilType));
        updatedProfile.put("previousCrop", getTextSafe(etPreviousCrop));
        updatedProfile.put("currentCrop", getTextSafe(etCurrentCrop));
        updatedProfile.put("plannedCrop", getTextSafe(etPlannedCrop));
        updatedProfile.put("farmingPractice", getTextSafe(etFarmingPractice));

        int selectedLangPos = spinnerLanguage.getSelectedItemPosition();
        String newLang = (selectedLangPos >= 0 && selectedLangPos < LANG_CODES.length)
                ? LANG_CODES[selectedLangPos] : "en";
        String newTheme = (rgTheme.getCheckedRadioButtonId() == R.id.rbLight)
                ? LocaleHelper.THEME_LIGHT : LocaleHelper.THEME_DARK;
        boolean smsEnabled = switchSms != null && switchSms.isChecked();

        Map<String, Object> userUpdates = new HashMap<>();
        userUpdates.put("profile", updatedProfile);
        userUpdates.put("smsEnabled", smsEnabled);
        userUpdates.put("preferredLanguage", newLang);
        userUpdates.put("preferredTheme", newTheme);

        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(auth.getCurrentUser().getUid())
            .update(userUpdates)
            .addOnSuccessListener(aVoid -> {
                Toast.makeText(requireContext(), getString(R.string.saved_success), Toast.LENGTH_SHORT).show();
                LocaleHelper.saveLanguage(requireContext(), newLang);
                LocaleHelper.saveTheme(requireContext(), newTheme);
                LocaleHelper.applyTheme(newTheme);
                if (requireActivity() != null) {
                    requireActivity().recreate();
                }
            })
            .addOnFailureListener(e ->
                Toast.makeText(requireContext(), "Error saving: " + e.getMessage(), Toast.LENGTH_SHORT).show());
    }

    private String getTextSafe(TextInputEditText et) {
        return et != null && et.getText() != null ? et.getText().toString().trim() : "";
    }
}
