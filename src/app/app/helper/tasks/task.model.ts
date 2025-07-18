// task.model.ts
export interface Task {
  id?: string;
  text: string;
  checked: boolean;
  pushed?: boolean;
  createdAt: number;
  userId?: string;
}

