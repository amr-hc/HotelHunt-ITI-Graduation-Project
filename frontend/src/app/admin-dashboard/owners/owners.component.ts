import { Component } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,FormsModule, RouterLink],
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.css'
})
export class OwnersComponent {
  users: User[] = [];
  owners: User[] = [];
  filteredOwners: User[] = [];
  currentPage: number = 1;
  isLoading: boolean = true;
  searchTerm: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        this.users = response.data;
        this.owners = this.users.filter(user => user.role === 'owner');
        this.filteredOwners = [...this.owners];
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching users', error);
      }
    );
  }

  viewUser(id: number): void {
    this.router.navigate(['/admin-dashboard/owners/details', id]);
  }

  editUser(id: number): void {
    this.router.navigate(['/admin-dashboard/owners/edit', id]);
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
        this.filteredOwners = this.filteredOwners.filter(user => user.id !== id);
      },
      (error) => {
        console.error('Error deleting user', error);
      }
    );
  }

  searchOwners(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredOwners = this.owners.filter((owner) =>
      owner.fname.toLowerCase().includes(searchTermLower) ||
      owner.email.toLowerCase().includes(searchTermLower)
    );
  }
}
