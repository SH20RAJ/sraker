import { RecurringInterval } from "./taskService";

// Define the Task interface
export interface Task {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  recurring?: {
    interval: RecurringInterval;
    nextDate: string;
  };
  archived?: boolean;
  archivedAt?: string;
}

const STORAGE_KEY = 'tasks';

// Get tasks from localStorage
export const getTasks = (): Task[] => {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error reading tasks from localStorage:', error);
    return [];
  }
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// Add a new task
export const addTask = (task: Task): void => {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
};

// Update an existing task
export const updateTask = (updatedTask: Task): void => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    saveTasks(tasks);
  }
};

// Archive a task
export const archiveTask = (taskId: number): void => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === taskId);
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      archived: true,
      archivedAt: new Date().toISOString()
    };
    saveTasks(tasks);
  }
};

// Get archived tasks
export const getArchivedTasks = (): Task[] => {
  const tasks = getTasks();
  return tasks.filter(task => task.archived);
};

// Get active tasks
export const getActiveTasks = (): Task[] => {
  const tasks = getTasks();
  return tasks.filter(task => !task.archived);
};