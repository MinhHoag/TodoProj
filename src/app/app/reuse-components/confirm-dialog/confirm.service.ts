import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ConfirmService {
  constructor(private dialog: MatDialog) {
  }

  open(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: message,
    });
    return dialogRef.afterClosed();
  }
}
