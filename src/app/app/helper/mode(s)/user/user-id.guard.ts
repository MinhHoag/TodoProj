import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {GuestModeService} from '../guest/guest-mode.service';
import {UserApiService} from '../../api/user-api.service';
import {UserService} from './user.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserIdGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private guestService: GuestModeService,
    private router: Router,
    private userApi: UserApiService,
    private userService: UserService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const routeUsername = route.paramMap.get('username');

    if (!routeUsername) {
      this.router.navigate(['/not-found']);
      return of(false);
    }

    // Guest mode check
    if (routeUsername === 'guest') {
      this.guestService.setGuestMode(true);
      return of(true);
    }

    // If already logged in, verify username matches
    const currentUser = this.auth.getCurrentUser(); // Assumes auth service stores current user
    if (currentUser) {
      if (currentUser.name !== routeUsername) {
        this.router.navigate(['/not-found']);
        return of(false);
      }

      this.guestService.setGuestMode(false);
      return of(true);
    }

    // Not logged in yet: fetch all users to verify and auto-login
    return this.userApi.getAllUsers().pipe(
      map(users => {
        const user = users.find(u => u.name === routeUsername);
        if (!user) {
          console.warn(`[Guard] No user found with username '${routeUsername}'`);
          this.router.navigate(['/not-found']);
          return false;
        }

        // Auto-login and proceed
        this.auth.login({id: user.id!, name: user.name});
        this.userService.setUser({id: user.id!, name: user.name});
        this.guestService.setGuestMode(false);
        return true;
      })
    );
  }
}
