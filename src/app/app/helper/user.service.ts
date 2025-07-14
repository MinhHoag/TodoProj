// user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userId$ = new BehaviorSubject<string>(''); // Default empty

  setUserId(id: string) {
    this.userId$.next(id);
  }

  isGuestUser(): boolean {
    return this.getUserId() === 'guest';
  }

  getUserId(): string {
    return this.userId$.getValue();
  }

  getUserId$() {
    return this.userId$.asObservable();
  }
}
