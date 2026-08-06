package com.cropnexa.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.LocaleList;
import androidx.appcompat.app.AppCompatDelegate;

import java.util.Locale;

/**
 * Helper class to apply locale (language) and theme changes app-wide.
 */
public class LocaleHelper {

    private static final String PREFS_NAME = "CropNexaPrefs";
    private static final String PREF_LANGUAGE = "pref_language";
    private static final String PREF_THEME = "pref_theme";

    public static final String THEME_DARK = "dark";
    public static final String THEME_LIGHT = "light";

    // ── Language ───────────────────────────────────────────────────────────

    public static void saveLanguage(Context context, String langCode) {
        getPrefs(context).edit().putString(PREF_LANGUAGE, langCode).apply();
    }

    public static String getSavedLanguage(Context context) {
        return getPrefs(context).getString(PREF_LANGUAGE, "en");
    }

    public static Context applyLocale(Context context) {
        String langCode = getSavedLanguage(context);
        return applyLocale(context, langCode);
    }

    public static Context applyLocale(Context context, String langCode) {
        Locale locale = new Locale(langCode);
        Locale.setDefault(locale);

        Resources res = context.getResources();
        Configuration config = new Configuration(res.getConfiguration());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            config.setLocales(new LocaleList(locale));
        } else {
            config.setLocale(locale);
        }

        // Apply to Resources as well for legacy/fragment compatibility
        res.updateConfiguration(config, res.getDisplayMetrics());

        return context.createConfigurationContext(config);
    }

    // ── Theme ──────────────────────────────────────────────────────────────

    public static void saveTheme(Context context, String theme) {
        getPrefs(context).edit().putString(PREF_THEME, theme).apply();
    }

    public static String getSavedTheme(Context context) {
        return getPrefs(context).getString(PREF_THEME, THEME_DARK);
    }

    public static void applyTheme(Context context) {
        String theme = getSavedTheme(context);
        applyTheme(theme);
    }

    public static void applyTheme(String theme) {
        if (THEME_LIGHT.equalsIgnoreCase(theme)) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        }
    }

    private static SharedPreferences getPrefs(Context context) {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }
}
