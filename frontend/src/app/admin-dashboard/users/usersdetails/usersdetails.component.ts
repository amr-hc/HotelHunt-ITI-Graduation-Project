import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usersdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usersdetails.component.html',
  styleUrl: './usersdetails.component.css'
})
export class UsersdetailsComponent {
  user: User | undefined;
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isLoading = true;
      this.userService.getUserById(+userId).subscribe(
        (response: any) => {
          this.user = response.data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching user details', error);
          this.isLoading = false;
        }
      );
    }
  }
}
