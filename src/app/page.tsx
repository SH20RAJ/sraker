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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto rounded-xl shadow-sm p-6 sm:p-8 bg-card text-card-foreground">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Todo Voice</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/200/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </Button>
            <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  Archive ({archivedTasks.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Archived Tasks</DialogTitle>
                </DialogHeader>
                {archivedTasks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No archived tasks yet.</p>
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
          <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No tasks yet. Add one above!</p>
              <div className="text-muted-foreground/80 text-sm">
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
