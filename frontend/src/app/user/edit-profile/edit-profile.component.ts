import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FooterComponent } from '../../layouts/footer/footer.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HeaderComponent,FooterComponent],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup;
  user: User = new User(0, '', '', '', '', '', 'guest', 0, '');
  errorMessage: string = '';
  existingPhoto: string = '';
  loading:boolean=true;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      fname: ['', [Validators.required, Validators.maxLength(100),Validators.pattern("^[A-Za-z]+$")]],
      lname: ['', [Validators.required, Validators.maxLength(100),Validators.pattern("^[A-Za-z]+$")]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.maxLength(13),Validators.minLength(11), Validators.pattern(/^[0-9]+$/)]],
      address: ['', [Validators.required, Validators.maxLength(255),Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'\-_]*$/)]],
      photo: ['']  // for image file

    });
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(
        (response: any) => {
          this.user = response.data;
          this.existingPhoto = this.user.photo;
          // Update form values after fetching user data
          this.userForm.patchValue({
            fname: this.user.fname,
            lname: this.user.lname,
            email: this.user.email,
            phone: this.user.phone,
            address: this.user.address
          });
          this.loading=false;
        },
        (error) => {
          console.error('Error fetching user data', error);
          this.errorMessage = 'Failed to fetch user data';
        }
      );
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      // this.errorMessage = 'Please correct the errors in the form.';
      return;
    }
    const formData = new FormData();
    formData.append('id', this.user.id.toString());
    formData.append('fname', this.userForm.value.fname);
    formData.append('lname', this.userForm.value.lname);
    formData.append('email', this.userForm.value.email);
    formData.append('phone', this.userForm.value.phone);
    formData.append('address', this.userForm.value.address);
    // formData.append('photo', this.userForm.value.photo);

     if (this.userForm.value.photo && this.isImageFile(this.userForm.value.photo)) {
      formData.append('photo', this.userForm.value.photo);
    } else {
      formData.append('existingPhoto', this.existingPhoto);
    }
    this.userService.updateUser(formData).subscribe(
      (response) => {
        console.log('User updated successfully', response);
        this.router.navigate(['/user/profile']);
      },
      (error) => {
        console.error('Error updating user', error);
        if (error.error && error.error.message){
          this.errorMessage = error.error.message;
        }else{
          this.errorMessage = 'Failed to update user';
        }
      }
    );
  }

  // Method to handle file input change
  onFileChange(event: any) {
    const fileControl = this.userForm.get('photo');
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.isImageFile(file)) {
        this.userForm.get('photo')!.setValue(file);
      } else {
        this.errorMessage = 'Only JPEG, PNG, and GIF files are allowed.';
        fileControl!.setErrors({ invalidFileType: true });

      }
    }
  }

  resetForm(): void {
    this.userForm.reset();
    this.router.navigate(['/user/profile']);
  }
  isImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }
}
