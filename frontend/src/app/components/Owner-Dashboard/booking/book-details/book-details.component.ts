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
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  booking: Booking | null = null;
  sub: Subscription | null  = null;
  constructor(public activatedRoute:ActivatedRoute, public bookingService:BookingService){}
  ngOnInit(): void {
    // Subscribe to route parameters
    this.sub = this.activatedRoute.params.subscribe(params => {
      const id = +params['id']; // Get the booking ID from the route parameters
      this.getBookingById(id);
    });
  }
  getBookingById(id: number): void {
    this.bookingService.getBookingById(id).subscribe({
      next: (booking) => this.booking = booking,
      error: (err) => console.error('Error fetching booking:', err)
    });
  }
  ngOnDestroy(): void {
      this.sub?.unsubscribe();
  }




}
