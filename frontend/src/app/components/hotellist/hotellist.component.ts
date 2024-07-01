import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { HotelsService } from '../../services/hotels.service';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from '../../layouts/header/header.component';
import { SliderComponent } from '../../layouts/slider/slider.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { RouterModule } from '@angular/router';
import { HotelImage } from '../../models/hotelImage';

@Component({
  selector: 'app-hotellist',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, HeaderComponent, SliderComponent, FooterComponent],
  templateUrl: './hotellist.component.html',
  styleUrls: ['./hotellist.component.css']
})
export class HotellistComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  hotelImages: { [key: number]: HotelImage[] } = {};
  isLoading: boolean = true;
  errorMessage: string = '';
  currentPage: number = 1;

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.getAllHotels();
  }

  getAllHotels(): void {
    this.hotelService.getAllHotels().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.hotels = response.data;
        this.filteredHotels = this.hotels.filter((hotel) => hotel.status === 'active');
        if (this.hotels.length === 0) {
          this.errorMessage = 'No hotels found.';
        } else {
          this.fetchHotelImages();
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to fetch hotels.';
        console.error('Error fetching hotels:', error);
      }
    );
  }

  fetchHotelImages(): void {
    this.hotels.forEach(hotel => {
      this.hotelService.getHotelImages(hotel.id).subscribe(
        (images: HotelImage[]) => {
          this.hotelImages[hotel.id] = images;
        },
        (error: any) => {
          console.error(`Error fetching images for hotel ${hotel.id}:`, error);
        }
      );
    });
  }

  getStars(rate: number): string[] {
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5;
    const stars = Array(fullStars).fill('fa fa-star text-warning');
    if (halfStar) {
      stars.push('fa fa-star-half-alt text-warning');
    }
    while (stars.length < 5) {
      stars.push('fa fa-star-o text-warning');
    }
    return stars;
  }
}
