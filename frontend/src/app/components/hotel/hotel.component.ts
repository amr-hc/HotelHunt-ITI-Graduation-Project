import { HotelService } from './../../services/hotel.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HotelRoomAvailabilityComponent } from '../../user/hotel-room-availability/hotel-room-availability.component';
import { HotelImage } from '../../models/hotelImage';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [HotelRoomAvailabilityComponent,CommonModule,HeaderComponent],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
  // encapsulation: ViewEncapsulation.Emulated
})
export class HotelComponent implements OnInit, OnDestroy{
  hotel:Hotel | null = null; ;
  sub: Subscription | null = null;
  images: HotelImage[] = [];
  id: number = 0;

  constructor(public activatedRoute: ActivatedRoute, public hotelService:HotelService){}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.hotelService.getHotelById(this.id).subscribe((response) => {
        this.hotel = response.data; // Access the nested data property
        console.log("Full response data:", response);
        console.log("Hotel is:", this.hotel);
        console.log("City is:", this.hotel.city);

        this.hotelService.getHotelImages(this.id).subscribe((images) => {
          console.log("response is",images)
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
