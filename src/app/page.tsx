"use client";

import { useState, useEffect, useRef } from "react";
import { Task, getActiveTasks, saveTasks } from "./services/storageService";
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
import { groupTasksByDate, formatDate } from "./utils/taskUtils";
import { Input } from "@/components/ui/input";
import { speechService } from "./services/speechService";
// Import the offline test
import { testOfflineSupport } from "./test-offline";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [newTask, setNewTask] = useState<string>("");
  const { theme, setTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const activeTasks = getActiveTasks();
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const archived = allTasks.filter((task: Task) => task.archived);
    setTasks(activeTasks);
    setArchivedTasks(archived);
    
    // Set dark mode as default
    setTheme("dark");
    
    // Test offline support
    testOfflineSupport();
  }, [setTheme]);

 // Save tasks to localStorage whenever active tasks change
  useEffect(() => {
    saveTasks([...tasks, ...archivedTasks]);
  }, [tasks, archivedTasks]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [tasks]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, task]);
      setNewTask("");
    }
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

  const handleSpeech = () => {
    if (speechService.getIsListening()) {
      // Stop listening
      speechService.stopRecognition();
    } else {
      // Start listening
      speechService.startRecognition(
        (text) => {
          setNewTask(text);
        },
        (error) => {
          console.error(error);
          alert(error);
        }
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
 };

  // Group tasks by date
  const groupedTasks = groupTasksByDate(tasks);

 return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b bg-card">
        <h1 className="text-xl font-bold">Todo Chat</h1>
        <div className="flex gap-2">
          <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full p-2 h-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
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
          <Button variant="ghost" size="sm" className="rounded-full p-2 h-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full p-2 h-auto"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">No tasks yet. Add one above!</p>
            <div className="text-muted-foreground/80 text-sm">
              <p>✨ Tap the mic to speak your task</p>
              <p>✨ Type and send to add tasks</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedTasks.map(({ date, tasks: dateTasks }) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground pl-1">
                  {formatDate(date)}
                </h3>
                <div className="space-y-3">
                  {dateTasks.map((task) => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask} 
                      onArchive={archiveTask} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-card">
        <div className="flex gap-2 max-w-md mx-auto">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a task..."
            className="flex-grow rounded-full px-4 py-3"
          />
          <Button
            onClick={handleSpeech}
            className={`rounded-full px-4 ${
              speechService.getIsListening() ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {speechService.getIsListening() ? "●" : "🎤"}
          </Button>
          <Button
            onClick={handleAddTask}
            className="rounded-full px-4 bg-primary hover:bg-primary/90"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
