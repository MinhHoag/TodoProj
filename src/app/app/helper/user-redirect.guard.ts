// user-redirect.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserRedirectGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const userId = this.userService.getUserId() || 'guest';
    console.log('Redirecting to:', `/task-list/${userId}`);
    await this.router.navigate([`/task-list/${userId}`]);
    return false; // ✅ navigation succeeds, but cancel this one
  }

}
