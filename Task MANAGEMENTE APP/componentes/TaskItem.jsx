import React, { useState } from "react";
import "../TaskItem.css";

function TaskItem({ task, deleteTask, toggleTask, updateTask, reorderTasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(task.text);
  const [draftDueDate, setDraftDueDate] = useState(task.dueDate || "");
  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  const handleSave = () => {
    if (!draftText.trim()) return;

    updateTask(task.id, {
      text: draftText.trim(),
      dueDate: draftDueDate,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftText(task.text);
    setDraftDueDate(task.dueDate || "");
    setIsEditing(false);
  };

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} ${isOverdue ? "overdue" : ""}`}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("taskId", String(task.id))}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => reorderTasks(Number(e.dataTransfer.getData("taskId")), task.id)}
    >
      {isEditing ? (
        <div className="edit-panel">
          <input
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            autoFocus
          />

          <input
            aria-label="Edit due date"
            type="date"
            value={draftDueDate}
            onChange={(e) => setDraftDueDate(e.target.value)}
          />

          <div className="task-actions">
            <button className="save-button" onClick={handleSave} type="button">
              Save
            </button>
            <button className="ghost-button" onClick={handleCancel} type="button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            className="check-button"
            onClick={() => toggleTask(task.id)}
            type="button"
            aria-label={task.completed ? "Mark as active" : "Mark as completed"}
          >
            {task.completed ? "✓" : ""}
          </button>

          <div className="task-content" onClick={() => toggleTask(task.id)}>
            <span>{task.text}</span>
            {task.dueDate && (
              <small>Due {new Date(task.dueDate).toLocaleDateString()}</small>
            )}
          </div>

          <div className="task-actions">
            <button className="ghost-button" onClick={() => setIsEditing(true)} type="button">
              Edit
            </button>
            <button className="delete-button" onClick={() => deleteTask(task.id)} type="button">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;
