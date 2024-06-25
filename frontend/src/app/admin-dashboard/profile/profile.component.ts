import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private userService: UserService,  private router: Router) {}
  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (response:any) => {
          this.user = response.data;
        },
        (error) => {
          console.error('Error fetching user details', error);
        }
      );
    }
  }

  editProfile(id: number): void {
    this.router.navigate(['/admin-dashboard/profile/edit', id]);
    console.log('Edit profile clicked');
  }
}
