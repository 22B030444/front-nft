import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [RouterLink, FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    const login = this.login;
    const password = this.password;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const matched = users.find((u: any) => u.login === login && u.password === password);

    if (matched) {
      localStorage.setItem('loggedInUser', login);
      this.router.navigate(['/home/nfts']);
    } else {
      alert('Invalid login or password');
    }
  }
}
