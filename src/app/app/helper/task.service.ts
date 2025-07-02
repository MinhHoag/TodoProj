// task.service.ts
import { Injectable } from '@angular/core';
import { Task } from './task.model';
import {
  catchError,
  concatMap,
  delay,
  EMPTY,
  expand,
  forkJoin,
  from, last,
  map,
  mergeMap,
  Observable,
  of, retry, Subject,
  switchMap, takeUntil, takeWhile,
  tap,
  toArray
} from 'rxjs';
import {TaskApiService} from './task-api.service';
import {ConfirmService} from '../reuse-components/confirm-dialog/confirm.service';
import {confirmAndRun} from './task.utils';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private completedTasks: Task[] = [];

  constructor(private api: TaskApiService) {
  }


  getTasks(): Observable<Task[]> {
    return this.api.getList();
  }

  addTask(text: string): Observable<Task> {
    const newTask: Task = {
      text: text.trim(),
      checked: false,
      createdAt: Date.now()
    };
    return this.api.addTask(newTask);
  }

  removeTask(task: Task): Observable<void> {
    return this.api.deleteTask(task.id);
  }


  updateTaskChecked(task: Task, checked: boolean): Observable<Task> {
    return this.api.updateTask({ ...task, checked });
  }


  clearAllCompleted(): void {
    this.completedTasks = [];
  }

  updateTaskText(task: Task, newText: string): Observable<Task> {
    return this.api.updateTask({ ...task, text: newText });
  }
  clearAll(): Observable<void[]> {
    return this.getTasks().pipe(
      switchMap(tasks => forkJoin(tasks.map(task => this.removeTask(task))))
    );
  }

  clearCompleted(): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(t => t.checked && !this.hasBeenPushed(t))),
      tap(completed => {
        this.completedTasks.push(...completed); // ✅ mark as pushed
      }),
      switchMap(completed =>
        forkJoin(completed.map(task => this.updateTaskChecked(task, true)))
      )
    );
  }



  private cancelClearSubject = new Subject<void>();

  get cancelClear$(): Observable<void> {
    return this.cancelClearSubject.asObservable();
  }

  cancelClear(): void {
    this.cancelClearSubject.next();
  }


  clearActive(onDelete?: () => void, cancelSignal?: Observable<any>): Observable<void> {
    const batchSize = 3;

    return this.getTasks().pipe(
      map(tasks => tasks.filter(t => !t.checked)),
      switchMap(allActive => {
        if (allActive.length === 0) return of(void 0);

        let remaining = [...allActive];

        const deleteBatch = (): Observable<void> => {
          if (remaining.length === 0) return of(void 0);

          const batch = remaining.splice(0, batchSize);

          return from(batch).pipe(
            concatMap(task =>
              this.removeTask(task).pipe(
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

        // 👇 This takeUntil must wrap the entire deleteBatch stream!
        return deleteBatch().pipe(takeUntil(cancelSignal ?? EMPTY));
      })
    );
  }



  clearActiveWithConfirm(confirm: ConfirmService, onDelete?: () => void, p0?: () => boolean): Observable<void | undefined> {
    return confirmAndRun(confirm, 'Are you sure you want to clear all active tasks?', () =>
      this.clearActive(onDelete, this.cancelClear$)
    );
  }




  cancelClearCompleted$ = new Subject<void>();

  cancelClearCompleted(): void {
    this.cancelClearCompleted$.next();
    this.cancelClearCompleted$.complete();
    this.cancelClearCompleted$ = new Subject<void>();
  }


  clearCompletedRecursively(onDelete?: () => void, cancelSignal?: Observable<any>): Observable<void> {
    const batchSize = 3;

    return this.getTasks().pipe(
      map(tasks => tasks.filter(t => t.checked)),
      switchMap(completedTasks => {
        if (completedTasks.length === 0) return of(void 0);

        let remaining = [...completedTasks];

        const deleteBatch = (): Observable<void> => {
          if (remaining.length === 0) return of(void 0);

          const batch = remaining.splice(0, batchSize);

          return from(batch).pipe(
            concatMap(task =>
              this.removeTask(task).pipe(
                retry(3),
                tap(() => {
                  onDelete?.();
                  console.log(`Deleted (completed): ${task.text}`);
                }),
                catchError(err => {
                  console.warn(`Failed to delete (completed): ${task.text}`, err);
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


  clearCompletedWithConfirm(confirm: ConfirmService, onDelete?: () => void): Observable<void | undefined> {
    return confirmAndRun(confirm, 'Clear all completed tasks?', () =>
      this.clearCompletedRecursively(onDelete, this.cancelClearCompleted$)
    );
  }







  getCompletedTasks(): Task[] {
    return [...this.completedTasks];
  }

  hasBeenPushed(task: Task): boolean {
    return this.completedTasks.some(t => t.id === task.id);
  }



  removeCompletedTask(task: Task): void {
    this.completedTasks = this.completedTasks.filter(t => t.id !== task.id);
  }



  reinsertFromCompleted(tasks: Task[]): Observable<Task[]> {
    return forkJoin(
      tasks.map(task =>
        this.updateTaskChecked(task, false)
      )
    );
  }

  generateSampleTasks(): Observable<any[]> {
    const tasks: Task[] = [];

    for (let i = 1; i <= 20; i++) {
      tasks.push({
        text: `Task ${tasks.length + 1}`,
        checked: false,
        createdAt: Date.now() + i,
      });
    }

    return forkJoin(tasks.map(task => this.api.addTask(task)));
  }












}

