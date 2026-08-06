package com.cropnexa.app;

import android.os.Bundle;
import android.view.View;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Must be called before super.onCreate if using androidx.core:core-splashscreen
        androidx.core.splashscreen.SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);

        // Set the native XML layout which contains the NavHostFragment
        setContentView(R.layout.activity_main);

        drawerLayout = findViewById(R.id.drawerLayout);
        BottomNavigationView bottomNav = findViewById(R.id.bottomNavigation);
        NavigationView navigationView = findViewById(R.id.navigationView);
        
        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager().findFragmentById(R.id.nav_host_fragment);
        
        if (navHostFragment != null) {
            NavController navController = navHostFragment.getNavController();
            
            // Link Side Drawer to NavController normally
            NavigationUI.setupWithNavController(navigationView, navController);

            // Link Bottom Nav but override item selected listener
            bottomNav.setOnItemSelectedListener(item -> {
                if (item.getItemId() == R.id.action_menu) {
                    openDrawer();
                    return false; // Don't show as selected
                } else {
                    return NavigationUI.onNavDestinationSelected(item, navController);
                }
            });

            // Keep bottom nav selections in sync when navigating from drawer/elsewhere
            navController.addOnDestinationChangedListener((controller, destination, arguments) -> {
                // Sync bottom nav selected item visually if it exists
                if (bottomNav.getMenu().findItem(destination.getId()) != null) {
                    bottomNav.getMenu().findItem(destination.getId()).setChecked(true);
                }
                
                // Hide bottom navigation and lock drawer on login screen
                if (destination.getId() == R.id.loginFragment) {
                    bottomNav.setVisibility(View.GONE);
                    drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
                } else {
                    bottomNav.setVisibility(View.VISIBLE);
                    drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
                }
            });
        }
    }
    
    // Method for fragments to open the side menu
    public void openDrawer() {
        if (drawerLayout != null) {
            drawerLayout.openDrawer(GravityCompat.START);
        }
    }
}
