import { Component, OnDestroy, OnInit } from '@angular/core';
import { Booking } from '../../models/booking';
import { BookingService } from '../../services/booking.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';



@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,NgxPaginationModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit , OnDestroy {
  bookings: Booking[] = [];
  groupedBookings: { [key: string]: Booking[] } = {};
  selectedHotel: string | null = null;
  selectedBooking: Booking | null = null;
  sub: Subscription | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  currentPage: number =1;

  constructor(public activatedRoute: ActivatedRoute, public bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onStatusChange(newStatus: string, bookingId: number): void {
    this.bookingService.updateStatus(newStatus, bookingId).subscribe({
      next: (response) => {
        console.log('Status updated:', response);
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.groupBookingsByHotel();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings.';
        this.isLoading = false;
      }
    });
  }

  groupBookingsByHotel(): void {
    this.groupedBookings = this.bookings.reduce((groups, booking) => {
      const hotel = booking.hotel;
      if (!groups[hotel]) {
        groups[hotel] = [];
      }
      groups[hotel].push(booking);
      return groups;
    }, {} as { [key: string]: Booking[] });
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
