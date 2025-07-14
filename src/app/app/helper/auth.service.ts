import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'todo-user-id';

  login(username: string) {
    localStorage.setItem(this.STORAGE_KEY, username);
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return this.getUserId() !== 'guest';
  }

  getUserId(): string {
    return localStorage.getItem(this.STORAGE_KEY) || 'guest';
  }
}
