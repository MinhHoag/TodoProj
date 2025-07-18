import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { GuestModeService } from './guest-mode.service';
import { UserApiService } from './user-api.service';
import { UserService } from './user.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserIdGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private guestService: GuestModeService,
    private router: Router,
    private userApi: UserApiService,
    private userService: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const routeUsername = route.paramMap.get('username');
    const isGuest = routeUsername === 'guest';

    if (!routeUsername) {
      this.router.navigate(['/not-found']);
      return of(false);
    }

    if (isGuest) {
      this.guestService.setGuestMode(true);
      return of(true);
    }

    return this.userApi.getAllUsers().pipe(
      map(users => {
        const user = users.find(u => u.name === routeUsername);
        if (!user) {
          console.warn(`[Guard] No user found with username '${routeUsername}'`);
          this.router.navigate(['/not-found']);
          return false;
        }

        this.auth.login({ id: user.id!, name: user.name });
        this.userService.setUser({ id: user.id!, name: user.name });
        this.guestService.setGuestMode(false);
        return true;
      })
    );
  }
}
