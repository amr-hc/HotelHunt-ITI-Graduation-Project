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

@Component({
  selector: 'app-hotel-room-availability',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hotel-room-availability.component.html',
  styleUrls: ['./hotel-room-availability.component.css']
})
export class HotelRoomAvailabilityComponent implements OnInit, OnDestroy {
  @Input() hotel_id: number | undefined;
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

  constructor(
    private hotelRoomSearchService: HotelRoomSearchService,
    private bookingService: BookingService,
    private commentService: CommentService,
    private ratingService: RatingService
  ) {

   }

  ngOnInit(): void {
    const today = new Date().toISOString().substr(0, 10); // Get today's date in yyyy-mm-dd format
    this.checkinDate = today;
    this.checkoutDate = today;
    this.loadComments();
    this.loadRating();
  }

  loadComments() {
    this.commentSubscription = this.commentService.getAllComments().subscribe(
      (data: Comment[]) => {
        this.comments = data.filter(comment => comment.hotel_id === this.hotel_id);
      },
      (error: any) => {
        console.error('Error fetching comments', error);
      }
    );
  }

  addComment() {
    if (this.userComment.trim() && this.hotel_id) {
      const newComment = new UserComment(1, this.hotel_id, this.userComment);
      this.commentService.createComment(newComment).subscribe(
        (comment: Comment) => {
          this.comments.push(comment);
          this.userComment = '';
        },
        (error: any) => {
          console.error('Error adding comment', error);
        }
      );
    }
  }

  loadRating() {
    this.ratingSubscription = this.ratingService.getUserRating(8).subscribe(
      (rating: Rating) => {
        if (rating && rating.hotel_id === this.hotel_id) {
          this.rating = rating.rate;
          this.userRating = new UserRating(rating.rate, rating.user_id, rating.hotel_id);
        }
      },
      (error: any) => {
        console.error('Error fetching rating', error);
      }
    );
  }

  rateHotel(rating: number) {
    if (this.hotel_id) {
      const userRating = new UserRating(rating, 1, this.hotel_id);
      this.ratingService.updateUserRating(this.hotel_id, userRating).subscribe(
        response => {
          console.log('Rating updated', response);
          this.rating = rating; // Update local rating immediately
        },
        error => {
          console.error('Error updating rating', error);
        }
      );
    }
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
      const bookingData = new BookingData(1, 1, 'progress', bookingDetails);
      console.log(bookingData);

      this.bookingSubscription = this.bookingService.bookingRoom(bookingData).subscribe(
        response => {
          console.log('Booking successful', response);
        },
        error => {
          console.error('Booking failed', error);
        }
      );
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
  }
}
