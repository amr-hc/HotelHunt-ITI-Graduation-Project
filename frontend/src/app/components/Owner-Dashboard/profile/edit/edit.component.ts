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
      age: ['', [Validators.required, Validators.min(18)]],
      photo: ['']
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

    // Append all form fields except 'photo' to FormData
    Object.keys(this.editForm.controls).forEach(key => {
      if (key !== 'photo') {
        formData.append(key, this.editForm.get(key)?.value);
      }
    });

    // Append the photo field only if a new file has been selected
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    console.log('Submitting the following FormData:');
    formData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`${key}: ${value.name} (file)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    this.userService.updateUser(formData).subscribe(
      (response) => {
        console.log('User updated successfully', response);
        this.router.navigate(['/owner/profile']);
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
    } else {
      console.error('The selected file is not an image.');
      this.selectedFile = null;
    }
  } else {
    this.selectedFile = null;
  }
}


  isImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  onCancel(): void {
    this.router.navigate(['/owner/profile']);
  }
}
