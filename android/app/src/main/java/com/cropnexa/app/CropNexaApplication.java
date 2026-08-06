package com.cropnexa.app;

import android.app.Application;

/**
 * Custom Application class.
 * Called before ANY Activity is created — the right place to set the night mode
 * so AppCompatDelegate DayNight theming works on cold start and after recreate().
 */
public class CropNexaApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();
        // Apply the saved theme (dark/light) before any Activity window is created.
        // This is the ONLY reliable place to call setDefaultNightMode().
        LocaleHelper.applyTheme(this);
    }
}
