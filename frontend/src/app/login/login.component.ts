import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelService } from '../services/hotel.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private hotelService:HotelService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        this.authService.handleLoginSuccess(res);
        this.redirectUserBasedOnRole(res.user.role, res.user.id);
      },
      (error) => {
        console.error('Login failed', error);
        this.loginError = error.error && error.error.message ? error.error.message : 'Failed to login. Please try again later.';
      }
    );
  }

  redirectUserBasedOnRole(role: string, userId: number) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'guest':
        this.router.navigate(['/home']);
        break;
      case 'owner':
        this.hotelService.getHotelForOwner(userId).subscribe(
          (response) => {
            if (response.data.length === 0) {
              this.router.navigate(['/register/hotel'], { queryParams: { owner_id: userId } });
            } else {
              this.router.navigate(['/owner/hotel']);
            }
          },
          (error) => {
            console.error('Error fetching hotels for owner', error);
            this.router.navigate(['/login']);
          }
        );
        break;
      default:
        this.router.navigate(['/home']);
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      console.log('Logged out successfully');
      this.router.navigate(['/login']);
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  navigateToRegister() {
    this.router.navigate(['/register']); // Navigate to '/register' route
  }
}
