import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HotelRoomSearchService } from '../../services/hotel-room-search.service';
import { HotelRoomSearch } from '../../models/hotel-room-search';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { BookingData } from '../../models/booking-data';
import { BookingDetails } from '../../models/booking-details';
import { CommentService } from '../../services/comment.service';
import { RatingService } from '../../services/rating.service';
import { Rating, UserRating } from '../../models/rating';
import { Comment, UserComment } from '../../models/comment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommentsComponent } from '../comments/comments.component';
import { RatingsComponent } from '../ratings/ratings.component';
import { HotelService } from '../../services/hotel.service';
@Component({
  selector: 'app-hotel-room-availability',
  standalone: true,
  imports: [FormsModule, CommonModule, CommentsComponent,RatingsComponent],
  templateUrl: './hotel-room-availability.component.html',
  styleUrls: ['./hotel-room-availability.component.css']
})
export class HotelRoomAvailabilityComponent implements OnInit, OnDestroy {
  // @Input() hotel_id: number | undefined;
  hotel_id: number| null = 0;
  private hotelIdSubscription: Subscription | null = null;
  checkinDate: string = '';
  checkoutDate: string = '';
  rooms: HotelRoomSearch[] = [];
  selectedRooms: { [roomId: number]: number } = {};
  comments: Comment[] = [];
  userComment: string = '';
  rating: number = 0;
  userRating: UserRating | null = null;
  private searchSubscription: Subscription | null = null;
  private bookingSubscription: Subscription | null = null;
  private commentSubscription: Subscription | null = null;
  private ratingSubscription: Subscription | null = null;
  user_id: number | null = 0;

  constructor(
    private hotelRoomSearchService: HotelRoomSearchService,
    private bookingService: BookingService,
    private commentService: CommentService,
    private ratingService: RatingService,
    private router: Router,
    private HotelService: HotelService
  ) {

   }

  ngOnInit(): void {
    this.user_id = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
    this.hotelIdSubscription = this.HotelService.hotelId$.subscribe(
      (id) => {
        this.hotel_id = id;
        console.log('Hotel ID:', this.hotel_id);
      },
      (error: any) => {
        console.error('Error fetching hotel ID', error);
      }
    )
    const today = new Date().toISOString().substr(0, 10); // Get today's date in yyyy-mm-dd format
    this.checkinDate = today;
    this.checkoutDate = today;

  }


  onSearch() {
    const searchParams = {
      hotel_id: this.hotel_id,
      start_date: this.checkinDate,
      end_date: this.checkoutDate
    };

    this.searchSubscription = this.hotelRoomSearchService.getAllHotelRooms(searchParams).subscribe(
      (data: HotelRoomSearch[]) => {
        this.rooms = data;
      },
      (error: any) => {
        console.error('Error fetching hotel rooms', error);
      }
    );
  }

  getRoomOptions(stock: number): number[] {
    return Array.from({ length: stock + 1 }, (_, index) => index);
  }

  onRoomSelectionChange(roomId: number, event: any) {
    this.selectedRooms[roomId] = +event.target.value;
  }

  onReserve() {
    const bookingDetails: BookingDetails[] = [];

    this.rooms.forEach(room => {
      const quantity = this.selectedRooms[room.id] || 0;
      if (quantity > 0) {
        for (let i = 0; i < quantity; i++) {
          bookingDetails.push(new BookingDetails(room.id, this.checkinDate, Number(room.price)));
        }
      }
    });

    if (bookingDetails.length > 0) {
      // Use SweetAlert confirmation before proceeding with booking
      Swal.fire({
        title: 'Confirm Reservation',
        text: 'Are you sure you want to proceed with the reservation?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, reserve it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          const bookingData = new BookingData(this.user_id, 1, 'progress', bookingDetails);
          console.log(bookingData);

          this.bookingSubscription = this.bookingService.bookingRoom(bookingData).subscribe(
            response => {
              console.log('Booking successful', response);
              Swal.fire('Reserved!', 'Your rooms have been reserved.', 'success');
            },
            error => {
              console.error('Booking failed', error);
              Swal.fire('Error', 'Failed to reserve rooms.', 'error');
            }
          );
          this.router.navigate(['/user/profile']);


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

    if (this.commentSubscription) {
      this.commentSubscription.unsubscribe();
    }

    if (this.ratingSubscription) {
      this.ratingSubscription.unsubscribe();
    }
    if (this.hotelIdSubscription) {
      this.hotelIdSubscription.unsubscribe();
    }

  }


}
