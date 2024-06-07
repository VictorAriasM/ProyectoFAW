import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { WelcomeBannerComponent } from '../welcome-banner/welcome-banner.component';

export type LoginSuccessEvent = {
  email: string;
  owner: number;
  isLoggedIn: boolean;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterOutlet, WelcomeBannerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private router: Router) {}

  email = '';
  password = '';
  @Output() loginSuccess = new EventEmitter<LoginSuccessEvent>();

  async login() {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.email, password: this.password }),
    });

    if (response.ok) {
      const { data } = await response.json();
      console.log('🚀 ~ LoginComponent ~ login ~ owner:', data);
      this.loginSuccess.emit({
        email: this.email,
        owner: data.user.id,
        isLoggedIn: true,
      });
      localStorage.setItem('user', JSON.stringify(data.user));

      this.router.navigate(['/tasks']);
    } else {
      alert('Invalid email or password');
    }
  }
}
