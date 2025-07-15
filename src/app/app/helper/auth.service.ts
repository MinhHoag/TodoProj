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

  getUserId(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.id || null; // return the numeric ID
  }

}
