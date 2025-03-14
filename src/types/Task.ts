export type TaskStatus = 'unassigned' | 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  tags: string[];
}
