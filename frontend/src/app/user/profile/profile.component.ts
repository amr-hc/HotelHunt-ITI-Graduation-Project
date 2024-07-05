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
import { BookingDetails2 } from '../../models/bookingDetails';
import Swal from 'sweetalert2';

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
  loading:boolean=true;

  constructor(private userService: UserService, private router: Router,
              private bookingService: BookingService, private authService:AuthService) { }

  ngOnInit() {
    const userid = localStorage.getItem('userId');
    // console.log("User ID from localStorage:", userid);
    if (userid) {
      this.userid = +userid;
    }

    this.authService.setprofile();

    if (this.userid) {
      this.sub = this.userService.getUserById(this.userid).subscribe(
        (response: any) => {
          // console.log("Response data:", response);
          this.user = response.data;
          // console.log("User data:", this.user);
        },
        (error) => {
          // console.error('Error fetching user data', error);
        }
      );

      this.bookingsSub = this.bookingService.getUserBookings(this.userid).subscribe(
        (response: any) => {
          this.bookings = response.data;
          // console.log("Booking data:", this.bookings);
          this.groupBookings();
          this.loading=false;
        },
        (error) => {
          // console.error('Error fetching bookings data', error);
          this.loading=false;
        }
      );
    } else {
      // console.error('User ID is not available');
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

  // calculateCheckoutDate(checkinDate: string, duration: number): string {
  //   const checkin = new Date(checkinDate);
  //   checkin.setDate(checkin.getDate() + duration-1);
  //   return checkin.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  // }
  groupBookings(): void {
  this.bookings.forEach(booking => {
    const groupedDetails = booking.book_details.reduce((acc: { [key: string]: any }, detail: BookingDetails2) => {
      if (!acc[detail.room_name]) {
        acc[detail.room_name] = { ...detail, total_price: detail.price, count: 1 }; // Initialize count to 1
      } else {
        acc[detail.room_name].total_price += detail.price;
        acc[detail.room_name].count += 1; // Increment count
      }
      return acc;
    }, {});

    booking.grouped_details = Object.values(groupedDetails);
  });
}
handleDeleteBooking(booking: any): void {
  if (booking.status === 'completed') {
    Swal.fire({
      title: 'Cannot Cancel Booking',
      text: 'This booking is completed and cannot be canceled.',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  } else if (booking.status === 'cancel') {
    Swal.fire({
      title: 'Already Cancelled',
      text: 'This booking has already been cancelled.',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  } else {
    this.cancelBooking(booking.id);
  }
}


cancelBooking(bookingId: number, event?: Event): void {
  if (event) {
    event.stopPropagation(); // Prevent triggering row click
  }

  const bookingToUpdate = this.bookings.find(b => b.id === bookingId);

  if (!bookingToUpdate) {
    // console.error(`Booking with id ${bookingId} not found.`);
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to cancel this booking?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Cancel it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      this.bookingService.deleteBooking(bookingId).subscribe(
        () => {
          bookingToUpdate.status = 'cancel'; // Update status locally
          Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
        },
        (error) => {
          Swal.fire('Error!', error.error.error || 'Failed to cancel booking.', 'error');
        }
      );
    }
  });
}
}
