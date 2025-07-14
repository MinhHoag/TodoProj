import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserRedirectGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userId = this.auth.getUserId() || 'guest';
    this.router.navigate(['/task-list', userId]);
    return false; // prevent activation, we’re redirecting manually
  }
}
