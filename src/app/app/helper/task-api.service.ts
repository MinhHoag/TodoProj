// task-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private url = "https://685a19f09f6ef961115509c9.mockapi.io/tasks";

  constructor(private http: HttpClient) {}

  getList(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.url}/${id}`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.url, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${task.id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
