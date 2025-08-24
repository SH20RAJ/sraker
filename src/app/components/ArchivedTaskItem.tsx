"use client";

import { Task } from "../services/storageService";
import { formatInterval } from "../services/taskService";

interface ArchivedTaskItemProps {
  task: Task;
}

export default function ArchivedTaskItem({ task }: ArchivedTaskItemProps) {
  // Format the archived date
  const archivedDate = task.archivedAt 
    ? new Date(task.archivedAt).toLocaleDateString() 
    : '';

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <p className={`text-sm truncate ${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
            {task.text}
          </p>
          {task.recurring && (
            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {formatInterval(task.recurring.interval)}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
          {archivedDate}
        </span>
      </div>
    </div>
  );
}