"use client";

import { useState } from "react";
import { Task } from "../services/storageService";
import { formatInterval } from "../services/taskService";
import { Button } from "@/components/ui/button";
// Import Lucide React icons
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className="flex justify-between items-start p-4 rounded-lg border bgcard text-card-foreground">
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
          {displayText}
        </p>
        {shouldTruncate && (
          <Button 
            variant="link" 
            size="sm" 
            className="h-auto p-0 text-xs mt-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show more
              </>
            )}
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
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}