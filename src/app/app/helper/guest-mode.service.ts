// guest-mode.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GuestModeService {
  private guestMode = false;

  setGuestMode(mode: boolean) {
    this.guestMode = mode;
  }

  isGuest(): boolean {
    return this.guestMode;
  }
}
