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

public class ForgotPasswordFragment extends Fragment {

    private TextInputEditText emailEditText;
    private Button resetButton;
    private TextView backToLoginText;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_forgot_password, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        emailEditText = view.findViewById(R.id.emailEditText);
        resetButton = view.findViewById(R.id.resetButton);
        backToLoginText = view.findViewById(R.id.backToLoginText);

        resetButton.setOnClickListener(v -> {
            String email = emailEditText.getText() != null ? emailEditText.getText().toString() : "";

            if (email.isEmpty()) {
                Toast.makeText(requireContext(), "Please enter your email address", Toast.LENGTH_SHORT).show();
                return;
            }

            resetButton.setText("Sending...");
            resetButton.setEnabled(false);

            FirebaseManager.getInstance().getAuth()
                .sendPasswordResetEmail(email)
                .addOnCompleteListener(requireActivity(), task -> {
                    if (task.isSuccessful()) {
                        Toast.makeText(requireContext(), "Password reset email sent!", Toast.LENGTH_LONG).show();
                        Navigation.findNavController(view).navigate(R.id.action_forgotPasswordFragment_to_loginFragment);
                    } else {
                        Toast.makeText(requireContext(), "Error: " + task.getException().getMessage(), Toast.LENGTH_LONG).show();
                        resetButton.setText("Send Reset Link");
                        resetButton.setEnabled(true);
                    }
                });
        });

        backToLoginText.setOnClickListener(v -> {
            Navigation.findNavController(view).navigate(R.id.action_forgotPasswordFragment_to_loginFragment);
        });
    }
}
