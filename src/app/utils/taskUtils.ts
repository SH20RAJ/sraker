import { Task } from "../services/storageService";

// Group tasks by creation date
export const groupTasksByDate = (tasks: Task[]) => {
  const groups: { [key: string]: Task[] } = {};
  
  tasks.forEach(task => {
    // Use the creation date to group tasks
    const date = new Date(task.createdAt);
    const dateString = date.toDateString(); // This will group by day
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    
    groups[dateString].push(task);
  });
  
  // Convert to array and sort by date (newest first)
  const sortedGroups = Object.entries(groups)
    .map(([date, tasks]) => {
      // Sort tasks within each group: incomplete tasks first, then completed tasks
      const incompleteTasks = tasks.filter(task => !task.completed);
      const completedTasks = tasks.filter(task => task.completed);
      
      return {
        date,
        tasks: [...incompleteTasks, ...completedTasks]
      };
    })
    .sort((a, b) => {
      // Sort groups by date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
  return sortedGroups;
};

// Format date for display
export const formatDate = (dateString: string) => {
  const today = new Date();
  const date = new Date(dateString);
  
  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  // For other dates, return formatted date
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};