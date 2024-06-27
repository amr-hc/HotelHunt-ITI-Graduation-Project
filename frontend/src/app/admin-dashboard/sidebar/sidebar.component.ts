import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isUsersAccordionOpen = false;
  isPaymentAccordionOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  toggleUsersAccordion() {
    this.isUsersAccordionOpen = !this.isUsersAccordionOpen;
  }
  togglePaymentAccordion() {
    this.isPaymentAccordionOpen = !this.isPaymentAccordionOpen;
  }
  logout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'No, stay logged in'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
        Swal.fire('Logged out!', 'You have been logged out.', 'success');
      }
    });
  }

}
