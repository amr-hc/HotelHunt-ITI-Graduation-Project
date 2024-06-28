import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink,NgxPaginationModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentPage: number = 1;
  isLoading: boolean = true;
  searchTerm: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        this.users = response.data;
        this.filteredUsers = this.users.filter((user) => user.role === 'guest');
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching users', error);
      }
    );
  }

  viewUser(id: number): void {
    this.router.navigate(['/admin-dashboard/users/details', id]);
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(id);
      }
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        Swal.fire(
          'Deleted!',
          'The user has been deleted.',
          'success'
        );
        this.filteredUsers = this.filteredUsers.filter(user => user.id !== id);
      },
      (error) => {
        console.error('Error deleting user', error);
      }
    );
  }

  searchUsers(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.role === 'guest' &&
      (user.fname.toLowerCase().includes(searchTermLower) ||
       user.email.toLowerCase().includes(searchTermLower))
    );
  }
}
