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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const activeTasks = getActiveTasks();
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const archived = allTasks.filter((task: Task) => task.archived);
    setTasks(activeTasks);
    setArchivedTasks(archived);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Todo Voice</h1>
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
                <p className="text-gray-500 text-center py-4">No archived tasks yet.</p>
              ) : (
                <div className="space-y-3">
                  {archivedTasks.map((task) => (
                    <ArchivedTaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Task Form */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Task List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Your Tasks</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No tasks yet. Add one above!</p>
              <div className="text-gray-400 text-sm">
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
