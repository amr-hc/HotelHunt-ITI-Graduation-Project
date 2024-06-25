import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../models/booking';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit , OnDestroy {
  booking: Booking[] = [];
  sub: Subscription | null = null ;
  isLoading: boolean = false;
  errorMessage: string = '';


  constructor(public activatedRoute:ActivatedRoute, public bookingService:BookingService){}

  ngOnInit(): void {
    this.loadBookings();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }




  onStatusChange( newStatus: string , bookingId: number): void {
    this.bookingService.updateStatus( newStatus, bookingId).subscribe({
      next: (response) => {
        console.log('Status updated:', response);
        // Optionally, you can reload the bookings or update the UI to reflect the change
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
        this.booking = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings.';
        this.isLoading = false;
      }
    });
  }

}
