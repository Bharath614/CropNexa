package com.cropnexa.app.ui.dashboard;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.cropnexa.app.R;
import com.cropnexa.app.model.CalendarTask;

import java.util.List;

public class CalendarAdapter extends RecyclerView.Adapter<CalendarAdapter.TaskViewHolder> {

    private final List<CalendarTask> taskList;

    public CalendarAdapter(List<CalendarTask> taskList) {
        this.taskList = taskList;
    }

    @NonNull
    @Override
    public TaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_calendar_task, parent, false);
        return new TaskViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TaskViewHolder holder, int position) {
        CalendarTask task = taskList.get(position);
        holder.tvTaskDate.setText("Scheduled: " + task.getDate());
        holder.tvTaskTitle.setText(task.getTask());
        holder.tvTaskCategory.setText(task.getCategory());
        if (holder.tvTaskPriority != null) {
            holder.tvTaskPriority.setText(task.getPriority());
        }
    }

    @Override
    public int getItemCount() {
        return taskList.size();
    }

    static class TaskViewHolder extends RecyclerView.ViewHolder {
        TextView tvTaskDate;
        TextView tvTaskTitle;
        TextView tvTaskCategory;
        TextView tvTaskPriority;

        public TaskViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTaskDate = itemView.findViewById(R.id.tvTaskDate);
            tvTaskTitle = itemView.findViewById(R.id.tvTaskTitle);
            tvTaskCategory = itemView.findViewById(R.id.tvTaskCategory);
            tvTaskPriority = itemView.findViewById(R.id.tvTaskPriority);
        }
    }
}
