import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup;
  user: User = new User(0, '', '', '', '', '', 'guest', 0, '');
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      photo: ['']  // for image file

    });
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(
        (response: any) => {
          this.user = response.data;
          // Update form values after fetching user data
          this.userForm.patchValue({
            fname: this.user.fname,
            lname: this.user.lname,
            email: this.user.email,
            phone: this.user.phone,
            address: this.user.address
          });
        },
        (error) => {
          console.error('Error fetching user data', error);
          this.errorMessage = 'Failed to fetch user data';
        }
      );
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('id', this.user.id.toString()); // Append user ID if needed
    formData.append('fname', this.userForm.value.fname);
    formData.append('lname', this.userForm.value.lname);
    formData.append('email', this.userForm.value.email);
    formData.append('phone', this.userForm.value.phone);
    formData.append('address', this.userForm.value.address);
    formData.append('photo', this.userForm.value.photo); // append photo file

    this.userService.updateUser(formData).subscribe(
      (response) => {
        console.log('User updated successfully', response);
        this.router.navigate(['/user/profile']);
      },
      (error) => {
        console.error('Error updating user', error);
        this.errorMessage = 'Failed to update user';
      }
    );
  }

  // Method to handle file input change
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userForm.get('photo')!.setValue(file);
    }
  }
}
