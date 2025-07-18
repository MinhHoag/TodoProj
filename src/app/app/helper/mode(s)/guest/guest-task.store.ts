// guest-task.store.ts
import { Task } from '../../tasks/task.model';

let guestTasks: Task[] = [];

export function loadGuestTasks(): Task[] {
  return guestTasks;
}

export function saveGuestTasks(tasks: Task[]): void {
  guestTasks = [...tasks];
}

export function addGuestTask(task: Task): Task {
  guestTasks.push(task);
  return task;
}

export function updateGuestTask(task: Task): Task {
  guestTasks = guestTasks.map(t => t.createdAt === task.createdAt ? task : t);
  return task;
}

export function removeGuestTask(task: Task): void {
  guestTasks = guestTasks.filter(t => t.createdAt !== task.createdAt);
}

export function clearGuestTasks(): void {
  guestTasks = [];
}

export function markGuestTasksAsPushed(): Task[] {
  guestTasks = guestTasks.map(t =>
    t.checked && !t.pushed ? { ...t, pushed: true } : t
  );
  return guestTasks.filter(t => t.pushed);
}
