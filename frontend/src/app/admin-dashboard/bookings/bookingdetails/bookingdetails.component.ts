import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Booking } from '../../../models/booking';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subscription } from 'rxjs';

interface GroupedBookingDetail {
  room_name: string;
  total_price: number;
  count: number;
  price: number;
}

@Component({
  selector: 'app-bookingdetails',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './bookingdetails.component.html',
  styleUrls: ['./bookingdetails.component.css'],
})
export class BookingDetailsComponent implements OnInit, OnDestroy {
  booking: Booking | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  currentPage: number = 1;
  groupedDetails: GroupedBookingDetail[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBooking();
  }

  loadBooking(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.isLoading = true; // Start loading
    const bookingSub = this.bookingService.getBookingById(id).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.groupBookings();
        this.isLoading = false; // Finish loading
      },
      error: (error) => {
        console.error('Error fetching booking details', error);
        this.errorMessage = 'Failed to load booking details.';
        this.isLoading = false; // Finish loading (on error)
      }
    });
    this.subscription.add(bookingSub);
  }

  groupBookings(): void {
    if (this.booking && this.booking.book_details) {
      const groupedDetails = this.booking.book_details.reduce((acc: { [key: string]: GroupedBookingDetail }, detail: any) => {
        if (!acc[detail.room_name]) {
          acc[detail.room_name] = { room_name: detail.room_name, total_price: parseFloat(detail.price), count: 1, price: parseFloat(detail.price) }; // Initialize count to 1 and set price
        } else {
          acc[detail.room_name].total_price += parseFloat(detail.price);
          acc[detail.room_name].count += 1; // Increment count
        }
        return acc;
      }, {});

      this.groupedDetails = Object.values(groupedDetails);
      console.log(this.groupedDetails);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
