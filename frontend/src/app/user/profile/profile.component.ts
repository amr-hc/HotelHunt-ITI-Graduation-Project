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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  bookings: Booking | null = null;
  sub: Subscription | null = null;
  bookingsSub: Subscription | null = null;
  userid: number = 0;

  constructor(private userService: UserService, private router: Router, private bookingService: BookingService) {}

  ngOnInit() {
    const userid = localStorage.getItem('userId');
    console.log("User ID from localStorage:", userid);
    if (userid) {
      this.userid = +userid;
    }

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
        (response: Booking) => {
          this.bookings = response;
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
}
