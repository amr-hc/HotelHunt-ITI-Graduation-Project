import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {
   email: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  token: string = '';
  isSubmitting = false;
  message: string = '';

  constructor(private http: HttpClient, private activatedRoute:ActivatedRoute, private router:Router) {
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params=>{
      this.token = params['token'];
    })
  }

  onSubmit() {
    if (!this.email || !this.password || !this.passwordConfirmation) {
      this.message = 'Please fill in all fields.';
      return;
    }

    if (this.password !== this.passwordConfirmation) {
      this.message = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    const formData = {
      email: this.email,
      password: this.password,
      password_confirmation: this.passwordConfirmation,
      token: this.token
    };

    this.http.post('http://127.0.0.1:8000/api/reset-password', formData)
      .subscribe(
        response => {
          // Show success message using SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Password Reset Successful!',
            text: 'You can now login with your new password.',
          }).then(() => {
            // Navigate to login page
            this.router.navigate(['/login']);
          });

          this.isSubmitting = false;
        },
        error => {
          this.message = 'Failed to reset password. Please try again.';
          this.isSubmitting = false;
        }
      );
  }

}
