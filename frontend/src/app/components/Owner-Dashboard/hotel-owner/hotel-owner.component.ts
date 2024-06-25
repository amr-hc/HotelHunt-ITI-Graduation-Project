import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../../services/hotel.service';
import { Hotel } from '../../../models/hotel';
import { HotelImage } from '../../../models/hotelImage';

@Component({
  selector: 'app-hotel-owner',
  standalone: true,
  imports: [CommonModule],
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
          this.hotelService.getHotelImages(hotel.id).subscribe(images => {
            this.ownerImages[hotel.id] = images;
            console.log(`Images for hotel ${hotel.id}:`, images);
          });
        });
      },
      error => {
        console.error("Error fetching hotels for owner", error);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
