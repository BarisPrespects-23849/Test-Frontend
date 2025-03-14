import { Task, TaskStatus } from '../types/Task';
import { mockTasks } from './mockData';
import { v4 as uuidv4 } from 'uuid';

// Initial tasks from mock data
let tasks = [...mockTasks];

export const getTasks = (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...tasks]);
    }, 500);
  });
};

export const getTasksByStatus = (status: TaskStatus): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tasks.filter(task => task.status === status));
    }, 500);
  });
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  return new Promise((resolve) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date()
    };
    tasks = [...tasks, newTask];
    setTimeout(() => {
      resolve(newTask);
    }, 500);
  });
};

export const updateTask = (taskId: string, updates: Partial<Task>): Promise<Task> => {
  return new Promise((resolve, reject) => {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      reject(new Error('Task not found'));
      return;
    }
    
    const updatedTask = { ...tasks[taskIndex], ...updates, updatedAt: new Date() };
    tasks = [...tasks.slice(0, taskIndex), updatedTask, ...tasks.slice(taskIndex + 1)];
    
    setTimeout(() => {
      resolve(updatedTask);
    }, 500);
  });
};

export const deleteTask = (taskId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    tasks = tasks.filter(task => task.id !== taskId);
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
