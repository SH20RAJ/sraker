"use client";

import { useState } from "react";
import { Task } from "../services/storageService";
import { createTask, RecurringInterval } from "../services/taskService";
import { speechService } from "../services/speechService";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [newTask, setNewTask] = useState<string>("");
  const [recurringType, setRecurringType] = useState<"none" | "preset" | "custom">("none");
  const [recurringInterval, setRecurringInterval] = useState<RecurringInterval>("daily");
  const [customInterval, setCustomInterval] = useState<number>(1);

 const addTask = () => {
    if (newTask.trim() !== "") {
      let recurringConfig;
      
      if (recurringType !== "none") {
        const interval = recurringType === "custom" ? customInterval : recurringInterval;
        recurringConfig = { 
          interval, 
          nextDate: new Date().toISOString() 
        };
      }
      
      const task = createTask(newTask, recurringConfig);
      onAddTask(task);
      setNewTask("");
      setRecurringType("none");
      setRecurringInterval("daily");
      setCustomInterval(1);
    }
  };

  const handleSpeech = () => {
    if (!speechService.getIsListening()) {
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
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What do you need to do?"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSpeech}
          className={`px-4 py-2 ${
            speechService.getIsListening() ? "bg-red-500" : "bg-blue-500"
          } text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap`}
        >
          {speechService.getIsListening() ? "Listening..." : "Mic"}
        </button>
      </div>
      
      {/* Recurring Task Options */}
      <div className="mt-2">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">Recurring:</span>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="recurring"
                checked={recurringType === "none"}
                onChange={() => setRecurringType("none")}
                className="mr-1"
              />
              <span className="text-sm">None</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="recurring"
                checked={recurringType === "preset"}
                onChange={() => setRecurringType("preset")}
                className="mr-1"
              />
              <span className="text-sm">Preset</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="recurring"
                checked={recurringType === "custom"}
                onChange={() => setRecurringType("custom")}
                className="mr-1"
              />
              <span className="text-sm">Custom</span>
            </label>
          </div>
        </div>
        
        {recurringType === "preset" && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Interval:</span>
            <select
              value={recurringInterval}
              onChange={(e) => setRecurringInterval(e.target.value as RecurringInterval)}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
        
        {recurringType === "custom" && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Every:</span>
            <input
              type="number"
              min="1"
              value={customInterval}
              onChange={(e) => setCustomInterval(Number(e.target.value))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">days</span>
          </div>
        )}
      </div>
    </div>
  );
}