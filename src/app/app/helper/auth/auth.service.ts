import {Injectable} from '@angular/core';
import {UserService} from '../mode(s)/user/user.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly STORAGE_KEY = 'user';
  private user: { id: string; name: string } | null = null;

  constructor(private userService: UserService) {
    this.loadFromStorage();
  }

  login(user: { id: string; name: string }): void {
    this.user = user;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.userService.setUser(user);
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem(this.STORAGE_KEY);
    this.userService.resetUser();
  }

  getUserId(): string {
    return this.user?.id ?? 'guest';
  }

  getUsername(): string {
    return this.user?.name ?? 'guest';
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.user = stored ? JSON.parse(stored) : null;
    if (this.user) {
      this.userService.setUser(this.user);
    }
  }

  isLoggedIn(): boolean {
    return this.getUserId() !== 'guest';
  }
  getCurrentUser(): { id: string; name: string } | null {
    if (!this.user) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.user = stored ? JSON.parse(stored) : null;
    }
    return this.user;
  }


}
