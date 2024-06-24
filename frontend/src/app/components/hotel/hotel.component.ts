import { HotelService } from './../../services/hotel.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HotelImage } from '../../models/hotelImage';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})
export class HotelComponent implements OnInit, OnDestroy{
  hotel:Hotel | null = null ;
  sub: Subscription | null = null;
  images: HotelImage[] = [];

  constructor(public activatedRoute: ActivatedRoute, public hotelService:HotelService){}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.hotelService.getHotelById(id).subscribe((response) => {
        this.hotel = response.data; // Access the nested data property
        console.log("Full response data:", response);
        console.log("Hotel is:", this.hotel);
        console.log("City is:", this.hotel.city);

        this.hotelService.getHotelImages(id).subscribe((images) => {
          this.images = images;
          console.log("Hotel images:", this.images);
          });
      });
    });
  }

  ngOnDestroy(): void {
      this.sub?.unsubscribe();
  }

}
