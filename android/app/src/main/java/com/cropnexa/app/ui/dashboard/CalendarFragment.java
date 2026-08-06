package com.cropnexa.app.ui.dashboard;

import android.app.DatePickerDialog;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.CompanionEngine;
import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

public class CalendarFragment extends Fragment {

    private Spinner spinCalCrop;
    private Button btnPlantingDate;
    private TextView tvHarvestDate;
    private LinearLayout llStageFilters, llCalendarStages;
    private Button btnAddTask;

    private Calendar plantingCal = Calendar.getInstance();
    private String activeFilter = "All";

    private static final int CROP_DURATION_DAYS = 115;
    private final SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy", Locale.US);

    private List<Map<String, Object>> customTasks = new ArrayList<>();

    private static class StageTask {
        String title, category, priority, dueDate;
        StageTask(String title, String category, String priority, String dueDate) {
            this.title = title; this.category = category; this.priority = priority; this.dueDate = dueDate;
        }
    }

    private static class Stage {
        String id, name;
        int offsetStart, durationDays;
        int accentColor; // as int
        List<StageTask> tasks = new ArrayList<>();
        Stage(String id, String name, int offsetStart, int durationDays, int accentColor) {
            this.id = id; this.name = name; this.offsetStart = offsetStart;
            this.durationDays = durationDays; this.accentColor = accentColor;
        }
    }

    private List<Stage> generateStages() {
        List<Stage> stages = new ArrayList<>();
        Stage germination = new Stage("germination", "Germination", 0, 14, Color.parseColor("#34d399"));
        germination.tasks.add(new StageTask("Seed Sowing: Sow certified high-germination seeds in nursery/field.", "Germination", "High", addDays(1)));
        germination.tasks.add(new StageTask("Initial Irrigation: Apply light misting/drip irrigation.", "Irrigation", "High", addDays(2)));
        germination.tasks.add(new StageTask("Seed Treatment: Treat seeds with Trichoderma viride.", "Biofertilizer", "Medium", addDays(4)));

        Stage vegetative = new Stage("vegetative", "Growth / Maturation", 15, 30, Color.parseColor("#2dd4bf"));
        vegetative.tasks.add(new StageTask("Fertilizer Schedule: Apply 1st split dose of Nitrogen.", "Fertilizer", "High", addDays(18)));
        vegetative.tasks.add(new StageTask("Weed Management: Shallow hoeing and manual weeding.", "Soil & Weed", "Medium", addDays(24)));
        vegetative.tasks.add(new StageTask("Irrigation: Maintain 3-day regular irrigation cycle.", "Irrigation", "High", addDays(28)));

        Stage flowering = new Stage("flowering", "Flowering", 46, 25, Color.parseColor("#fbbf24"));
        flowering.tasks.add(new StageTask("Pest Monitoring: Scout weekly for thrips and aphids.", "Pest Check", "High", addDays(48)));
        flowering.tasks.add(new StageTask("Nutrient Spray: Apply 0.2% Borax foliar spray.", "Nutrient Spray", "High", addDays(62)));

        Stage reproductive = new Stage("reproductive", "Fruiting", 71, 25, Color.parseColor("#c084fc"));
        reproductive.tasks.add(new StageTask("Water Management: Maintain steady moisture.", "Water Management", "High", addDays(73)));
        reproductive.tasks.add(new StageTask("Disease Monitoring: Check fruit clusters.", "Disease Check", "High", addDays(80)));

        Stage maturity = new Stage("maturity", "Maturity", 96, 20, Color.parseColor("#38bdf8"));
        maturity.tasks.add(new StageTask("Harvest Preparation: Organize labor schedule.", "Preparation", "High", addDays(98)));
        maturity.tasks.add(new StageTask("Harvest: Begin selective manual picking.", "Harvest", "High", addDays(112)));

        stages.add(germination);
        stages.add(vegetative);
        stages.add(flowering);
        stages.add(reproductive);
        stages.add(maturity);
        return stages;
    }

    private String addDays(int days) {
        Calendar cal = (Calendar) plantingCal.clone();
        cal.add(Calendar.DAY_OF_YEAR, days);
        return sdf.format(cal.getTime());
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_calendar, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());

        spinCalCrop = view.findViewById(R.id.spinCalCrop);
        btnPlantingDate = view.findViewById(R.id.btnPlantingDate);
        tvHarvestDate = view.findViewById(R.id.tvHarvestDate);
        llStageFilters = view.findViewById(R.id.llStageFilters);
        llCalendarStages = view.findViewById(R.id.llCalendarStages);
        btnAddTask = view.findViewById(R.id.btnAddTask);

        List<String> cropNames = new ArrayList<>();
        for (CompanionEngine.Crop c : CompanionEngine.MASTER_CROPS) cropNames.add(c.name);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_item, cropNames);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinCalCrop.setAdapter(adapter);

        plantingCal.set(2026, Calendar.JULY, 1);
        btnPlantingDate.setText(sdf.format(plantingCal.getTime()));

        btnPlantingDate.setOnClickListener(v -> {
            DatePickerDialog dpd = new DatePickerDialog(requireContext(),
                (dp, year, month, day) -> {
                    plantingCal.set(year, month, day);
                    btnPlantingDate.setText(sdf.format(plantingCal.getTime()));
                    updateCalendarUI();
                },
                plantingCal.get(Calendar.YEAR),
                plantingCal.get(Calendar.MONTH),
                plantingCal.get(Calendar.DAY_OF_MONTH));
            dpd.show();
        });

        btnAddTask.setOnClickListener(v -> showAddTaskDialog());

        fetchCustomTasks();
        updateCalendarUI();
    }
    
    private void fetchCustomTasks() {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;
        
        String userId = auth.getCurrentUser().getUid();
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(userId)
            .get()
            .addOnSuccessListener(documentSnapshot -> {
                if (documentSnapshot.exists()) {
                    List<Map<String, Object>> cal = (List<Map<String, Object>>) documentSnapshot.get("calendar");
                    if (cal != null) {
                        customTasks.clear();
                        customTasks.addAll(cal);
                        updateCalendarUI();
                    }
                }
            });
    }

    private void updateCalendarUI() {
        if (getContext() == null) return;

        Calendar harvestCal = (Calendar) plantingCal.clone();
        harvestCal.add(Calendar.DAY_OF_YEAR, CROP_DURATION_DAYS);
        tvHarvestDate.setText(sdf.format(harvestCal.getTime()));

        llStageFilters.removeAllViews();
        List<Stage> stages = generateStages();

        addFilterPill("All", null);
        for (Stage s : stages) {
            addFilterPill(s.name, s.id);
        }

        renderStages(stages);
    }

    private void addFilterPill(String label, @Nullable String stageId) {
        Button pill = new Button(requireContext());
        pill.setText(label);
        pill.setTextSize(10f);
        
        boolean isActive = (stageId == null && activeFilter.equals("All")) || (stageId != null && activeFilter.equals(stageId));
        pill.setBackgroundColor(isActive ? Color.parseColor("#064e3b") : Color.parseColor("#1e293b"));
        pill.setTextColor(isActive ? Color.parseColor("#34d399") : Color.parseColor("#94a3b8"));
        
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 0, 8, 0);
        pill.setLayoutParams(params);
        
        pill.setOnClickListener(v -> {
            activeFilter = (stageId == null) ? "All" : stageId;
            updateCalendarUI();
        });
        
        llStageFilters.addView(pill);
    }

    private void renderStages(List<Stage> stages) {
        llCalendarStages.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(getContext());
        
        int stageNum = 0;
        for (Stage stage : stages) {
            if (!activeFilter.equals("All") && !activeFilter.equals(stage.id)) continue;
            stageNum++;

            LinearLayout stageCard = new LinearLayout(requireContext());
            stageCard.setOrientation(LinearLayout.VERTICAL);
            stageCard.setPadding(40, 40, 40, 40);
            stageCard.setBackgroundColor(Color.parseColor("#111625"));
            
            LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            cardParams.setMargins(0, 0, 0, 32);
            stageCard.setLayoutParams(cardParams);
            
            LinearLayout headerRow = new LinearLayout(requireContext());
            headerRow.setOrientation(LinearLayout.HORIZONTAL);
            headerRow.setGravity(android.view.Gravity.CENTER_VERTICAL);
            
            TextView tvNum = new TextView(requireContext());
            tvNum.setText(String.format("0%d", stageNum));
            tvNum.setTextColor(Color.parseColor("#cbd5e1"));
            tvNum.setTextSize(12f);
            tvNum.setTypeface(null, android.graphics.Typeface.BOLD);
            tvNum.setBackgroundColor(Color.parseColor("#020617"));
            tvNum.setPadding(16, 12, 16, 12);
            headerRow.addView(tvNum);

            LinearLayout stageInfo = new LinearLayout(requireContext());
            stageInfo.setOrientation(LinearLayout.VERTICAL);
            LinearLayout.LayoutParams infoParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            infoParams.setMargins(16, 0, 0, 0);
            stageInfo.setLayoutParams(infoParams);

            LinearLayout nameRow = new LinearLayout(requireContext());
            nameRow.setOrientation(LinearLayout.HORIZONTAL);
            nameRow.setGravity(android.view.Gravity.CENTER_VERTICAL);
            
            TextView tvStageName = new TextView(requireContext());
            tvStageName.setText(stage.name + " Phase");
            tvStageName.setTextColor(Color.parseColor("#f1f5f9"));
            tvStageName.setTextSize(15f);
            tvStageName.setTypeface(null, android.graphics.Typeface.BOLD);
            nameRow.addView(tvStageName);
            
            TextView tvDurationBadge = new TextView(requireContext());
            tvDurationBadge.setText("  " + stage.durationDays + " Days  ");
            tvDurationBadge.setTextColor(stage.accentColor);
            tvDurationBadge.setTextSize(9f);
            tvDurationBadge.setTypeface(null, android.graphics.Typeface.BOLD);
            tvDurationBadge.setBackgroundColor(Color.parseColor("#020617"));
            LinearLayout.LayoutParams badgeParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            badgeParams.setMargins(8, 0, 0, 0);
            tvDurationBadge.setLayoutParams(badgeParams);
            nameRow.addView(tvDurationBadge);
            
            stageInfo.addView(nameRow);

            String startDate = addDays(stage.offsetStart);
            String endDate = addDays(stage.offsetStart + stage.durationDays);
            TextView tvDateRange = new TextView(requireContext());
            tvDateRange.setText("Timeline: " + startDate + " — " + endDate);
            tvDateRange.setTextColor(Color.parseColor("#64748b"));
            tvDateRange.setTextSize(10f);
            stageInfo.addView(tvDateRange);

            headerRow.addView(stageInfo);
            stageCard.addView(headerRow);
            
            View divider = new View(requireContext());
            divider.setBackgroundColor(Color.parseColor("#1e293b"));
            LinearLayout.LayoutParams divParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 2);
            divParams.setMargins(0, 16, 0, 16);
            divider.setLayoutParams(divParams);
            stageCard.addView(divider);

            for (StageTask task : stage.tasks) {
                View taskView = inflater.inflate(R.layout.item_calendar_task, stageCard, false);
                TextView tvCat = taskView.findViewById(R.id.tvTaskCategory);
                TextView tvPri = taskView.findViewById(R.id.tvTaskPriority);
                TextView tvTitle = taskView.findViewById(R.id.tvTaskTitle);
                TextView tvDate = taskView.findViewById(R.id.tvTaskDate);
                
                tvCat.setText(task.category);
                tvCat.setTextColor(stage.accentColor);
                tvPri.setText(task.priority);
                tvTitle.setText(task.title);
                tvDate.setText("Scheduled: " + task.dueDate);
                
                stageCard.addView(taskView);
            }
            
            llCalendarStages.addView(stageCard);
        }
        
        // Render Custom Tasks
        if (!customTasks.isEmpty() && (activeFilter.equals("All") || activeFilter.equals("custom"))) {
            LinearLayout customCard = new LinearLayout(requireContext());
            customCard.setOrientation(LinearLayout.VERTICAL);
            customCard.setPadding(40, 40, 40, 40);
            customCard.setBackgroundColor(Color.parseColor("#111625"));
            
            LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            cardParams.setMargins(0, 0, 0, 32);
            customCard.setLayoutParams(cardParams);
            
            TextView tvTitle = new TextView(requireContext());
            tvTitle.setText("CUSTOM ACTIVITIES (" + customTasks.size() + ")");
            tvTitle.setTextColor(Color.parseColor("#34d399"));
            tvTitle.setTextSize(12f);
            tvTitle.setTypeface(null, android.graphics.Typeface.BOLD);
            customCard.addView(tvTitle);
            
            View divider = new View(requireContext());
            divider.setBackgroundColor(Color.parseColor("#064e3b"));
            LinearLayout.LayoutParams divParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 2);
            divParams.setMargins(0, 16, 0, 16);
            divider.setLayoutParams(divParams);
            customCard.addView(divider);
            
            for (Map<String, Object> task : customTasks) {
                View taskView = inflater.inflate(R.layout.item_calendar_task, customCard, false);
                TextView tvCat = taskView.findViewById(R.id.tvTaskCategory);
                TextView tvPri = taskView.findViewById(R.id.tvTaskPriority);
                TextView tvT = taskView.findViewById(R.id.tvTaskTitle);
                TextView tvD = taskView.findViewById(R.id.tvTaskDate);
                
                String category = (String) task.get("category");
                String title = (String) task.get("task");
                String priority = (String) task.get("priority");
                String date = (String) task.get("date");
                Boolean completed = (Boolean) task.get("completed");
                
                if (completed != null && completed) {
                    tvT.setPaintFlags(tvT.getPaintFlags() | android.graphics.Paint.STRIKE_THRU_TEXT_FLAG);
                    taskView.setAlpha(0.6f);
                }
                
                tvCat.setText(category);
                tvCat.setTextColor(Color.parseColor("#34d399"));
                tvPri.setText(priority);
                tvT.setText(title);
                tvD.setText("Due: " + date);
                
                customCard.addView(taskView);
            }
            
            llCalendarStages.addView(customCard);
        }
    }

    private void showAddTaskDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(requireContext(), android.R.style.Theme_DeviceDefault_Dialog_Alert);
        View dialogView = LayoutInflater.from(requireContext()).inflate(R.layout.dialog_add_task, null);
        builder.setView(dialogView);
        
        AlertDialog dialog = builder.create();
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        }
        
        EditText etTitle = dialogView.findViewById(R.id.etTaskTitle);
        Spinner spinCat = dialogView.findViewById(R.id.spinCategory);
        Spinner spinPri = dialogView.findViewById(R.id.spinPriority);
        Button btnDate = dialogView.findViewById(R.id.btnDueDate);
        
        String[] categories = {"Irrigation", "Fertilizer", "Biofertilizer", "Pest Monitoring", "Harvesting"};
        ArrayAdapter<String> catAdapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_item, categories);
        catAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinCat.setAdapter(catAdapter);
        
        String[] priorities = {"High", "Medium", "Low"};
        ArrayAdapter<String> priAdapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_item, priorities);
        priAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinPri.setAdapter(priAdapter);
        
        final Calendar selectedCal = Calendar.getInstance();
        btnDate.setText(sdf.format(selectedCal.getTime()));
        
        btnDate.setOnClickListener(v -> {
            new DatePickerDialog(requireContext(), (dp, y, m, d) -> {
                selectedCal.set(y, m, d);
                btnDate.setText(sdf.format(selectedCal.getTime()));
            }, selectedCal.get(Calendar.YEAR), selectedCal.get(Calendar.MONTH), selectedCal.get(Calendar.DAY_OF_MONTH)).show();
        });
        
        builder.setPositiveButton("ADD TASK", (d, w) -> {
            String title = etTitle.getText().toString();
            if (title.isEmpty()) return;
            
            String cat = spinCat.getSelectedItem().toString();
            String pri = spinPri.getSelectedItem().toString();
            String date = btnDate.getText().toString();
            
            Map<String, Object> newTask = new HashMap<>();
            newTask.put("id", UUID.randomUUID().toString());
            newTask.put("task", title);
            newTask.put("category", cat);
            newTask.put("priority", pri);
            newTask.put("date", date);
            newTask.put("completed", false);
            
            saveCustomTaskToFirebase(newTask);
        });
        
        builder.setNegativeButton("CANCEL", null);
        
        dialog.show();
    }
    
    private void saveCustomTaskToFirebase(Map<String, Object> newTask) {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;
        
        String userId = auth.getCurrentUser().getUid();
        DocumentReference docRef = FirebaseManager.getInstance().getDb().collection("users").document(userId);
        
        customTasks.add(newTask);
        docRef.update("calendar", customTasks).addOnSuccessListener(aVoid -> {
            Toast.makeText(getContext(), "Task Scheduled", Toast.LENGTH_SHORT).show();
            updateCalendarUI();
        });
    }
}
