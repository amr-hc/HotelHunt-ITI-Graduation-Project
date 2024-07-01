import { CommentService } from './../../../services/comment.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../../services/hotel.service';
import { Hotel } from '../../../models/hotel';
import { HotelImage } from '../../../models/hotelImage';
import Swal from 'sweetalert2';
import { Comment } from '../../../models/comment';
import { NgxPaginationModule, PaginatePipe, PaginationControlsComponent } from 'ngx-pagination';
@Component({
  selector: 'app-hotel-owner',
  standalone: true,
  imports: [CommonModule, RouterLink,NgxPaginationModule],
  templateUrl: './hotel-owner.component.html',
  styleUrls: ['./hotel-owner.component.css']
})
export class HotelOwnerComponent implements OnInit, OnDestroy {
  hotels: Hotel[] = [];
  ownerImages: { [key: number]: HotelImage[] } = {};
  hotelComments: { [key: number]: Comment[] } = {}; // Store comments per hotel
  imagePage: { [key: number]: number } = {}; // Track the current page for each hotel's images
  sub: Subscription | null = null;
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private hotelService: HotelService,
    private router: Router,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      const ownerId = parseInt(localStorage.getItem('userId') || '0', 10);
      console.log('Owner ID:', ownerId);
      this.fetchHotelsForOwner(ownerId);
    });
  }

  fetchHotelsForOwner(ownerId: number): void {
    this.isLoading = true; // Start loading
    this.hotelService.getHotelForOwner(ownerId).subscribe(
      response => {
        this.hotels = response.data;
        console.log('Hotels for owner:', this.hotels);

        // Fetch images and comments for each hotel
        this.hotels.forEach(hotel => {
          console.log('Fetching images for hotel', hotel.id);
          this.fetchHotelImages(hotel.id);
          console.log('Fetching comments for hotel', hotel.id);
          this.fetchCommentsForHotel(hotel.id);
        });
        this.isLoading = false; // End loading
      },
      error => {
        console.error('Error fetching hotels for owner:', error);
        this.isLoading = false; // End loading on error
      }
    );
  }

  fetchHotelImages(hotelId: number): void {
    this.hotelService.getHotelImages(hotelId).subscribe(
      images => {
        this.ownerImages[hotelId] = images;
        console.log(`Images for hotel ${hotelId}:`, images);
      },
      error => {
        console.error(`Error fetching images for hotel ${hotelId}:`, error);
      }
    );
  }

  fetchCommentsForHotel(hotelId: number): void {
    this.commentService.getCommentsByHotelId(hotelId).subscribe(
      comments => {
        this.hotelComments[hotelId] = comments;
        console.log(`Comments for hotel ${hotelId}:`, comments);
      },
      error => {
        console.error(`Error fetching comments for hotel ${hotelId}:`, error);
      }
    );
  }

  onDeleteImage(imageId: number): void {
    const ownerId = parseInt(localStorage.getItem('userId') || '0', 10);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.hotelService.deleteHotelImage(imageId).subscribe(
          response => {
            Swal.fire('Deleted!', 'Your image has been deleted.', 'success');
            console.log('Image deleted successfully:', response);
            this.fetchHotelsForOwner(ownerId); // Refresh data
          },
          error => {
            Swal.fire('Error!', 'There was an error deleting the image.', 'error');
            console.error('Error deleting image:', error);
          }
        );
      }
    });
  }
  getStarRatingStars(starRating: number): { fullStars: number, halfStars: number } {
  const fullStars = Math.floor(starRating);
  const halfStars = starRating % 1 !== 0 ? 1 : 0; // Check if there's a half star

  return { fullStars, halfStars };
}
starRange(count: number): number[] {
    return Array.from({ length: count }).map((_, i) => i);
  }


  onPageChange(hotelId: number, page: number): void {
    this.imagePage[hotelId] = page;
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  
}
