package com.cropnexa.app.model;

public class SoilNutrient {
    private String name;
    private String symbol;
    private String measured;
    private String ideal;
    private String unit;
    private String statusLabel;
    private String statusColorHex;
    private int progressPct;

    public SoilNutrient(String name, String symbol, String measured, String ideal, String unit, String statusLabel, String statusColorHex, int progressPct) {
        this.name = name;
        this.symbol = symbol;
        this.measured = measured;
        this.ideal = ideal;
        this.unit = unit;
        this.statusLabel = statusLabel;
        this.statusColorHex = statusColorHex;
        this.progressPct = progressPct;
    }

    public String getName() { return name; }
    public String getSymbol() { return symbol; }
    public String getMeasured() { return measured; }
    public String getIdeal() { return ideal; }
    public String getUnit() { return unit; }
    public String getStatusLabel() { return statusLabel; }
    public String getStatusColorHex() { return statusColorHex; }
    public int getProgressPct() { return progressPct; }
}
