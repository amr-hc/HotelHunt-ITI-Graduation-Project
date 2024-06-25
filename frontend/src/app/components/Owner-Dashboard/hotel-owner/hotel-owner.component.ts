import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  styleUrl: './hotel-owner.component.css'
})
export class HotelOwnerComponent implements OnInit, OnDestroy {
  hotels: Hotel[] = [];
  sub: Subscription | null = null;
  ownerImages: { [key: number]: HotelImage[] } = {};

  constructor(private activatedRoute: ActivatedRoute, private hotelService: HotelService) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      // const ownerId = params['ownerId'];
      const ownerId = parseInt(localStorage.getItem('userId') || '0', 10);
      console.log(ownerId);
      this.fetchHotelsForOwner(ownerId);
    });
  }

  fetchHotelsForOwner(ownerId: number): void {
    this.hotelService.getHotelForOwner(ownerId).subscribe(
      response => {
        this.hotels = response.data;
        console.log("Hotels for owner:", this.hotels);

        // Fetch images for each hotel
        this.hotels.forEach(hotel => {
          console.log("Fetching images for hotel ",hotel.id);
          this.hotelService.getHotelImages(hotel.id).subscribe(images => {
            this.ownerImages[hotel.id] = images;
            console.log(`Images for hotel ${hotel.id}:`, images);
            console.log("images",this.ownerImages);
          });
        });
      },
      error => {
        console.error("Error fetching hotels for owner", error);
      }
    );
  }
  onDeleteImage(imageId: number) {
    // Show SweetAlert confirmation
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
        // If confirmed, proceed with the delete action
        this.hotelService.deleteHotelImage(imageId).subscribe(
          (response) => {
            Swal.fire(
              'Deleted!',
              'Your image has been deleted.',
              'success'
            );
            console.log('Image deleted successfully:', response);
            // Optionally, refresh the image list or update the UI
          },
          (error) => {
            Swal.fire(
              'Error!',
              'There was an error deleting the image.',
              'error'
            );
            console.error('Error deleting image:', error);
            // Handle error - show error message or retry logic
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
