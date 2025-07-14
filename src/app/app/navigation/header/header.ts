import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../helper/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [RouterLink, RouterLinkActive],
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  userId: string;

  constructor(private userService: UserService) {
    this.userId = this.userService.getUserId(); // 'guest' or '1', etc.
  }
}
