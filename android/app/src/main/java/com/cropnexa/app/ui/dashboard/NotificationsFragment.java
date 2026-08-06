package com.cropnexa.app.ui.dashboard;

import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.google.android.material.card.MaterialCardView;
import com.google.firebase.auth.FirebaseAuth;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class NotificationsFragment extends Fragment {

    private RecyclerView rvNotifications;
    private NotificationAdapter adapter;
    private List<Map<String, Object>> allNotifications = new ArrayList<>();
    private List<Map<String, Object>> filteredNotifications = new ArrayList<>();
    
    private String activeCategory = "All";
    private String searchQuery = "";
    
    private LinearLayout llCategoryFilters;
    private Button btnMarkAllRead;
    
    private final String[] categories = {
        "All", "Weather Alerts", "Soil Health", "Companion Plants", 
        "Farm Calendar", "Fertilizer Alerts", "Pest and Disease", "AI Insights", "System"
    };

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_notifications, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        Switch switchPush = view.findViewById(R.id.switchPush);
        if (switchPush != null) {
            switchPush.setOnCheckedChangeListener((buttonView, isChecked) -> {
                String status = isChecked ? "enabled" : "disabled";
                Toast.makeText(requireContext(), "Push notifications " + status, Toast.LENGTH_SHORT).show();
            });
        }
        
        btnMarkAllRead = view.findViewById(R.id.btnMarkAllRead);
        btnMarkAllRead.setOnClickListener(v -> {
            for (Map<String, Object> notif : allNotifications) {
                notif.put("read", true);
            }
            saveNotifications();
        });

        EditText etSearch = view.findViewById(R.id.etSearch);
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}
            @Override public void afterTextChanged(Editable s) {
                searchQuery = s.toString();
                filterNotifications();
            }
        });
        
        llCategoryFilters = view.findViewById(R.id.llCategoryFilters);
        buildCategoryFilters();
        
        rvNotifications = view.findViewById(R.id.rvNotifications);
        rvNotifications.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new NotificationAdapter();
        rvNotifications.setAdapter(adapter);
        
        fetchNotifications();
    }
    
    private void buildCategoryFilters() {
        llCategoryFilters.removeAllViews();
        for (String cat : categories) {
            Button pill = new Button(requireContext());
            pill.setText(cat);
            pill.setTextSize(10f);
            
            boolean isActive = activeCategory.equals(cat);
            pill.setBackgroundColor(isActive ? Color.parseColor("#022c22") : Color.parseColor("#020617"));
            pill.setTextColor(isActive ? Color.parseColor("#6ee7b7") : Color.parseColor("#94a3b8"));
            
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
            params.setMargins(0, 0, 16, 0);
            pill.setLayoutParams(params);
            
            pill.setOnClickListener(v -> {
                activeCategory = cat;
                buildCategoryFilters();
                filterNotifications();
            });
            
            llCategoryFilters.addView(pill);
        }
    }
    
    private void fetchNotifications() {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;
        
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(auth.getCurrentUser().getUid())
            .addSnapshotListener((documentSnapshot, error) -> {
                if (error != null) {
                    return;
                }
                if (documentSnapshot != null && documentSnapshot.exists()) {
                    List<Map<String, Object>> notifs = (List<Map<String, Object>>) documentSnapshot.get("notifications");
                    if (notifs != null) {
                        allNotifications.clear();
                        allNotifications.addAll(notifs);
                        filterNotifications();
                    }
                }
            });
    }
    
    private void filterNotifications() {
        filteredNotifications.clear();
        int unreadCount = 0;
        
        for (Map<String, Object> notif : allNotifications) {
            String cat = (String) notif.get("category");
            String title = (String) notif.get("title");
            String msg = (String) notif.get("message");
            Boolean read = (Boolean) notif.get("read");
            
            if (read == null || !read) unreadCount++;
            
            boolean matchesCat = activeCategory.equals("All") || activeCategory.equals(cat);
            boolean matchesSearch = searchQuery.isEmpty() || 
                (title != null && title.toLowerCase().contains(searchQuery.toLowerCase())) ||
                (msg != null && msg.toLowerCase().contains(searchQuery.toLowerCase()));
                
            if (matchesCat && matchesSearch) {
                filteredNotifications.add(notif);
            }
        }
        
        if (unreadCount > 0) {
            btnMarkAllRead.setText("Mark All Read (" + unreadCount + ")");
            btnMarkAllRead.setVisibility(View.VISIBLE);
        } else {
            btnMarkAllRead.setVisibility(View.GONE);
        }
        
        adapter.notifyDataSetChanged();
    }
    
    private void saveNotifications() {
        FirebaseAuth auth = FirebaseManager.getInstance().getAuth();
        if (auth.getCurrentUser() == null) return;
        
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(auth.getCurrentUser().getUid())
            .update("notifications", allNotifications)
            .addOnSuccessListener(aVoid -> filterNotifications());
    }
    
    private class NotificationAdapter extends RecyclerView.Adapter<NotificationAdapter.ViewHolder> {
        
        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_notification, parent, false);
            return new ViewHolder(view);
        }
        
        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Map<String, Object> notif = filteredNotifications.get(position);
            
            String id = (String) notif.get("id");
            String category = (String) notif.get("category");
            String title = (String) notif.get("title");
            String message = (String) notif.get("message");
            String timestamp = (String) notif.get("timestamp");
            Boolean read = (Boolean) notif.get("read");
            
            holder.tvCategory.setText(category);
            holder.tvTitle.setText(title);
            holder.tvMessage.setText(message);
            holder.tvTimestamp.setText(timestamp);
            
            if (read != null && read) {
                holder.viewUnreadDot.setVisibility(View.GONE);
                holder.btnMarkRead.setVisibility(View.GONE);
                holder.cardNotification.setCardBackgroundColor(Color.parseColor("#0f172a"));
                holder.cardNotification.setAlpha(0.8f);
            } else {
                holder.viewUnreadDot.setVisibility(View.VISIBLE);
                holder.btnMarkRead.setVisibility(View.VISIBLE);
                holder.cardNotification.setCardBackgroundColor(Color.parseColor("#1e293b"));
                holder.cardNotification.setAlpha(1.0f);
            }
            
            holder.btnMarkRead.setOnClickListener(v -> {
                notif.put("read", true);
                saveNotifications();
            });
            
            holder.btnDelete.setOnClickListener(v -> {
                allNotifications.remove(notif);
                saveNotifications();
            });
        }
        
        @Override
        public int getItemCount() {
            return filteredNotifications.size();
        }
        
        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvCategory, tvTimestamp, tvTitle, tvMessage;
            View viewUnreadDot;
            ImageButton btnMarkRead, btnDelete;
            MaterialCardView cardNotification;
            
            ViewHolder(View itemView) {
                super(itemView);
                tvCategory = itemView.findViewById(R.id.tvCategory);
                tvTimestamp = itemView.findViewById(R.id.tvTimestamp);
                tvTitle = itemView.findViewById(R.id.tvTitle);
                tvMessage = itemView.findViewById(R.id.tvMessage);
                viewUnreadDot = itemView.findViewById(R.id.viewUnreadDot);
                btnMarkRead = itemView.findViewById(R.id.btnMarkRead);
                btnDelete = itemView.findViewById(R.id.btnDelete);
                cardNotification = itemView.findViewById(R.id.cardNotification);
            }
        }
    }
}
