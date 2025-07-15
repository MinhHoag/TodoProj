import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userId$ = new BehaviorSubject<string>('');   // Numeric ID for API routing
  private userName$ = new BehaviorSubject<string>(''); // Username for task tagging

  setUser(user: { id: string; name: string }) {
    this.userId$.next(user.id);
    this.userName$.next(user.name);
  }
  getUserIdByName(name: string): string {
    // if current user matches, return the stored id
    if (this.userName$.getValue() === name) {
      return this.userId$.getValue(); // real MockAPI ID
    }
    return name; // fallback
  }


  setUserId(id: string) {
    this.userId$.next(id);
  }

  getUserId(): string {
    return this.userId$.getValue();
  }

  getUserId$() {
    return this.userId$.asObservable();
  }

  getUserName(): string {
    return this.userName$.getValue();
  }

  getUserName$() {
    return this.userName$.asObservable();
  }

  isGuestUser(): boolean {
    return this.getUserId() === 'guest';
  }
}
