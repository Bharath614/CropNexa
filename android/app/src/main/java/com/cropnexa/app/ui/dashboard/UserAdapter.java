package com.cropnexa.app.ui.dashboard;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.cropnexa.app.R;
import com.google.firebase.firestore.DocumentSnapshot;

import java.util.List;
import java.util.Map;

public class UserAdapter extends RecyclerView.Adapter<UserAdapter.UserViewHolder> {

    private final List<DocumentSnapshot> userList;

    public UserAdapter(List<DocumentSnapshot> userList) {
        this.userList = userList;
    }

    @NonNull
    @Override
    public UserViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_user, parent, false);
        return new UserViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull UserViewHolder holder, int position) {
        DocumentSnapshot doc = userList.get(position);
        
        String email = doc.getString("email");
        if (email == null) email = "Unknown Email";
        
        String name = "Unknown";
        String mobile = "—";
        String farmName = "—";
        String location = "—";
        
        Map<String, Object> profile = (Map<String, Object>) doc.get("profile");
        if (profile != null) {
            if (profile.containsKey("farmerName")) name = (String) profile.get("farmerName");
            if (profile.containsKey("farmName")) farmName = (String) profile.get("farmName");
            
            String village = (String) profile.get("village");
            String district = (String) profile.get("district");
            if (village != null || district != null) {
                location = (village != null ? village : "") + (village != null && district != null ? ", " : "") + (district != null ? district : "");
            }
        }
        if (doc.contains("mobile")) {
            mobile = doc.getString("mobile");
        }

        holder.tvUserName.setText(name);
        holder.tvUserEmail.setText(email);
        holder.tvUserPhone.setText("Phone: " + (mobile != null ? mobile : "—") + " | Farm: " + farmName);
        holder.tvUserLocation.setText("Location: " + location);

        String initials = "U";
        if (!name.equals("Unknown") && name.length() > 0) {
            initials = name.substring(0, 1).toUpperCase();
        }
        holder.tvUserInitials.setText(initials);

        Boolean isAdmin = doc.getBoolean("isAdmin");
        if (Boolean.TRUE.equals(isAdmin)) {
            holder.tvUserRole.setText("Admin");
            holder.tvUserRole.setTextColor(android.graphics.Color.parseColor("#818cf8")); // Indigo
            holder.tvUserRole.setBackgroundResource(0); // Removing bg for simplicity or could add indigo bg
        } else {
            holder.tvUserRole.setText("Farmer");
            holder.tvUserRole.setTextColor(android.graphics.Color.parseColor("#34d399"));
        }

        Boolean isVerified = doc.getBoolean("isEmailVerified");
        if (Boolean.TRUE.equals(isVerified)) {
            holder.tvVerifiedStatus.setText("Email Verified");
            holder.tvVerifiedStatus.setTextColor(android.graphics.Color.parseColor("#34d399"));
            holder.tvVerifiedStatus.setBackgroundResource(R.drawable.bg_badge_emerald);
        } else {
            holder.tvVerifiedStatus.setText("Email Unverified");
            holder.tvVerifiedStatus.setTextColor(android.graphics.Color.parseColor("#fbbf24"));
            holder.tvVerifiedStatus.setBackgroundResource(R.drawable.bg_badge_amber);
        }
    }

    @Override
    public int getItemCount() {
        return userList.size();
    }

    static class UserViewHolder extends RecyclerView.ViewHolder {
        TextView tvUserName, tvUserEmail, tvUserPhone, tvUserLocation;
        TextView tvUserInitials, tvUserRole, tvVerifiedStatus;

        public UserViewHolder(@NonNull View itemView) {
            super(itemView);
            tvUserName = itemView.findViewById(R.id.tvUserName);
            tvUserEmail = itemView.findViewById(R.id.tvUserEmail);
            tvUserPhone = itemView.findViewById(R.id.tvUserPhone);
            tvUserLocation = itemView.findViewById(R.id.tvUserLocation);
            tvUserInitials = itemView.findViewById(R.id.tvUserInitials);
            tvUserRole = itemView.findViewById(R.id.tvUserRole);
            tvVerifiedStatus = itemView.findViewById(R.id.tvVerifiedStatus);
        }
    }
}
