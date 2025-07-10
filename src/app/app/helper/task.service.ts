// task.service.ts
import {Injectable} from '@angular/core';
import {Task} from './task.model';
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
import {
  batchDelete,
  batchDeleteCompleted,
  bulkDelete,
  confirmAndRun,
  bulkDeleteCompleted,
  withDeleteLoading
} from './task.utils';

@Injectable({providedIn: 'root'})
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

  deleteWithLoading(
    task: Task,
    setLoading: (val: boolean) => void,
    setMessage: (msg: string) => void,
    message: string = 'Deleting task...'
  ): Observable<void> {
    return withDeleteLoading(
      this.removeTask(task),
      task,
      setLoading,
      setMessage,
      message
    );
  }

  updateTaskChecked(task: Task, checked: boolean): Observable<Task> {
    return this.api.updateTask({...task, checked});
  }


  clearAllCompleted(): void {
    this.completedTasks = [];
  }

  updateTaskText(task: Task, newText: string): Observable<Task> {
    return this.api.updateTask({...task, text: newText});
  }

  clearAll(): Observable<void[]> {
    return this.getTasks().pipe(
      switchMap(tasks => forkJoin(tasks.map(task => this.removeTask(task))))
    );
  }

  pushCompleted(): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(t => t.checked && !t.pushed)),
      switchMap(completed =>
        forkJoin(completed.map(task =>
          this.api.updateTask({ ...task, pushed: true })
        ))
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



  clearActiveWithConfirm(confirm: ConfirmService, onDelete?: () => void): Observable<void | undefined> {
    return confirmAndRun(confirm, 'Are you sure you want to clear all active tasks?', () =>
      batchDelete(() => this.getTasks(), task => this.removeTask(task), t => !t.checked, onDelete, this.cancelClear$)
    );
  }


  cancelClearCompleted$ = new Subject<void>();

  cancelClearCompleted(): void {
    this.cancelClearCompleted$.next();
    this.cancelClearCompleted$.complete();
    this.cancelClearCompleted$ = new Subject<void>();
  }


  clearCompletedRecursively(onDelete?: () => void, cancelSignal?: Observable<any>): Observable<void> {
    return batchDeleteCompleted(() => this.getTasks(), task => this.removeTask(task), onDelete, cancelSignal);
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
        this.api.updateTask({ ...task, checked: false, pushed: false })
      )
    );
  }


  generateSampleTasks(): Observable<any[]> {
    const tasks: Task[] = [];

    for (let i = 1; i <= 20; i++) {
      tasks.push({
        text: `Task ${tasks.length + 1}`,
        checked: false,
        createdAt: Math.floor(Date.now() / 1000),
      });
    }

    return forkJoin(tasks.map(task => this.api.addTask(task)));
  }


}

