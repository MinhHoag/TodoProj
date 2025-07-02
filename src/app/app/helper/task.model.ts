// task.model.ts
export interface Task {
  id?: string;
  text: string;
  checked: boolean;
  pushed?: boolean; // ✅ this represents "pushed to completed list"
  createdAt: number;
}

