import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  loginError: string | null = null;

  constructor(private authService:AuthService, private router:Router){}

  onLogin() {
    this.authService.login(this.credentials).subscribe(
      (res) => {
        this.authService.handleLoginSuccess(res);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login failed', error);
        if (error.error && error.error.message) {
          this.loginError = error.error.message;
        } else {
          this.loginError = 'Failed to login. Please try again later.';
        }
      }
    );
  }

  logout() {
    this.authService.logout().subscribe(() => {
      console.log('Logged out successfully');
      this.router.navigate(['/login']);
    });
  }
}
