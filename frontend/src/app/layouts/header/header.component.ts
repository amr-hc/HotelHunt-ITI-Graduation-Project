import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user: User | null = null;
  userId: number | null = null;
  errorMessage: string = '';
  constructor(public authService: AuthService, private router: Router, private userService: UserService,) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (response: any) => {
          this.user = response.data;
        },
        (error) => {
          console.error('Error fetching user details', error);
          this.errorMessage = 'Failed to load user details.';
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
