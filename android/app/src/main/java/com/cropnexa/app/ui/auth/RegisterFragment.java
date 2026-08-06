package com.cropnexa.app.ui.auth;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.cropnexa.app.FirebaseManager;
import com.cropnexa.app.R;
import com.google.android.material.textfield.TextInputEditText;

import java.util.HashMap;
import java.util.Map;

public class RegisterFragment extends Fragment {

    private TextInputEditText nameEditText;
    private TextInputEditText emailEditText;
    private TextInputEditText passwordEditText;
    private Button registerButton;
    private TextView loginText;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_register, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        nameEditText = view.findViewById(R.id.nameEditText);
        emailEditText = view.findViewById(R.id.emailEditText);
        passwordEditText = view.findViewById(R.id.passwordEditText);
        registerButton = view.findViewById(R.id.registerButton);
        loginText = view.findViewById(R.id.loginText);

        registerButton.setOnClickListener(v -> {
            String name = nameEditText.getText() != null ? nameEditText.getText().toString() : "";
            String email = emailEditText.getText() != null ? emailEditText.getText().toString() : "";
            String password = passwordEditText.getText() != null ? passwordEditText.getText().toString() : "";

            if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(requireContext(), "Please fill in all fields", Toast.LENGTH_SHORT).show();
                return;
            }
            
            if (password.length() < 6) {
                Toast.makeText(requireContext(), "Password must be at least 6 characters", Toast.LENGTH_SHORT).show();
                return;
            }

            registerButton.setText("Creating Account...");
            registerButton.setEnabled(false);

            FirebaseManager.getInstance().getAuth()
                .createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(requireActivity(), task -> {
                    if (task.isSuccessful()) {
                        String uid = task.getResult().getUser().getUid();
                        createFirestoreProfile(uid, name, email, view);
                    } else {
                        Toast.makeText(requireContext(), "Registration failed: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
                        registerButton.setText("Register");
                        registerButton.setEnabled(true);
                    }
                });
        });

        loginText.setOnClickListener(v -> {
            Navigation.findNavController(view).navigate(R.id.action_registerFragment_to_loginFragment);
        });
    }
    
    private void createFirestoreProfile(String uid, String name, String email, View view) {
        Map<String, Object> userDoc = new HashMap<>();
        Map<String, Object> profileData = new HashMap<>();
        
        profileData.put("farmerName", name);
        profileData.put("email", email);
        profileData.put("totalLandArea", 2.5);
        profileData.put("currentCrop", "Tomato");
        profileData.put("farmingPractice", "Organic Farming");
        profileData.put("gpsLocation", "12.5186° N, 78.2139° E");
        profileData.put("soilType", "Red Sandy Loam");
        
        userDoc.put("profile", profileData);
        userDoc.put("createdAt", System.currentTimeMillis());
        
        FirebaseManager.getInstance().getDb()
            .collection("users")
            .document(uid)
            .set(userDoc)
            .addOnSuccessListener(aVoid -> {
                Toast.makeText(requireContext(), "Registration successful!", Toast.LENGTH_SHORT).show();
                Navigation.findNavController(view).navigate(R.id.action_registerFragment_to_dashboardFragment);
            })
            .addOnFailureListener(e -> {
                Toast.makeText(requireContext(), "Failed to create profile record: " + e.getMessage(), Toast.LENGTH_LONG).show();
                registerButton.setText("Register");
                registerButton.setEnabled(true);
            });
    }
}
