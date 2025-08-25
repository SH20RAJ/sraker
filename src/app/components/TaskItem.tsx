"use client";

import { useState } from "react";
import { Task } from "../services/storageService";
import { formatInterval } from "../services/taskService";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
// Import Lucide React icons
import { Archive, ChevronDown, ChevronUp } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onArchive: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onArchive }: TaskItemProps) {
 const [isExpanded, setIsExpanded] = useState(false);
  
  // Truncate text if it's too long
  const shouldTruncate = task.text.length > 100;
  const displayText = isExpanded || !shouldTruncate ? task.text : task.text.substring(0, 100) + "...";

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bgcard text-card-foreground">
      <div className="flex items-start flex-1 min-w-0">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 mr-3 h-5 w-5"
        />
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
      </div>
      <Button
        onClick={() => onArchive(task.id)}
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full p-2 h-auto ml-2"
      >
        <Archive className="h-4 w-4" />
      </Button>
    </div>
  );
}