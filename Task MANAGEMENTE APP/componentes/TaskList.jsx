import React from "react";
import TaskItem from "./TaskItem";
import "../TaskList.css";

function TaskList({ tasks, deleteTask, toggleTask, updateTask, reorderTasks }) {
  return (
    <div className="task-list">
      {tasks.length === 0 && (
        <p className="empty-state">No tasks here yet.</p>
      )}

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          updateTask={updateTask}
          reorderTasks={reorderTasks}
        />
      ))}
    </div>
  );
}

export default TaskList;
