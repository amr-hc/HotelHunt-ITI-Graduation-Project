import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../../services/hotel.service';
import { Hotel } from '../../../models/hotel';
import { HotelImage } from '../../../models/hotelImage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotel-owner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hotel-owner.component.html',
  styleUrls: ['./hotel-owner.component.css']
})
export class HotelOwnerComponent implements OnInit, OnDestroy {
  hotels: Hotel[] = [];
  ownerImages: { [key: number]: HotelImage[] } = {};
  sub: Subscription | null = null;
  isLoading: boolean = false; // Added loading state

  constructor(private activatedRoute: ActivatedRoute, private hotelService: HotelService, private router: Router) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      const ownerId = parseInt(localStorage.getItem('userId') || '0', 10);
      console.log(ownerId);
      this.fetchHotelsForOwner(ownerId);
    });
  }

  fetchHotelsForOwner(ownerId: number): void {
    this.isLoading = true; // Start loading
    this.hotelService.getHotelForOwner(ownerId).subscribe(
      response => {
        this.hotels = response.data;
        console.log("Hotels for owner:", this.hotels);

        // Fetch images for each hotel
        this.hotels.forEach(hotel => {
          console.log("Fetching images for hotel ", hotel.id);
          this.hotelService.getHotelImages(hotel.id).subscribe(images => {
            this.ownerImages[hotel.id] = images;
            console.log(`Images for hotel ${hotel.id}:`, images);
            console.log("images", this.ownerImages);
          });
        });
        this.isLoading = false; // End loading
      },
      error => {
        console.error("Error fetching hotels for owner", error);
        this.isLoading = false; // End loading on error
      }
    );
  }

  onDeleteImage(imageId: number) {
    const ownerId = parseInt(localStorage.getItem('userId') || '0', 10);
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this image?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hotelService.deleteHotelImage(imageId).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Your image has been deleted.', 'success');
            console.log('Image deleted successfully:', response);
            this.fetchHotelsForOwner(ownerId);
          },
          (error) => {
            Swal.fire('Error!', 'There was an error deleting the image.', 'error');
            console.error('Error deleting image:', error);
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
