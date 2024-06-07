import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { WelcomeBannerComponent } from '../welcome-banner/welcome-banner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterOutlet, WelcomeBannerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private router: Router) {}

  email = '';
  name = '';
  birthday = '';
  password = '';
  gender = '';

  async register() {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.email,
        name: this.name,
        birthday: this.birthday,
        password: this.password,
        gender: this.gender,
      }),
    });

    if (response.ok) {
      alert('User registered successfully');
      this.router.navigate(['/login']);
    } else {
      alert('Error registering user');
    }
  }
}
