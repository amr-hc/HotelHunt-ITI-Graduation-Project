import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usersdetails',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usersdetails.component.html',
  styleUrl: './usersdetails.component.css'
})
export class UsersdetailsComponent implements OnDestroy {
  user: User | undefined;
  isLoading: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isLoading = true;
      const userSubscription = this.userService.getUserById(+userId).subscribe(
        (response: any) => {
          this.user = response.data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching user details', error);
          this.isLoading = false;
        }
      );
      this.subscriptions.add(userSubscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
