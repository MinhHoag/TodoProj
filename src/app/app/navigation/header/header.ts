import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Required for ngIf/ngFor
import { AuthService } from '../../helper/auth.service';

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

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.userId = this.auth.getUserId() ?? '';
  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout(event: Event) {
    event.stopPropagation();
    this.auth.logout();
    this.menuOpen = false;
    this.router.navigate(['/task-list', 'guest']);
    this.userId = 'guest';
  }
}
