export type TaskStatus = 'unassigned' | 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  dueDate?: Date;  // This already supports date and time
  createdAt: Date;
  updatedAt?: Date;
  tags: string[];
}
