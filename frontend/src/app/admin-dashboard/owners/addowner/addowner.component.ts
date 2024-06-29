import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addowner',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './addowner.component.html',
  styleUrl: './addowner.component.css'
})
export class AddownerComponent {
  addUserForm: FormGroup;
  submitted = false;
  success = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.addUserForm = this.formBuilder.group(
      {
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', Validators.required],
        age: ['', [Validators.required, Validators.min(18)]],
        role: ['owner', Validators.required],
      },
      {
        validator: this.passwordMatchValidator(),
      }
    );
  }

  get f() {
    return this.addUserForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.addUserForm.invalid) {
      return;
    }

    const formData = new FormData();
    Object.keys(this.addUserForm.value).forEach((key) => {
      formData.append(key, this.addUserForm.get(key)?.value);
    });

    this.userService.addUser(formData).subscribe(
      () => {
        this.success = true;
        this.addUserForm.reset();
        this.submitted = false;
        this.errorMessage = ''; // Clear error message on success
        this.router.navigate(['/admin-dashboard/owners']);
      },
      (error) => {
        if (error.status === 422 && error.error.errors) {
          // Handle validation errors
          this.errorMessage = ''; // Clear previous error message
          Object.keys(error.error.errors).forEach((field) => {
            const fieldErrors = error.error.errors[field];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((errorText) => {
                this.errorMessage += `${errorText}\n`;
              });
            }
          });
        } else {
          this.errorMessage = 'Failed to add user. Please try again.';
        }
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.addUserForm.patchValue({ photo: file });
  }

  // Custom validator function to check if password and password_confirmation match
  passwordMatchValidator(): Validators {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('password_confirmation')?.value;

      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      } else {
        return null;
      }
    };
  }

}
