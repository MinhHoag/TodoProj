import { Injectable } from '@angular/core';
import { Task } from './task.model';
import {
  forkJoin,
  Observable,
  of,
  Subject,
  switchMap,
  map
} from 'rxjs';
import { TaskApiService } from '../api/task-api.service';
import { ConfirmService } from '../../reuse-components/confirm-dialog/confirm.service';
import {
  batchDelete,
  batchDeleteCompleted,
  confirmAndRun,
  withDeleteLoading
} from './task.utils';
import { UserService } from '../mode(s)/user/user.service';
import { GuestModeService } from '../mode(s)/guest/guest-mode.service';
import {
  loadGuestTasks,
  saveGuestTasks,
  addGuestTask,
  removeGuestTask,
  updateGuestTask,
  clearGuestTasks,
  markGuestTasksAsPushed
} from '../mode(s)/guest/guest-task.store';
import {AuthService} from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private completedTasks: Task[] = [];

  constructor(
    private api: TaskApiService,
    private userService: UserService,
    private guestService: GuestModeService,
    private auth: AuthService,
  ) {}

  private isGuest(): boolean {
    return this.guestService.isGuest();
  }

  getTasks(): Observable<Task[]> {
    const userId = this.userService.getUserId?.() || this.auth.getUserId?.(); // fallback

    if (!userId || userId === 'guest') {
      console.warn('[TaskService] Skipping getTasks(): Invalid userId →', userId);
      return of([]);
    }

    return this.api.getListByUser(userId);
  }


  addTask(text: string): Observable<Task> {
    const userId = this.userService.getUserId?.() || this.auth.getUserId?.();
    const userName = this.userService.getUserName();
    const newTask: Task = {
      text: text.trim(),
      checked: false,
      createdAt: Date.now(),
      ...(this.isGuest() ? {} : { userId: userName })
    };

    if (this.isGuest()) {
      addGuestTask(newTask);
      return of(newTask);
    }

    const task: Task = { ...newTask, userId };
    return this.api.addTask(task);
  }

  removeTask(task: Task): Observable<void> {
    if (this.isGuest()) {
      removeGuestTask(task);
      return of(void 0);
    }

    const userId = this.userService.getUserId();

    if (!task.id || task.userId !== userId) {
      console.warn('[removeTask] Skipping invalid or foreign task:', task);
      return of(void 0);
    }

    return this.api.deleteTask(task.id, userId);
  }





  deleteWithLoading(
    task: Task,
    setLoading: (val: boolean) => void,
    setMessage: (msg: string) => void,
    message: string = 'Deleting task...'
  ): Observable<void> {
    if (this.isGuest()) {
      removeGuestTask(task);
      setLoading(false);
      setMessage('');
      return of(void 0);
    }

    return withDeleteLoading(
      this.removeTask(task),
      task,
      setLoading,
      setMessage,
      message
    );
  }

  updateTaskChecked(task: Task, checked: boolean): Observable<Task> {
    const updated = { ...task, checked };
    return this.isGuest()
      ? (updateGuestTask(updated), of(updated))
      : this.api.updateTask(updated);
  }

  updateTaskText(task: Task, newText: string): Observable<Task> {
    const updated = { ...task, text: newText };
    return this.isGuest()
      ? (updateGuestTask(updated), of(updated))
      : this.api.updateTask(updated);
  }

  clearAll(): Observable<void[]> {
    if (this.isGuest()) {
      clearGuestTasks();
      return of([]);
    }

    return this.getTasks().pipe(
      switchMap(tasks => forkJoin(tasks.map(task => this.removeTask(task))))
    );
  }

  clearAllCompleted(): void {
    this.completedTasks = [];
  }

  pushCompleted(): Observable<Task[]> {
    if (this.isGuest()) {
      return of(markGuestTasksAsPushed());
    }

    return this.getTasks().pipe(
      map(tasks => tasks.filter(t => t.checked && !t.pushed)),
      switchMap(completed =>
        forkJoin(completed.map(task =>
          this.api.updateTask({ ...task, pushed: true })
        ))
      )
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
    if (this.isGuest()) {
      const updated = tasks.map(t => ({
        ...t,
        checked: false,
        pushed: false
      }));
      updated.forEach(updateGuestTask);
      return of(updated);
    }

    return forkJoin(
      tasks.map(task =>
        this.api.updateTask({ ...task, checked: false, pushed: false })
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

  clearActiveWithConfirm(
    confirm: ConfirmService,
    onDelete?: () => void
  ): Observable<void | undefined> {
    if (this.isGuest()) {
      const activeTasks = loadGuestTasks().filter(t => !t.checked);
      activeTasks.forEach(removeGuestTask);
      onDelete?.();
      return of(void 0);
    }

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

  clearCompletedRecursively(
    onDelete?: () => void,
    cancelSignal?: Observable<any>
  ): Observable<void> {
    if (this.isGuest()) {
      const guestCompleted = loadGuestTasks().filter(t => t.checked);
      guestCompleted.forEach(removeGuestTask);
      onDelete?.();
      return of(void 0);
    }

    return batchDeleteCompleted(() => this.getTasks(), task => this.removeTask(task), onDelete, cancelSignal);
  }

  clearCompletedWithConfirm(
    confirm: ConfirmService,
    onDelete?: () => void
  ): Observable<void | undefined> {
    return confirmAndRun(confirm, 'Clear all completed tasks?', () =>
      this.clearCompletedRecursively(onDelete, this.cancelClearCompleted$)
    );
  }
}
