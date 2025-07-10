// task.utils.ts
import { Task } from './task.model';
import { ConfirmService } from '../reuse-components/confirm-dialog/confirm.service';
import {
  catchError,
  concatMap,
  delay,
  EMPTY, finalize,
  forkJoin,
  from,
  map,
  Observable,
  of,
  retry,
  switchMap,
  takeUntil,
  tap,
  toArray
} from 'rxjs';
import { TaskApiService } from './task-api.service';

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

export function batchDelete(
  getTasks: () => Observable<Task[]>,
  deleteTask: (task: Task) => Observable<any>,
  filterFn: (task: Task) => boolean,
  onDelete?: () => void,
  cancelSignal?: Observable<any>,
  batchSize = 3
): Observable<void> {
  return getTasks().pipe(
    map(tasks => tasks.filter(filterFn)),
    switchMap(filteredTasks => {
      if (filteredTasks.length === 0) return of(void 0);

      let remaining = [...filteredTasks];

      const deleteBatch = (): Observable<void> => {
        if (remaining.length === 0) return of(void 0);

        const batch = remaining.splice(0, batchSize);

        return from(batch).pipe(
          concatMap(task =>
            deleteTask(task).pipe(
              retry(3),
              tap(() => {
                onDelete?.();
                console.log(`Deleted: ${task.text}`);
              }),
              catchError(err => {
                console.warn(`Failed to delete: ${task.text}`, err);
                return of(void 0);
              })
            )
          ),
          toArray(),
          delay(300),
          switchMap(() => deleteBatch())
        );
      };

      return deleteBatch().pipe(takeUntil(cancelSignal ?? EMPTY));
    })
  );
}

export function bulkDelete(
  getTasks: () => Observable<Task[]>,
  deleteTask: (task: Task) => Observable<any>,
  filterFn: (task: Task) => boolean,
  onDelete?: () => void,
  cancelSignal?: Observable<any>
): Observable<void> | any {
  return getTasks().pipe(
    map(tasks => tasks.filter(filterFn)),
    switchMap(filteredTasks => {
      const deleteRequests = filteredTasks.map(task =>
        deleteTask(task).pipe(
          retry(3),
          tap(() => onDelete?.()),
          catchError(err => {
            console.warn(`Failed to delete: ${task.text}`, err);
            return of(0);
          })
        )
      );

      const deleteStream = forkJoin(deleteRequests).pipe();

      return cancelSignal ? deleteStream.pipe(takeUntil(cancelSignal)) : deleteStream;
    })
  );
}
export function batchDeleteCompleted(
  getTasks: () => Observable<Task[]>,
  deleteTask: (task: Task) => Observable<any>,
  onDelete?: () => void,
  cancelSignal?: Observable<any>,
  batchSize = 3
): Observable<void> {
  return batchDelete(getTasks, deleteTask, t => t.checked, onDelete, cancelSignal, batchSize);
}
export function bulkDeleteCompleted(
  getTasks: () => Observable<Task[]>,
  deleteTask: (task: Task) => Observable<any>,
  onDelete?: () => void,
  cancelSignal?: Observable<any>
): Observable<void> {
  return bulkDelete(getTasks, deleteTask, t => t.checked, onDelete, cancelSignal);
}

export function withDeleteLoading<T>(
  task$: Observable<T>,
  task: Task,
  setLoading: (val: boolean) => void,
  setMessage: (msg: string) => void,
  message: string = 'Deleting task...'
): Observable<T> {
  setLoading(true);
  setMessage(message);

  return task$.pipe(
    tap(() => console.log(`Deleted: ${task.text}`)),
    catchError(err => {
      console.error(`Failed to delete task: ${task.text}`, err);
      setMessage('Delete failed!');
      return of(void 0 as T);
    }),
    finalize(() => {
      setLoading(false);
      setMessage('');
    })
  );
}
