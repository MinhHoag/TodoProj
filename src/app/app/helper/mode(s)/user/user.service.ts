import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService {
  private userId$ = new BehaviorSubject<string>('');
  private userName$ = new BehaviorSubject<string>('');

  setUser(user: { id: string; name: string }) {
    this.userId$.next(user.id);
    this.userName$.next(user.name);
  }

  resetUser(): void {
    console.log('Logging out');
    this.userId$.next('');
    this.userName$.next('');
  }

  getUserName(): string {
    return this.userName$.getValue();
  }

  getUserId(): string {
    return this.userId$.getValue();
  }

  getUserId$() {
    return this.userId$.asObservable();
  }

  getUserIdByName(name: string): string {
    if (this.userName$.getValue() === name) {
      return this.userId$.getValue();
    }
    return name;
  }

  setUserId(id: string) {
    this.userId$.next(id);
  }

  getUserName$() {
    return this.userName$.asObservable();
  }

  isGuestUser(): boolean {
    return this.getUserId() === 'guest';
  }
}
