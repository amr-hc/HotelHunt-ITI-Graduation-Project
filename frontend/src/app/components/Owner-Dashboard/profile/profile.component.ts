import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

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
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.isLoading = true;
      this.userService.getUserById(this.userId).subscribe(
        (response: any) => {
          this.user = response.data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching user details', error);
          this.errorMessage = 'Failed to load user details.';
          this.isLoading = false;
        }
      );
    }
  }

  editProfile(id: number): void {
    this.router.navigate(['/owner/profile/edit', id]);
    console.log('Edit profile clicked');
  }
}
