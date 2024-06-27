import { trigger, transition, style, animate } from '@angular/animations';
import { HotelService } from './../../services/hotel.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HotelRoomAvailabilityComponent } from '../../user/hotel-room-availability/hotel-room-availability.component';
import { HotelImage } from '../../models/hotelImage';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layouts/header/header.component';
import { CommentsComponent } from '../../user/comments/comments.component';
import { RatingsComponent } from '../../user/ratings/ratings.component';


@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [HotelRoomAvailabilityComponent, CommonModule, HeaderComponent,CommentsComponent,RatingsComponent],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HotelComponent implements OnInit, OnDestroy{
  hotel:Hotel | null = null; ;
  sub: Subscription | null = null;
  images: HotelImage[] = [];
  id: number = 0;
  loading: boolean = true;

  constructor(public activatedRoute: ActivatedRoute, public hotelService:HotelService){}

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.hotelService.setHotelId(this.id); // Pass the hotel ID to the service
      this.hotelService.getHotelById(this.id).subscribe((response) => {
        this.hotel = response.data; // Access the nested data property
        console.log("Full response data:", response);
        console.log("Hotel is:", this.hotel);
        console.log("City is:", this.hotel.city);

        this.hotelService.getHotelImages(this.id).subscribe((images) => {
          console.log("response is",images)
          this.images = images;
          console.log("Hotel images:", this.images);
          this.loading = false;

          });
      });


    });

  }

  ngOnDestroy(): void {
      this.sub?.unsubscribe();
  }

}
