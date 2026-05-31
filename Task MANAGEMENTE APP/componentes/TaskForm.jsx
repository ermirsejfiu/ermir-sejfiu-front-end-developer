import React, { useState } from "react";
import "../TaskForm.css";

function TaskForm({ addTask }) {
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    addTask({ text: input.trim(), dueDate });
    setInput("");
    setDueDate("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <input
        aria-label="Due date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
}

export default TaskForm;
