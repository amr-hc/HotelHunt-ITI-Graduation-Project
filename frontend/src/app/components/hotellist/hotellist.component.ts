import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { HotelService } from '../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { HeaderComponent } from '../../layouts/header/header.component';
import { SliderComponent } from '../../layouts/slider/slider.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hotellist',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule, HeaderComponent, SliderComponent, FooterComponent],
  templateUrl: './hotellist.component.html',
  styleUrls: ['./hotellist.component.css']
})
export class HotellistComponent implements OnInit, OnDestroy {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentPage: number = 1;
  private subscriptions: Subscription[] = [];

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.getAllHotels();
  }



  getAllHotels(): void {
    const hotelsSubscription = this.hotelService.getAllHotels().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.hotels = response.data;
        this.filteredHotels = this.hotels.filter((hotel) => hotel.status === 'active');
        if (this.hotels.length === 0) {
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      },
      (error: any) => {
        this.errorMessage = 'Failed to fetch hotels.';
        console.error('Error fetching hotels:', error);
        this.isLoading = false;
      }
    );
    this.subscriptions.push(hotelsSubscription);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
