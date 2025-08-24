"use client";

import { Task } from "../services/storageService";
import { formatInterval } from "../services/taskService";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onArchive: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onArchive }: TaskItemProps) {
  return (
    <li
      key={task.id}
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg gap-2 ${
        task.completed ? "bg-green-50" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
        />
        <span
          className={
            task.completed ? "line-through text-gray-500" : ""
          }
        >
          {task.text}
          {task.recurring && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {formatInterval(task.recurring.interval)}
            </span>
          )}
        </span>
      </div>
      <button
        onClick={() => onArchive(task.id)}
        className="text-red-500 hover:text-red-700 text-sm whitespace-nowrap"
      >
        Archive
      </button>
    </li>
  );
}