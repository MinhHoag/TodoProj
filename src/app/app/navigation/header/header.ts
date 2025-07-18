import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common'; // ✅ Required for ngIf/ngFor
import { AuthService } from '../../helper/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  imports: [RouterModule, CommonModule] // ✅ Add CommonModule
})
export class HeaderComponent implements OnInit {
  userId: string = '';
  menuOpen: boolean = false;
  username: string = '';
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.userId = this.auth.getUserId() ?? '';
    this.username = this.auth.getUsername() ?? '';
  }



  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout(event: Event) {
    event.stopPropagation();
    this.auth.logout();          // Clear storage
    this.menuOpen = false;

    // Navigate first to guest, then force reload
    this.router.navigate(['/task-list', 'guest']).then(() => {
      window.location.reload(); // ✅ Hard reload the entire app
    });
  }




}
