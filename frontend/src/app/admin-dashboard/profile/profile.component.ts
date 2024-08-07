import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  userId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.isLoading = true;
      const userSubscription = this.userService.getUserById(this.userId).subscribe(
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
      this.subscriptions.add(userSubscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  editProfile(id: number): void {
    this.router.navigate(['/admin-dashboard/profile/edit', id]);
    console.log('Edit profile clicked');
  }
}
