import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      id: [''],
      fname: ['', [Validators.required,Validators.maxLength(100),Validators.minLength(3)]],
      lname: ['', [Validators.required,Validators.maxLength(100),Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [Validators.required,Validators.maxLength(25)]],
      address: ['', [Validators.required,Validators.maxLength(255)]],
      age: ['', [Validators.required, Validators.min(18)]],
      // photo: ['']
    });
  }

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (response: any) => {
          this.user = response.data;
          if(this.user){
          this.editForm.patchValue(this.user);
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
      this.userService.editUser(this.editForm.value).subscribe(
        (response) => {
          console.log('User updated successfully', response);
          this.router.navigate(['/admin-dashboard/profile']);
        },
        (error) => {
          console.error('Error updating user', error);
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin-dashboard/profile']);
  }
}
