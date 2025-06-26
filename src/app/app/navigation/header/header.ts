// header.component.ts
import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  styleUrls: ['./header.scss']
})
export class HeaderComponent {}
