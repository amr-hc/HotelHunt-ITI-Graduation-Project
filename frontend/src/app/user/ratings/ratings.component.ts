import { RatingByuser } from './../../models/rating';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Rating, UserRating } from '../../models/rating';
import { Subscription } from 'rxjs';
import { RatingService } from '../../services/rating.service';
import { HotelService } from '../../services/hotel.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { UserAuthService } from '../../services/user-auth.service';
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
  private userRatingSubscription: Subscription | null = null;
  user_id: number | null = 0;
  checkLoggedInUserRole: string = '';
  isUserVerified: string | null = null;
  canRate: boolean = false;
  private canUserRateSubscription: Subscription | null = null;
  constructor(private ratingService: RatingService,
    private HotelService: HotelService,
    private userAuthRating: UserAuthService
  ) {

  }

  ngOnInit(): void {
    this.checkLoggedInUserRole = localStorage.getItem('userRole') || '';
    this.isUserVerified = localStorage.getItem('verified') || null;
    this.user_id = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
    this.hotelIdSubscription = this.HotelService.hotelId$.subscribe(
      (id) => {
        this.hotel_id = id;
        this.checkIfUserCanRate();
      },
      (error: any) => {
        console.error('Error fetching hotel ID', error);
      }
    )

    this.loadRating();
  }
  checkIfUserCanRate(): void {
    if (this.hotel_id !== null) {
      this.canUserRateSubscription = this.userAuthRating.canRateOrComment(this.hotel_id).subscribe(
        (data) => {
          this.canRate = data.can;
        },
        (error: any) => {
          console.error('Error fetching canRate', error);
        }
      );
    }
  }

  loadRating() {
    this.ratingSubscription = this.ratingService.getRatingforLoginUser(this.hotel_id).subscribe(
      (rating: Rating) => {
        if (rating)  {
          this.rating = rating.rate;
          this.userRating = new UserRating(rating.rate, rating.user_id, rating.hotel_id);
        }
      },
      (error: any) => {
      }
    );
  }
  rateHotel(rating: number) {

    if (this.checkLoggedInUserRole !== 'guest' || this.isUserVerified === 'null' || this.isUserVerified === 'undefined') {
      Swal.fire({
        title: 'Rating Error',
        text: 'You must be a verified registered user to add a rating.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    if(this.canRate === false){
      Swal.fire({
        title: 'Rating Error',
        text: `You Can't Rate Hotel Without Reserving. Please Reserve First.`,
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (this.hotel_id) {
      const userRating = new RatingByuser(rating, this.hotel_id);
      this.userRatingSubscription = this.ratingService.createOrUpdateUserRating(userRating).subscribe(
        (response) => {
          console.log('Rating updated', response);
          this.rating = rating; // Update local rating immediately
        },
        (error) => {
          console.error('Error updating rating:'); // Log the actual error
        }
      );
      // this.rating = rating; // Update local rating immediately

    }
  }

  ngOnDestroy(): void {
    if (this.ratingSubscription) {
      this.ratingSubscription.unsubscribe();
    }

    if (this.hotelIdSubscription) {
      this.hotelIdSubscription.unsubscribe();
    }
    if (this.userRatingSubscription) {
      this.userRatingSubscription.unsubscribe();
    }

    if (this.canUserRateSubscription) {
      this.canUserRateSubscription.unsubscribe();
    }
  }
}
