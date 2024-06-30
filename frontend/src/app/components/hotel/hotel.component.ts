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
  imports: [HotelRoomAvailabilityComponent, CommonModule, HeaderComponent, CommentsComponent, RatingsComponent],
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
export class HotelComponent implements OnInit, OnDestroy {
  hotel: Hotel | null = null;;
  private sub: Subscription | null = null;
  images: HotelImage[] = [];
  id: number = 0;
  loading: boolean = true;
  imagePath = "http://127.0.0.1:8000/storage/";
  selectedImage: string = '';



  constructor(public activatedRoute: ActivatedRoute, public hotelService: HotelService) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.fetchHotelData();
    });
  }



  fetchHotelData(): void {
    this.hotelService.setHotelId(this.id);
    this.fetchHotelDetails();
    this.fetchHotelImages();
    // this.loading = false;
  }

  fetchHotelDetails(): void {
    this.hotelService.getHotelById(this.id).subscribe({
      next: (response: { data: Hotel | null }) => {
        this.hotel = response.data;
        this.selectedImage = this.imagePath + this.hotel?.image;
        if (this.hotel?.image) {
          this.images.push(new HotelImage(0, this.hotel.id, this.hotel.image));
        }
      },
      error: (err: any) => {
        console.error('Error fetching hotel details:', err);
        // this.loading = false;
      }
    });
  }

  fetchHotelImages(): void {
    this.hotelService.getHotelImages(this.id).subscribe({
      next: (images) => {
        this.images =[...this.images, ...images];
        console.log("Hotel images loaded:");
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching hotel images:', err);
      }

    });

  }
  selectImage(image: string): void {
    this.selectedImage = image;
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  // ngOnDestroy(): void {
  //   this.sub?.unsubscribe();
  // }

}
