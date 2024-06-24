import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.css'
})
export class OwnersComponent {
  users: User[] = [];
  owners: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        this.users = response.data;
        this.owners = this.users.filter(user => user.role === 'owner');
        console.log('Fetched users:', this.users);
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
}
