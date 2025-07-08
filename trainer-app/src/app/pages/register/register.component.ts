import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [RouterLink, FormsModule],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  private router = inject(Router);

  login: string = '';
  password: string = '';

  onSubmit(): void {
    const login = this.login;
    const password = this.password;

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = users.find((u: any) => u.login === login);
    if (userExists) {
      alert('User already exists');
      return;
    }

    users.push({ login, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registered! Now login');
    this.router.navigate(['/login']);
  }
}
