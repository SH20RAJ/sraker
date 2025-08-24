"use client";

import { useState, useEffect } from "react";
import { Task, getTasks, saveTasks } from "./services/storageService";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = getTasks();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const archiveTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Todo Voice App</h1>
        
        {/* Task Form */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Task List */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onArchive={archiveTask} 
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
