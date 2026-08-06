package com.cropnexa.app.ui.dashboard;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.recyclerview.widget.RecyclerView;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.List;

public class AdminFragment extends Fragment {

    private TextView tvTotalFarmers;
    private TextView tvVerifiedAccounts;
    private RecyclerView rvUsers;
    private UserAdapter userAdapter;
    private List<DocumentSnapshot> userList;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_admin, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        Toolbar toolbar = view.findViewById(R.id.toolbar);
        if (toolbar != null) {
            toolbar.setNavigationOnClickListener(v -> Navigation.findNavController(v).navigateUp());
        }

        tvTotalFarmers = view.findViewById(R.id.tvTotalFarmers);
        tvVerifiedAccounts = view.findViewById(R.id.tvVerifiedAccounts);
        rvUsers = view.findViewById(R.id.rvUsers);

        userList = new ArrayList<>();
        userAdapter = new UserAdapter(userList);
        rvUsers.setAdapter(userAdapter);

        fetchUsersData();
    }

    private void fetchUsersData() {
        FirebaseManager.getInstance().getDb().collection("users").get()
            .addOnSuccessListener(queryDocumentSnapshots -> {
                userList.clear();
                int totalFarmers = 0;
                int verifiedAccounts = 0;

                for (DocumentSnapshot doc : queryDocumentSnapshots) {
                    Boolean isAdmin = doc.getBoolean("isAdmin");
                    if (isAdmin == null || !isAdmin) {
                        totalFarmers++;
                    }
                    
                    Boolean isVerified = doc.getBoolean("isEmailVerified");
                    if (Boolean.TRUE.equals(isVerified)) {
                        verifiedAccounts++;
                    }
                    
                    userList.add(doc);
                }

                if (tvTotalFarmers != null) {
                    tvTotalFarmers.setText(String.valueOf(totalFarmers));
                }
                if (tvVerifiedAccounts != null) {
                    tvVerifiedAccounts.setText(String.valueOf(verifiedAccounts));
                }
                
                userAdapter.notifyDataSetChanged();
            })
            .addOnFailureListener(e -> {
                Log.e("AdminFragment", "Error fetching users", e);
            });
    }
}
