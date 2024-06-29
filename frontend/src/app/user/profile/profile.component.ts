// profile.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking'; // Import your adjusted Booking model
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from '../../layouts/header/header.component';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../layouts/footer/footer.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,NgxPaginationModule,HeaderComponent,FooterComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  bookings: Booking[] = []; // Change to array of bookings
  sub: Subscription | null = null;
  bookingsSub: Subscription | null = null;
  userid: number = 0;
  currentPage = 1;
  itemsPerPage = 2;
  visibleDetailsId: number | null = null;

  constructor(private userService: UserService, private router: Router,
              private bookingService: BookingService, private authService:AuthService) { }

  ngOnInit() {
    const userid = localStorage.getItem('userId');
    console.log("User ID from localStorage:", userid);
    if (userid) {
      this.userid = +userid;
    }

    this.authService.setprofile();

    if (this.userid) {
      this.sub = this.userService.getUserById(this.userid).subscribe(
        (response: any) => {
          // console.log("Response data:", response);
          this.user = response.data;
          console.log("User data:", this.user);
        },
        (error) => {
          console.error('Error fetching user data', error);
        }
      );

      this.bookingsSub = this.bookingService.getUserBookings(this.userid).subscribe(
        (response: any) => {
          this.bookings = response.data;
          console.log("Booking data:", this.bookings);
        },
        (error) => {
          console.error('Error fetching bookings data', error);
        }
      );
    } else {
      console.error('User ID is not available');
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

  navigateToEditProfile() {
    this.router.navigate(['/user/profile/edit']);
  }

  toggleDetails(bookingId: number): void {
    if (this.visibleDetailsId === bookingId) {
      this.visibleDetailsId = null;
    } else {
      this.visibleDetailsId = bookingId;
    }
  }

  isDetailsVisible(bookingId: number): boolean {
    return this.visibleDetailsId === bookingId;
  }

  calculateCheckoutDate(checkinDate: string, duration: number): string {
    const checkin = new Date(checkinDate);
    checkin.setDate(checkin.getDate() + duration-1);
    return checkin.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  }
}
