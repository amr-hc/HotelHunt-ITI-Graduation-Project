import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HotelRoomSearchService } from '../../services/hotel-room-search.service';
import { HotelRoomSearch } from '../../models/hotel-room-search';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { BookingData } from '../../models/booking-data';
import { BookingDetails } from '../../models/booking-details';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommentsComponent } from '../comments/comments.component';
import { RatingsComponent } from '../ratings/ratings.component';
import { HotelService } from '../../services/hotel.service';
import { SearchHotelService } from '../../services/search-hotel.service';
@Component({
  selector: 'app-hotel-room-availability',
  standalone: true,
  imports: [FormsModule, CommonModule, CommentsComponent,RatingsComponent],
  templateUrl: './hotel-room-availability.component.html',
  styleUrls: ['./hotel-room-availability.component.css']
})
export class HotelRoomAvailabilityComponent implements OnInit, OnDestroy {
  hotel_id: number| null = 0;
  private hotelIdSubscription: Subscription | null = null;
  checkinDate: string = '';
  checkoutDate: string = '';
  rooms: HotelRoomSearch[] = [];
  selectedRooms: { [roomId: number]: number } = {};
  private searchSubscription: Subscription | null = null;
  private bookingSubscription: Subscription | null = null;
  user_id: number | null = 0;
  duration: number = 0;
  checkinDateError: string = '';
  checkoutDateError: string = '';
  dateError: string = '';
  checkLoggedInUserRole: string = '';
  isUserVerified: string|null = null;
  private subscriptions: Subscription[] = [];
  today: string = '';
  minCheckoutDate: string = '';
  searcherdCheckInDate: string = '';
  searcherdCheckOutDate: string = '';


  constructor(
    private hotelRoomSearchService: HotelRoomSearchService,
    private bookingService: BookingService,
    private router: Router,
    private HotelService: HotelService,
    private searchHotelService: SearchHotelService
  ) { }
  validateForm(): boolean {
    let isValid = true;

    if (!this.checkinDate) {
      this.checkinDateError = 'Check-in date is required';
      isValid = false;
    } else {
      this.checkinDateError = '';
    }

    if (!this.checkoutDate) {
      this.checkoutDateError = 'Check-out date is required';
      isValid = false;
    } else {
      this.checkoutDateError = '';
    }
    if (this.checkinDate && this.checkoutDate) {
      const checkin = new Date(this.checkinDate);
      const checkout = new Date(this.checkoutDate);
      const today = new Date(this.today);

      // Create a date object for tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      if (checkin >= checkout) {
        this.dateError = 'Check-in date cannot be later than or the same as check-out date';
        isValid = false;
      } else if (checkin < today || checkout < tomorrow) {
        this.dateError = 'Check-in date cannot be in the past and check-out date must be at least tomorrow';
        isValid = false;
      } else {
        this.dateError = '';
      }
    }

    return isValid;
  }

  ngOnInit(): void {

    this.checkLoggedInUserRole = localStorage.getItem('userRole') || '';
    this .isUserVerified = localStorage.getItem('verified') || null;
    console.log("User Role:", this.checkLoggedInUserRole);
    console.log("User Verified:", this.isUserVerified);


    this.user_id = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
    console.log('User ID:', this.user_id);
    this.hotelIdSubscription = this.HotelService.hotelId$.subscribe(
      (id) => {
        this.hotel_id = id;
        console.log('Hotel ID:', this.hotel_id);
      },
      (error: any) => {
        console.error('Error fetching hotel ID', error);
      }
    )
    // const today = new Date().toISOString().substr(0, 10); // Get today's date in yyyy-mm-dd format
    const today = new Date();
    this.today = today.toISOString().substr(0, 10);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minCheckoutDate = tomorrow.toISOString().substr(0, 10);
    this.subscriptions.push(
      this.searchHotelService.searchedCheckInDate$.subscribe(date => this.checkinDate = date || this.today),
      this.searchHotelService.searchedCheckOutDate$.subscribe(date => this.checkoutDate = date || this.minCheckoutDate)
    );
    if (this.hotel_id && this.checkinDate && this.checkoutDate) {
      this.onSearch();


    }
  }


  onSearch() {
    if (!this.validateForm()) {
      return;
    }
    const checkout = new Date(this.checkoutDate);
    checkout.setDate(checkout.getDate() - 1);
    const adjustedCheckoutDate = checkout.toISOString().substr(0, 10);
    const searchParams = {
      hotel_id: this.hotel_id,
      start_date: this.checkinDate,
      end_date: adjustedCheckoutDate
    };

    this.searchSubscription = this.hotelRoomSearchService.getAllHotelRooms(searchParams).subscribe(
      (data: HotelRoomSearch[]) => {
        this.rooms = data;
        this.searcherdCheckInDate = this.checkinDate;
        this.searcherdCheckOutDate = this.checkoutDate;
      },
      (error: any) => {
        console.error('Error fetching hotel rooms', error);
      }
    );
  }
  onCheckinDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const checkinDate = new Date(input.value);
    checkinDate.setDate(checkinDate.getDate() + 1); // Add one day
    this.minCheckoutDate = checkinDate.toISOString().substr(0, 10);
    if (new Date(this.checkoutDate) <= checkinDate) {
      this.checkoutDate = this.minCheckoutDate; // Reset checkout date if it's invalid
    }
  }
  getRoomOptions(stock: number): number[] {
    return Array.from({ length: stock + 1 }, (_, index) => index);
  }

  onRoomSelectionChange(roomId: number, event: any) {
    this.selectedRooms[roomId] = +event.target.value;
  }

  onReserve() {
    if (this.checkLoggedInUserRole!=='guest' || this.isUserVerified===null) {
      Swal.fire({
        title: 'Reservation Error',
        text: 'You must be a registered user to make a reservation.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.checkinDate = this.searcherdCheckInDate;
    this.checkoutDate = this.searcherdCheckOutDate;
    const bookingDetails: BookingDetails[] = [];
    this.rooms.forEach(room => {
      const quantity = this.selectedRooms[room.id] || 0;
      if (quantity > 0) {
        for (let i = 0; i < quantity; i++) {
          const checkin = new Date(this.checkinDate);
          const checkout = new Date(this.checkoutDate);
          const days = (checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24);

          for (let j = 0; j < days; j++) {
            let bookingDate = new Date(checkin);
            bookingDate.setDate(bookingDate.getDate() + j);

            let bookingDateString = bookingDate.toISOString().split('T')[0];

            bookingDetails.push(new BookingDetails(room.id, bookingDateString, Number(room.price)));
          }
        }
      }
    });

    if (bookingDetails.length > 0) {
      // Use SweetAlert confirmation before proceeding with booking
      const start = new Date(this.checkinDate);
      const end = new Date(this.checkoutDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(this.duration);

      Swal.fire({
        title: 'Confirm Reservation',
        text: 'Are you sure you want to proceed with the reservation?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, reserve it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          const bookingData = new BookingData(this.user_id, this.duration, 'progress', bookingDetails);
          console.log(bookingData);

          this.bookingSubscription = this.bookingService.bookingRoom(bookingData).subscribe(
            response => {
              console.log('Booking successful', response);
              Swal.fire('Reserved!', 'Your rooms have been reserved.', 'success');
              this.router.navigate(['/user/profile']);

            },
            error => {
              console.error('Booking failed', error);
              Swal.fire('Error', 'Failed to reserve rooms.', 'error');
            }
          );


        }
      });
    } else {
      // If no rooms were selected
      Swal.fire('No Rooms Selected', 'Please select at least one room to reserve.', 'warning');
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
    if (this.hotelIdSubscription) {
      this.hotelIdSubscription.unsubscribe();
    }
    this.subscriptions.forEach(subscription => subscription.unsubscribe());


  }


}
