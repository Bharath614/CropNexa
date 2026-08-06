package com.cropnexa.app.model;

public class Crop {
    private String id;
    private String name;
    private String category;
    private String waterRequirement;
    private String lightRequirement;
    private String emoji;

    public Crop(String id, String name, String category, String waterRequirement, String lightRequirement, String emoji) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.waterRequirement = waterRequirement;
        this.lightRequirement = lightRequirement;
        this.emoji = emoji;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getWaterRequirement() { return waterRequirement; }
    public String getLightRequirement() { return lightRequirement; }
    public String getEmoji() { return emoji; }
}
