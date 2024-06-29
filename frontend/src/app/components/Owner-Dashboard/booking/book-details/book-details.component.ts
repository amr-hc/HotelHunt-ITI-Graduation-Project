import { Booking } from './../../../../models/booking';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../../services/booking.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  booking: Booking | null = null;
  private routeSub: Subscription | null = null; // Subscription for route parameters
  private bookingSub: Subscription | null = null; // Subscription for booking data
  accordionState: boolean[] = []; // State of the accordion items

  constructor(
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get the booking ID
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      const id = +params['id']; // Convert ID to number
      if (id) {
        this.loadBookingDetails(id);
      }
    });
  }

  private loadBookingDetails(id: number): void {
    // Fetch booking details by ID
    this.bookingSub = this.bookingService.getBookingById(id).subscribe({
      next: booking => {
        this.booking = booking;
        this.initializeAccordionState();
      },
      error: err => {
        console.error('Error fetching booking:', err);
        // Handle error (e.g., show an error message or redirect)
      }
    });
  }

  private initializeAccordionState(): void {
    // Initialize accordion state based on booking details
    if (this.booking && this.booking.book_details) {
      this.accordionState = new Array(this.booking.book_details.length).fill(false);
    }
  }

  toggleAccordion(index: number): void {
    // Toggle the state of a specific accordion item
    if (this.accordionState[index] !== undefined) {
      this.accordionState[index] = !this.accordionState[index];
    }
  }

  isAccordionOpen(index: number): boolean {
    // Check if a specific accordion item is open
    return this.accordionState[index] || false;
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscriptions to prevent memory leaks
    this.routeSub?.unsubscribe();
    this.bookingSub?.unsubscribe();
  }
}
