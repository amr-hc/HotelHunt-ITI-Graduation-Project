import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HotelService } from '../services/hotel.service';
import { CommonModule } from '@angular/common';

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
  formSubmitted = false;
  loading:boolean=false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private hotelService: HotelService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(){
    this.authService.logout();
  }
  onLogin() {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading=true;
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        this.authService.handleLoginSuccess(res);
        this.redirectUserBasedOnRole(res.user.role, res.user.id);
        this.loading=false;
      },
      (error) => {
        // console.error('Login failed', error);
        this.loginError = error.error && error.error.message ? error.error.message : 'Failed to login. Please try again later.';
        this.loading=false;
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
            // console.error('Error fetching hotels for owner', error);
            this.router.navigate(['/login']);
          }
        );
        break;
      default:
        this.router.navigate(['/home']);
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:8000/api/auth/google';
  }

  shouldShowError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.formSubmitted)
    );
  }
}
