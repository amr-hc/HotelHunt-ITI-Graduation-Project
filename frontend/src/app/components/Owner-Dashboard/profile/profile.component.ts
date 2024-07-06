import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User | null = null;
  userId: number | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  verified: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    const verified = localStorage.getItem('verified');
    console.log(verified);
    if (verified === 'undefined') {
      this.verified = 'unactivated';
    } else {
      this.verified = 'activated';
    }
    if (this.userId) {
      // this.isLoading = true;
      this.userService.getUserById(this.userId).subscribe(
        (response: any) => {
          this.user = response.data;
          this.loading = false;

          // this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching user details', error);
          this.errorMessage = 'Failed to load user details.';
          this.loading = false;
          // this.isLoading = false;
        }
      );

    }
  }

  editProfile(id: number): void {
    this.router.navigate(['/owner/profile/edit', id]);
    console.log('Edit profile clicked');
  }
  reVerifyUser(): void {
    if (this.userId) {
      const data = { userId: this.userId };
      this.userService.reVerify(data).subscribe(
        (response) => {
          console.log('Re-verification successful:', response);
          

          // Display success alert
          Swal.fire({
            title: 'Success!',
            text: 'A re-verification email has been sent to your email address.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        (error) => {
          console.error('Re-verification failed:', error);
          this.errorMessage = 'Failed to re-verify user.';

          // Display error alert
          Swal.fire({
            title: 'Error!',
            text: 'Failed to send re-verification email. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
  }

