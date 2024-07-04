import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
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
      fname: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      lname: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [Validators.required, Validators.maxLength(25)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(80)]],
      photo: [''],
    });
  }

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    console.log("id from local storage",this.userId)
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
    const formData = new FormData();
    Object.keys(this.editForm.controls).forEach(key => {
      if (key !== 'photo' || this.selectedFile) {
        formData.append(key, this.editForm.get(key)?.value);
      }
    });

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.userService.updateUser(formData).subscribe(
      (response) => {
        console.log('User updated successfully', response);
        this.router.navigate(['/owner/profile']);
      },
      (error) => {
        console.log(error);
        if (error.status === 422 && error.error.errors) {
          this.errorMessage = '';
          this.setBackendErrors(error.error.errors);
        } else {
          this.errorMessage = 'Failed to add user. Please try again.';
        }
      }
    );
  }
}

private setBackendErrors(errors: any): void {
  Object.keys(errors).forEach((field) => {
    const formControl = this.editForm.get(field);
    if (formControl) {
      formControl.setErrors({ backend: errors[field].join(' ') });
    }
  });
}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    const photoControl = this.editForm.get('photo');

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

      // Reset previous errors
      photoControl?.setErrors(null);

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        console.error('The selected file is not an image.');
        photoControl?.setErrors({ invalidFileType: true });
        this.selectedFile = null;
      } else if (file.size > maxSizeInBytes) {
        // Validate file size
        console.error('The selected file is too large.');
        photoControl?.setErrors({ fileTooLarge: true });
        this.selectedFile = null;
      } else {
        // If file is valid
        this.selectedFile = file;
        photoControl?.setValue(file);
      }
    } else {
      // No file selected
      this.selectedFile = null;
      photoControl?.setValue(null);
      photoControl?.setErrors({ required: true });
    }
  }


  isImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png','image/jpg', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  onCancel(): void {
    this.router.navigate(['/owner/profile']);
  }
}
