import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Booking } from '../../../models/booking';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-bookingdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookingdetails.component.html',
  styleUrl: './bookingdetails.component.css'
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBooking();
  }

  loadBooking(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.isLoading = true; // Start loading
    this.bookingService.getBookingById(id).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.isLoading = false; // Finish loading
      },
      error: (error) => {
        console.error('Error fetching booking details', error);
        this.errorMessage = 'Failed to load booking details.';
        this.isLoading = false; // Finish loading (on error)
      }
    });
  }
}
