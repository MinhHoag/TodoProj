// task.utils.ts
import {Task} from './task.model';
import {ConfirmService} from '../reuse-components/confirm-dialog/confirm.service';
import {Observable, of, switchMap} from 'rxjs';

export function clearCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => !task.checked);
}

export function clearAllTasks(): Task[] {
  return [];
}

export function removeTask(tasks: Task[], taskToRemove: Task): Task[] {
  return tasks.filter(task => task !== taskToRemove);
}

export function addTask(tasks: Task[], newTaskText: string): Task[] {
  const trimmedText = newTaskText.trim();
  if (!trimmedText || tasks.some(task => task.text === trimmedText)) {
    return tasks;
  }

  const newTask: Task = { text: trimmedText, checked: false, createdAt: Date.now() };
  const index = tasks.findIndex(task => task.checked);
  const updatedTasks = [...tasks];

  if (index === -1) {
    updatedTasks.push(newTask);
  } else {
    updatedTasks.splice(index, 0, newTask);
  }

  return updatedTasks;
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.checked !== b.checked) {
      return Number(a.checked) - Number(b.checked);
    }
    return a.createdAt - b.createdAt;
  });
}
export function confirmAndRun<T extends unknown>(
  confirmService: ConfirmService,
  message: string,
  action: () => Observable<T>
): Observable<T | undefined> {
  return confirmService.open(message).pipe(
    switchMap(confirmed => confirmed ? action() : of(undefined))
  );
}
