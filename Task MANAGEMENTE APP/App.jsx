import React, { useState, useEffect } from "react";
import "./App.css";

import TaskForm from "./componentes/TaskForm";
import TaskList from "./componentes/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedTheme = localStorage.getItem("theme");

    if (Array.isArray(savedTasks)) {
      setTasks(savedTasks);
    }

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const addTask = ({ text, dueDate }) => {
    const newTask = {
      id: Date.now(),
      text,
      dueDate,
      completed: false,
    };

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const updateTask = (id, updates) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const reorderTasks = (draggedId, targetId) => {
    if (draggedId === targetId) return;

    const draggedIndex = tasks.findIndex((task) => task.id === draggedId);
    const targetIndex = tasks.findIndex((task) => task.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const nextTasks = [...tasks];
    const [draggedTask] = nextTasks.splice(draggedIndex, 1);
    nextTasks.splice(targetIndex, 0, draggedTask);
    setTasks(nextTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className={`app ${theme}`}>
      <div className="todo-container">
        <header className="app-header">
          <div>
            <p className="eyebrow">Next Level Tasks</p>
            <h1>Task Manager</h1>
          </div>

          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            type="button"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>

        <TaskForm addTask={addTask} />

        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
            type="button"
          >
            All
          </button>
          <button
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
            type="button"
          >
            Active
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
            type="button"
          >
            Done
          </button>
        </div>

        <div className="task-stats">
          <span>{tasks.length} total</span>
          <span>{completedCount} completed</span>
        </div>

        <TaskList
          tasks={filteredTasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          updateTask={updateTask}
          reorderTasks={reorderTasks}
        />
      </div>
    </div>
  );
}

export default App;
