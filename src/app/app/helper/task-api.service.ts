// task-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import { Task } from './task.model';
import {GuestModeService} from './guest-mode.service';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private url = "https://685a19f09f6ef961115509c9.mockapi.io/tasks";
  constructor(private http: HttpClient, private guest: GuestModeService) {}

  private blockIfGuest(): void {
    const isGuest = this.guest.isGuest();
    console.log('[blockIfGuest] guestMode =', isGuest);
    if (isGuest) {
      throw new Error('Guest mode is active — API usage is blocked.');
    }
  }

  getListByUser(userId: string): Observable<Task[]> {
    this.blockIfGuest();
    return this.http.get<Task[]>(`${this.url}?userId=${userId}`);
  }

  addTask(task: Task): Observable<Task> {
    this.blockIfGuest();
    return this.http.post<Task>(this.url, task);
  }

  updateTask(task: Task): Observable<Task> {
    this.blockIfGuest();
    return this.http.put<Task>(`${this.url}/${task.id}`, task);
  }

  deleteTask(id: string | undefined): Observable<void> {
    this.blockIfGuest();
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

