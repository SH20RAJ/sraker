"use client";

import { Task } from "../services/storageService";
import { formatInterval } from "../services/taskService";
import { Button } from "@/components/ui/button";

interface ArchivedTaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
}

export default function ArchivedTaskItem({ task, onDelete }: ArchivedTaskItemProps) {
  // Format the archived date
  const archivedDate = task.archivedAt 
    ? new Date(task.archivedAt).toLocaleDateString() 
    : '';

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <p className={`text-sm truncate ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"}`}>
            {task.text}
          </p>
          {task.recurring && (
            <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
              {formatInterval(task.recurring.interval)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {archivedDate}
          </span>
          <Button
            onClick={() => onDelete(task.id)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full p-2 h-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}