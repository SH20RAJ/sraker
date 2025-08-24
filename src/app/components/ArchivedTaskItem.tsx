"use client";

import { useState } from "react";
import { Task } from "../services/storageService";
import { formatInterval } from "../services/taskService";
import { Button } from "@/components/ui/button";

interface ArchivedTaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
}

export default function ArchivedTaskItem({ task, onDelete }: ArchivedTaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the archived date
 const archivedDate = task.archivedAt 
    ? new Date(task.archivedAt).toLocaleDateString() 
    : '';
  
  // Truncate text if it's too long
  const shouldTruncate = task.text.length > 100;
  const displayText = isExpanded || !shouldTruncate ? task.text : task.text.substring(0, 100) + "...";

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground">
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {displayText}
          </p>
          {shouldTruncate && (
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}
          {task.recurring && (
            <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {formatInterval(task.recurring.interval)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {archivedDate}
          </span>
          <Button
            onClick={() => onDelete(task.id)}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full p-2 h-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}