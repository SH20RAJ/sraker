"use client";

import { Task } from "../services/storageService";
import { formatInterval } from "../services/taskService";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onArchive: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onArchive }: TaskItemProps) {
  return (
    <div
      key={task.id}
      className={`flex items-center justify-between p-4 rounded-xl gap-3 transition-all duration-200 ${
        task.completed ? "bg-green-50 border border-green-100" : "bg-gray-50 border border-gray-100"
      }`}
    >
      <div className="flex items-center flex-1 min-w-0">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="h-5 w-5 rounded-full border-gray-300 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
        />
        <div className="ml-3 min-w-0 flex-1">
          <p
            className={`text-sm truncate ${
              task.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {task.text}
          </p>
          {task.recurring && (
            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {formatInterval(task.recurring.interval)}
            </span>
          )}
        </div>
      </div>
      <Button
        onClick={() => onArchive(task.id)}
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 h-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      </Button>
    </div>
  );
}