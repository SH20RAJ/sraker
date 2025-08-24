"use client";

import { useState } from "react";
import { Task } from "../services/storageService";
import { createTask, RecurringInterval } from "../services/taskService";
import { speechService } from "../services/speechService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
 SelectValue,
} from "@/components/ui/select";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [newTask, setNewTask] = useState<string>("");
  const [recurringInterval, setRecurringInterval] = useState<RecurringInterval | "none">("none");

 const addTask = () => {
    if (newTask.trim() !== "") {
      let recurringConfig;
      
      if (recurringInterval !== "none") {
        recurringConfig = { 
          interval: recurringInterval, 
          nextDate: new Date().toISOString() 
        };
      }
      
      const task = createTask(newTask, recurringConfig);
      onAddTask(task);
      setNewTask("");
      setRecurringInterval("none");
    }
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
      addTask();
    }
 };

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-3">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What do you need to do?"
          className="flex-grow rounded-md"
        />
        <Button
          onClick={handleSpeech}
          className={`rounded-md px-4 ${
            speechService.getIsListening() ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90"
          }`}
        >
          {speechService.getIsListening() ? "●" : "🎤"}
        </Button>
      </div>
      
      {/* Recurring Task Options */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Recurring:</span>
        <Select value={recurringInterval.toString()} onValueChange={(value) => setRecurringInterval(value === "none" ? "none" : value as RecurringInterval)}>
          <SelectTrigger className="w-[140px] rounded-md">
            <SelectValue placeholder="Not recurring" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Not recurring</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}