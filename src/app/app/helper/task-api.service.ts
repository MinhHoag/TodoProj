import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class TaskApiService {

  url = "https://685a19f09f6ef961115509c9.mockapi.io";

  constructor(private http: HttpClient) {

  }

  getId(id: any): Observable<any> {
    const url = `${this.url}/tasks/${id}`;
    return this.http.get(url);
  }

  getList(): Observable<any> {
    const url = this.url + '/tasks';
    return this.http.get(url);
  }

  updateTask(task: any): Observable<any> {
    const url = `${this.url}/tasks/${task.id}`;
    return this.http.put(url, task);
  }
}
