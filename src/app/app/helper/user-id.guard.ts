import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { UserService } from './user.service';
import { GuestModeService } from './guest-mode.service';

@Injectable({ providedIn: 'root' })
export class UserIdGuard implements CanActivate {
  constructor(private userService: UserService, private guestService: GuestModeService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userId = route.paramMap.get('userId');
    const isGuest = userId === 'guest';

    if (userId) {
      this.userService.setUserId(userId);
      this.guestService.setGuestMode(isGuest);
      console.log('[Guard] Set userId:', userId, '| guestMode:', isGuest);
    } else {
      console.warn('[Guard] No userId found!');
    }

    return true; // always allow
  }
}
