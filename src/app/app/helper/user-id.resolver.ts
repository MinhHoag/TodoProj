// user-id.resolver.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UserService } from './user.service';
import {GuestModeService} from './guest-mode.service';

@Injectable({ providedIn: 'root' })
export class UserIdResolver implements Resolve<void> {
  constructor(private userService: UserService, private guestService: GuestModeService) {}


  resolve(route: ActivatedRouteSnapshot): void {
    const userId = route.paramMap.get('userId');
    const isGuest = route.routeConfig?.path === 'guest';

    if (isGuest) {
      this.userService.setUserId('guest');
      this.guestService.setGuestMode(true);
    } else if (userId) {
      this.userService.setUserId(userId);
      this.guestService.setGuestMode(false);
    } else {
      console.warn('No userId found in route.');
    }
  }}

