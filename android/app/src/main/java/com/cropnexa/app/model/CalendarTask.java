package com.cropnexa.app.model;

public class CalendarTask {
    private String date;
    private String title;
    private String description;

    public CalendarTask(String date, String title, String description) {
        this.date = date;
        this.title = title;
        this.description = description;
    }

    public String getDate() { return date; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
}
