package com.cropnexa.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Build;
import android.os.LocaleList;

import java.util.Locale;

/**
 * Helper class to apply locale (language) changes app-wide.
 * Call attachBaseContext() from every Activity to ensure locale is applied.
 */
public class LocaleHelper {

    private static final String PREFS_NAME = "CropNexaPrefs";
    private static final String PREF_LANGUAGE = "pref_language";
    private static final String PREF_THEME = "pref_theme";

    // ── Language ───────────────────────────────────────────────────────────

    /** Save the selected language code (e.g. "hi", "ta") to SharedPreferences. */
    public static void saveLanguage(Context context, String langCode) {
        getPrefs(context).edit().putString(PREF_LANGUAGE, langCode).apply();
    }

    /** Retrieve the saved language code, default "en". */
    public static String getSavedLanguage(Context context) {
        return getPrefs(context).getString(PREF_LANGUAGE, "en");
    }

    /**
     * Wrap the given Context with the saved (or provided) locale.
     * Call this in Activity.attachBaseContext().
     */
    public static Context applyLocale(Context context) {
        String langCode = getSavedLanguage(context);
        return applyLocale(context, langCode);
    }

    public static Context applyLocale(Context context, String langCode) {
        Locale locale = new Locale(langCode);
        Locale.setDefault(locale);

        Configuration config = new Configuration(context.getResources().getConfiguration());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            config.setLocales(new LocaleList(locale));
        } else {
            config.setLocale(locale);
        }
        return context.createConfigurationContext(config);
    }

    // ── Theme ──────────────────────────────────────────────────────────────

    public static final String THEME_DARK = "dark";
    public static final String THEME_LIGHT = "light";

    /** Save theme preference. */
    public static void saveTheme(Context context, String theme) {
        getPrefs(context).edit().putString(PREF_THEME, theme).apply();
    }

    /** Get saved theme, default "dark". */
    public static String getSavedTheme(Context context) {
        return getPrefs(context).getString(PREF_THEME, THEME_DARK);
    }

    /**
     * Apply the saved theme via AppCompatDelegate.
     * Call this early in Application.onCreate() or MainActivity.onCreate().
     */
    public static void applyTheme(Context context) {
        String theme = getSavedTheme(context);
        applyTheme(theme);
    }

    public static void applyTheme(String theme) {
        if (THEME_LIGHT.equals(theme)) {
            androidx.appcompat.app.AppCompatDelegate.setDefaultNightMode(
                    androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO);
        } else {
            androidx.appcompat.app.AppCompatDelegate.setDefaultNightMode(
                    androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES);
        }
    }

    // ── Internal ──────────────────────────────────────────────────────────

    private static SharedPreferences getPrefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }
}
