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
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, OnDestroy {
  booking: Booking[] = [];
  sub: Subscription | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    // Retrieve ownerId from local storage
    const ownerId = localStorage.getItem('userId');

    if (ownerId) {
      this.loadBookings(Number(ownerId)); // Convert ownerId to a number
    } else {
      this.errorMessage = 'Owner ID not found in local storage.';
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onStatusChange(newStatus: string, bookingId: number): void {
    this.bookingService.updateStatus(newStatus, bookingId).subscribe({
      next: (response) => {
        console.log('Status updated:', response);
        // Update the UI to reflect the change
        const updatedBooking = this.booking.find(b => b.id === bookingId);
        if (updatedBooking) {
          updatedBooking.status = newStatus;
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  loadBookings(ownerId: number): void {
    this.isLoading = true;
    this.bookingService.getOwnerHotelBookings(ownerId).subscribe({
      next: (bookings) => {
        this.booking = bookings;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings for owner\'s hotels.';
        this.isLoading = false;
      }
    });
  }

  // Method to get unique room types
  getUniqueRoomTypes(details: any[]): any[] {
    const seenRoomTypes = new Set();
    return details.filter(detail => {
      if (seenRoomTypes.has(detail.room_name)) {
        return false;
      } else {
        seenRoomTypes.add(detail.room_name);
        return true;
      }
    });
  }
}
