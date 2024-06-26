import { Router, RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { ResetPasswordService } from '../services/reset-password.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isSubmitting = false;
  message: string = '';

  constructor(private fb: FormBuilder, private resetPasswordService: ResetPasswordService,private router:Router) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const email = this.resetPasswordForm.value.email;
    console.log(email);
    this.resetPasswordService.sendResetEmail(email).subscribe(
      response => {
        console.log('Response:', response);
        this.message = 'A reset link has been sent to your email!';
        this.isSubmitting = false;
        this.router.navigate(['/forget']);
      },

      error => {
        console.log("error",error);
        this.message = 'Failed to send reset link. Please try again.';
        this.isSubmitting = false;
      }

    );

  }

}
