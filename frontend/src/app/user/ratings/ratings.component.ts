import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Rating, UserRating } from '../../models/rating';
import { Subscription } from 'rxjs';
import { RatingService } from '../../services/rating.service';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [],
  templateUrl: './ratings.component.html',
  styleUrl: './ratings.component.css'
})
export class RatingsComponent implements OnInit, OnDestroy {
  // @Input() hotel_id: number | undefined = 0;
  hotel_id: number | null = 0;
  private hotelIdSubscription: Subscription | null = null;
  rating: number = 0;
  userRating: UserRating | null = null;
  private ratingSubscription: Subscription | null = null;
  user_id: number | null = 0;
  constructor(private ratingService: RatingService,
    private HotelService: HotelService
  ) {

  }

  ngOnInit(): void {
    this.user_id = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
    console.log('User ID:', this.user_id);
    console.log(typeof this.user_id);
    this.hotelIdSubscription = this.HotelService.hotelId$.subscribe(
      (id) => {
        this.hotel_id = id;
        console.log('Hotel ID:', this.hotel_id);
      },
      (error: any) => {
        console.error('Error fetching hotel ID', error);
      }
    )
    this.loadRating();
  }
  // loadRating() {
  //   this.ratingSubscription = this.ratingService.getUserRating(this.hotel_id, this.user_id).subscribe(
  //     (rating: Rating) => {
  //       if (rating)  {
  //         this.rating = rating.rate;
  //         this.userRating = new UserRating(rating.rate, rating.user_id, rating.hotel_id);
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error fetching rating', error);
  //     }
  //   );
  // }
  loadRating() {
    this.ratingSubscription = this.ratingService.getRatingforLoginUser(this.hotel_id).subscribe(
      (rating: Rating) => {
        if (rating)  {
          this.rating = rating.rate;
          this.userRating = new UserRating(rating.rate, rating.user_id, rating.hotel_id);
        }
      },
      (error: any) => {
        console.error('Error fetching rating', error);
      }
    );
  }

  // rateHotel(rating: number) {
  //   if (this.hotel_id) {
  //     const userRating = new UserRating(rating, this.user_id, this.hotel_id);
  //     this.ratingService.updateUserRating(this.hotel_id, userRating).subscribe(
  //       response => {
  //         console.log('Rating updated', response);
  //         this.rating = rating; // Update local rating immediately
  //       },
  //       error => {
  //         console.error('Error updating rating', error);
  //       }
  //     );
  //   }
  // }
  rateHotel(rating: number) {
    if (this.hotel_id && this.user_id !== null) {
      const userRating = new UserRating(rating, this.user_id, this.hotel_id);

      if (this.userRating) {
        // Update existing rating
        this.ratingService.updateUserRating(this.hotel_id, userRating).subscribe(
          response => {
            console.log('Rating updated', response);
            this.rating = rating; // Update local rating immediately
          },
          error => {
            console.error('Error updating rating', error);
          }
        );
      } else {
        // Create new rating
        this.ratingService.createUserRating(userRating).subscribe(
          response => {
            console.log('Rating created', response);
            this.rating = rating; // Update local rating immediately
            this.userRating = new UserRating(rating, this.user_id, this.hotel_id); // Update userRating object
          },
          error => {
            console.error('Error creating rating', error);
          }
        );
      }
    }
  }
  ngOnDestroy(): void {
    if (this.ratingSubscription) {
      this.ratingSubscription.unsubscribe();
    }

    if (this.hotelIdSubscription) {
      this.hotelIdSubscription.unsubscribe();
    }
  }
}
