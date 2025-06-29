import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    NgIf
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showLoginCard = false;

  toggleLoginCard(): void {
    this.showLoginCard = !this.showLoginCard;
  }
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }




}
