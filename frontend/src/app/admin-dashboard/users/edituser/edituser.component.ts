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
          Validators.maxLength(100),
          Validators.minLength(3),
        ],
      ],
      lname: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.minLength(3),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      phone: ['', [Validators.required, Validators.maxLength(25)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      age: ['', [Validators.required, Validators.min(18)]],
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
          this.router.navigate(['/admin-dashboard/users/details/'+this.userId]);
        },
        (error) => {
          console.error('Error updating user', error);
        }
      );
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
    this.router.navigate(['/admin-dashboard/profile']);
  }
}
