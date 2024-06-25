import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ownersdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ownersdetails.component.html',
  styleUrl: './ownersdetails.component.css'
})
export class OwnersdetailsComponent {
  user: User | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(+userId).subscribe(
        (response:any) => {
          this.user = response.data;
        },
        (error) => {
          console.error('Error fetching user details', error);
        }
      );
    }
  }
}
