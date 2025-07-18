// user-api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface User {
  id?: string;
  name: string;
  password: string;
  createdAt?: number;
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private apiUrl = 'https://685a19f09f6ef961115509c9.mockapi.io/user';

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User) {
    return this.http.post<User>(this.apiUrl, user);
  }

  setActiveStatus(id: string, active: boolean) {
    return this.http.put<User>(`${this.apiUrl}/${id}`, { active });
  }
}
