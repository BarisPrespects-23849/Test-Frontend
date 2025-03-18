import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus } from '../types/Task';
import { mockTasks } from './mockData';

// In-memory tasks data (in a real app, this would be replaced with API calls)
let tasks: Task[] = [...mockTasks];

// Get all tasks
export const getTasks = (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...tasks]);
    }, 500);
  });
};

// Get task by ID
export const getTaskById = (taskId: string): Promise<Task | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = tasks.find(t => t.id === taskId) || null;
      resolve(task ? { ...task } : null);
    }, 500);
  });
};

// Create a new task
export const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTask: Task = {
        id: uuidv4(),
        ...taskData,
        createdAt: new Date()
      };
      tasks.push(newTask);
      resolve({ ...newTask });
    }, 500);
  });
};

// Update an existing task
export const updateTask = (taskId: string, updates: Partial<Task>): Promise<Task> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      // Ensure we preserve date objects and don't convert to strings
      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date()
      };
      
      // If updating dueDate, ensure it's a Date object
      if (updates.dueDate) {
        updatedTask.dueDate = new Date(updates.dueDate);
      }
      
      tasks[taskIndex] = updatedTask;
      resolve({ ...updatedTask });
    }, 500);
  });
};

// Delete a task
export const deleteTask = (taskId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== taskId);
      resolve(true);
    }, 500);
  });
};

// Filter tasks by status
export const getTasksByStatus = (status: TaskStatus): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredTasks = tasks.filter(t => t.status === status);
      resolve([...filteredTasks]);
    }, 500);
  });
};
