import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Booking } from '../../../models/booking';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule,RouterLink],
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
    this.fetchBookings();
  }

  ngOnDestroy(): void {}

   fetchBookings(): void {
    this.isLoading = true;
    this.sub = this.bookingService.getAllBookings().subscribe(
      (response: Booking[]) => {
        this.booking = response;
        this.isLoading = false;
        console.log('Bookings:', this.booking);
        console.log('books_details : ',this.booking[0].book_details)
      },
      (error) => {
        console.error('Error fetching bookings:', error);
        this.errorMessage = 'Error fetching bookings. Please try again later.';
        this.isLoading = false;
      }
    );
  }

}
