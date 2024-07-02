import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edituser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edituser.component.html',
  styleUrl: './edituser.component.css',
})
export class EdituserComponent {
  editForm: FormGroup;
  userId: number | null = null;
  user: User | null = null;
  formSubmitted: boolean = false;
  selectedFile: File | null = null;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      id: [''],
      fname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      lname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
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
          Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s]*$/)
        ],
      ],
      age: ['', [Validators.required, Validators.min(18), Validators.max(120), Validators.pattern('^\\d+$')]],
      photo: [''],
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (response: any) => {
          this.user = response.data;
          console.log(this.user);
          if (this.user) {
            this.editForm.patchValue(this.user);
            this.editForm.get('photo')?.setValue(this.user.photo);
          }
        },
        (error) => {
          console.error('Error fetching user details', error);
        }
      );
    }
  }


  onSubmit(): void {
    this.formSubmitted = true;

    if (this.editForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to submit the form?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          Object.keys(this.editForm.controls).forEach((key) => {
            if (key !== 'photo' || this.selectedFile) {
              formData.append(key, this.editForm.get(key)?.value);
            }
          });

          if (this.selectedFile) {
            formData.append('photo', this.selectedFile, this.selectedFile.name);
          }

          // Log FormData content for debugging
          console.log('Submitting the following FormData:');
          formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
          });

          this.userService.updateUser(formData).subscribe(
            (response) => {
              console.log('User updated successfully', response);
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User updated successfully',
              }).then(() => {
                this.router.navigate([
                  '/admin-dashboard/users/details/' + this.userId,
                ]);
              });
            },
            (error) => {
              console.log(error);
              let errorMessage = 'Failed to edit user. Please try again.';
              if (error.status === 422 && error.error.errors) {
                errorMessage = '';
                Object.keys(error.error.errors).forEach((field) => {
                  const fieldErrors = error.error.errors[field];
                  if (Array.isArray(fieldErrors)) {
                    fieldErrors.forEach((errorText) => {
                      errorMessage += `${errorText}\n`;
                    });
                  }
                });
                console.log(errorMessage);
              }else {
                this.errorMessage = 'Failed to add user. Please try again.';
              }

              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
              });
            }
          );
        }
        else {
          this.formSubmitted = false;
        }
      });
    }
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.isImageFile(file)) {
        this.selectedFile = file;
        this.editForm.get('photo')?.setValue(file);
        console.log('Selected file:', file);
      } else {
        console.error('The selected file is not an image.');
        this.selectedFile = null;
        this.editForm.get('photo')?.setErrors({ invalidFileType: true });
      }
    }
  }

  isImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  onCancel(): void {
    this.router.navigate(['/admin-dashboard/users']);
  }
}
