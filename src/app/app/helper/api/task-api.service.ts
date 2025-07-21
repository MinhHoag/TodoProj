// task-api.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from '../tasks/task.model';
import {GuestModeService} from '../mode(s)/guest/guest-mode.service';
import {UserService} from '../mode(s)/user/user.service';

@Injectable({providedIn: 'root'})
export class TaskApiService {
  private baseUrl = 'https://685a19f09f6ef961115509c9.mockapi.io';

  constructor(private http: HttpClient, private guest: GuestModeService, private userService: UserService) {
  }

  getListByUser(userId: string): Observable<Task[]> {
    this.blockIfGuest();
    return this.http.get<Task[]>(`${this.baseUrl}/user/${userId}/tasks`);
  }

  addTask(task: Task): Observable<Task> {
    this.blockIfGuest();

    const routeId = this.userService.getUserId();
    return this.http.post<Task>(`${this.baseUrl}/user/${routeId}/tasks`, task);
  }

  updateTask(task: Task): Observable<Task> {
    this.blockIfGuest();

    const routeId = this.userService.getUserId();
    return this.http.put<Task>(
      `${this.baseUrl}/user/${routeId}/tasks/${task.id}`,
      task
    );
  }

  deleteTask(taskId: string, userId: string): Observable<void> {
    this.blockIfGuest();
    return this.http.delete<void>(`${this.baseUrl}/user/${userId}/tasks/${taskId}`);
  }

  private blockIfGuest(): void {
    if (this.guest.isGuest()) {
      throw new Error('Guest mode is active');
    }
  }
}





