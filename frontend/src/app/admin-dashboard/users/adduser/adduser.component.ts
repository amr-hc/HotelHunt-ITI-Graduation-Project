import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adduser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css',
})
export class AdduserComponent {
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
        fname: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern("^[A-Za-z]+$"),
          ],
        ],
        lname: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern("^[A-Za-z]+$"),
            Validators.maxLength(100),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(15),
            Validators.pattern(/^[0-9]+$/),
          ],
        ],
        address: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(255),
            Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'\-_]*$/),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', Validators.required],
        age: [
          '',
          [
            Validators.required,
            Validators.min(18),
            Validators.max(120),
            Validators.pattern('^\\d+$'),
          ],
        ],
        role: ['guest', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
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

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        Object.keys(this.addUserForm.value).forEach((key) => {
          formData.append(key, this.addUserForm.get(key)?.value);
        });

        this.userService.addUser(formData).subscribe(
          () => {
            this.success = true;
            this.addUserForm.reset();
            this.submitted = false;
            this.errorMessage = '';

            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'User added successfully.',
            });

            this.router.navigate(['/admin-dashboard/users']);
          },
          (error) => {
            if (error.status === 422 && error.error.errors) {
              this.errorMessage = '';
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

            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: this.errorMessage,
            });
          }
        );
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.addUserForm.patchValue({ photo: file });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;

    if (password !== confirmPassword) {
      control
        .get('password_confirmation')
        ?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      control.get('password_confirmation')?.setErrors(null);
      return null;
    }
  }
}
