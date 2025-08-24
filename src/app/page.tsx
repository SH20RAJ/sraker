"use client";

import { useState, useEffect } from "react";
import { Task, getActiveTasks, saveTasks } from "./services/storageService";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ArchivedTaskItem from "./components/ArchivedTaskItem";
import { useTheme } from "next-themes";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const activeTasks = getActiveTasks();
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const archived = allTasks.filter((task: Task) => task.archived);
    setTasks(activeTasks);
    setArchivedTasks(archived);
    
    // Set dark mode as default
    setTheme("dark");
  }, [setTheme]);

 // Save tasks to localStorage whenever active tasks change
  useEffect(() => {
    saveTasks([...tasks, ...archivedTasks]);
  }, [tasks, archivedTasks]);

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
    const taskToArchive = tasks.find(task => task.id === id);
    if (taskToArchive) {
      const updatedTask = {
        ...taskToArchive,
        archived: true,
        archivedAt: new Date().toISOString()
      };
      setTasks(tasks.filter(task => task.id !== id));
      setArchivedTasks([...archivedTasks, updatedTask]);
    }
  };

  const deleteArchivedTask = (id: number) => {
    setArchivedTasks(archivedTasks.filter(task => task.id !== id));
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Todo Voice</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>
            <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  Archive ({archivedTasks.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white">Archived Tasks</DialogTitle>
                </DialogHeader>
                {archivedTasks.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">No archived tasks yet.</p>
                ) : (
                  <div className="space-y-3">
                    {archivedTasks.map((task) => (
                      <ArchivedTaskItem 
                        key={task.id} 
                        task={task} 
                        onDelete={deleteArchivedTask} 
                      />
                    ))}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Task Form */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Task List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Your Tasks</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks yet. Add one above!</p>
              <div className="text-gray-400 dark:text-gray-500 text-sm">
                <p>✨ Tap the mic to speak your task</p>
                <p>✨ Set recurring tasks for daily habits</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
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
