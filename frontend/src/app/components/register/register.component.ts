import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  userData = {
    fname: '',
    lname: '',
    phone: '',
    address: '',
    city: '',
    role: 'user',
    age: '',
    photo: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  passwordMismatch = false;
  registrationError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.userData.password !== this.userData.password_confirmation) {
      this.passwordMismatch = true;
      return;
    } else {
      this.passwordMismatch = false;
    }

    this.authService.register(this.userData).subscribe(
      (res) => {
        if (this.userData.role === 'admin') {
          this.router.navigate(['/register/hotel'], { queryParams: { owner_id: res.user.id } });
        } else {
          this.router.navigate(['/login']);
          // console.log('Register done');
        }
      },
      (error) => {
        console.error('Registration failed', error);
        if (error.error && error.error.message) {
          this.registrationError = error.error.message;
        } else {
          this.registrationError = 'Failed to register. Please try again later.';
        }
      }
    );
  }

  checkPasswordMismatch() {
    this.passwordMismatch = this.userData.password !== this.userData.password_confirmation;
  }
}
