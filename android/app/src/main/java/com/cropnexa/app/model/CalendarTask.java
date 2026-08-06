package com.cropnexa.app.model;

public class CalendarTask {
    private String id;
    private String task;
    private String category;
    private String date;
    private boolean completed;
    private String priority;

    public CalendarTask() {} // Needed for Firebase

    public CalendarTask(String id, String task, String category, String date, boolean completed, String priority) {
        this.id = id;
        this.task = task;
        this.category = category;
        this.date = date;
        this.completed = completed;
        this.priority = priority;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
