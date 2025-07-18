import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserApiService, User } from '../../helper/api/user-api.service';
import { AuthService } from '../../helper/auth/auth.service';
import {HeaderComponent} from '../../navigation/header/header';
import {UserService} from '../../helper/mode(s)/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  existingUsernames: Set<string> = new Set();

  constructor(
    private userApi: UserApiService,
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userApi.getAllUsers().subscribe(users => {
      this.existingUsernames = new Set(users.map(user => user.name.trim().toLowerCase()));
    });
  }

  get usernameExists(): boolean {
    return this.existingUsernames.has(this.username.trim().toLowerCase());
  }

  get isUsernameValid(): boolean {
    return this.username.trim().length > 0 && !/\s/.test(this.username);
  }

  login() {
    this.userApi.getAllUsers().subscribe(users => {
      const user = users.find(
        u => u.name === this.username.trim() && u.password === this.password.trim()
      );

      if (!user) {
        this.errorMessage = 'Invalid username or password.';
        return;
      }

      this.userApi.setActiveStatus(user.id!, true).subscribe(() => {
        this.auth.login({ id: user.id ?? 'guest', name: user.name });
        this.userService.setUser({ id: user.id!, name: user.name });

        // ✅ Navigate using username
        this.router.navigate(['/task-list', user.name]);
      });
    });
  }

  signup() {
    if (this.usernameExists || !this.isUsernameValid) return;

    const newUser: User = {
      name: this.username.trim(),
      password: this.password.trim(),
      createdAt: Math.floor(Date.now() / 1000),
      active: false
    };

    this.userApi.addUser(newUser).subscribe(user => {
      this.userApi.setActiveStatus(user.id!, true).subscribe(() => {
        this.auth.login({ id: user.id ?? 'guest', name: user.name });
        this.userService.setUser({ id: user.id!, name: user.name });

        // ✅ Navigate using username
        this.router.navigate(['/task-list', user.name]);
      });

      this.existingUsernames.add(user.name.trim().toLowerCase());
      this.errorMessage = ''; // clear any prior login error
    });
  }
}
