// task.model.ts
export interface Task {
  id?: string;
  text: string;
  checked: boolean;
  createdAt: number;
  userId: string;
}

