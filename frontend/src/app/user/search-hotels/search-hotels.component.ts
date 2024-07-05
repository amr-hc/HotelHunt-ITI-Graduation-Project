import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHotel } from '../../models/searchHotel';
import { SearchHotelService } from '../../services/search-hotel.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutComponent } from '../../layout/layout.component';
import { HeaderComponent } from '../../layouts/header/header.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { trigger, transition, style, animate } from '@angular/animations';
import { FooterComponent } from '../../layouts/footer/footer.component';

@Component({
  selector: 'app-search-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LayoutComponent, HeaderComponent, NgxPaginationModule,FooterComponent],
  templateUrl: './search-hotels.component.html',
  styleUrl: './search-hotels.component.css',
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
export class SearchHotelsComponent implements OnInit, OnDestroy {
  city: string = '';
  checkinDate: string = '';
  checkoutDate: string = '';
  sort: string = 'none';
  result: { hotel_name: string, roomsAvailable: number, hotels: SearchHotel[] }[] = [];
  imagePath = "http://127.0.0.1:8000/storage/";
  private searchSubscription: Subscription | null = null;
  isLoading: boolean = true;
  averageRating: number = 0;
  currentPage: number = 1;
  cityError: string = '';
  checkinDateError: string = '';
  checkoutDateError: string = '';
  dateError: string = '';
  private subscriptions: Subscription[] = [];
  today: string = '';
  minCheckoutDate: string = '';
  searcherdCheckInDate: string = '';
  searcherdCheckOutDate: string = '';
  searcheCity: string = '';
  constructor(private searchHotelService: SearchHotelService, private router: Router) { }

  validateForm(): boolean {
    let isValid = true;

    if (!this.city) {
      this.cityError = 'City is required';
      isValid = false;
    } else {
      this.cityError = '';
    }

    if (!this.checkinDate) {
      this.checkinDateError = 'Check-in date is required';
      isValid = false;
    } else {
      this.checkinDateError = '';
    }

    if (!this.checkoutDate) {
      this.checkoutDateError = 'Check-out date is required';
      isValid = false;
    } else {
      this.checkoutDateError = '';
    }
    if (this.checkinDate && this.checkoutDate) {
      const checkin = new Date(this.checkinDate);
      const checkout = new Date(this.checkoutDate);
      const today = new Date(this.today);

      // Create a date object for tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      if (checkin >= checkout) {
        this.dateError = 'Check-in date cannot be later than or the same as check-out date';
        isValid = false;
      } else if (checkin < today || checkout < tomorrow) {
        this.dateError = 'Check-in date cannot be in the past and check-out date must be at least tomorrow';
        isValid = false;
      } else {
        this.dateError = '';
      }
    }

    return isValid;
  }

  ngOnInit(): void {
    // this.today = new Date().toISOString().substr(0, 10); // Get today's date in yyyy-mm-dd format
    // this.minCheckoutDate = this.today;
    const today = new Date();
    this.today = today.toISOString().substr(0, 10);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minCheckoutDate = tomorrow.toISOString().substr(0, 10);

    this.subscriptions.push(
      this.searchHotelService.searchedCity$.subscribe(city => this.city = city || 'cairo'),
      this.searchHotelService.searchedCheckInDate$.subscribe(date => this.checkinDate = date || this.today),
      this.searchHotelService.searchedCheckOutDate$.subscribe(date => this.checkoutDate = date || this.minCheckoutDate),
      this.searchHotelService.sortBy$.subscribe(sort => this.sort = sort || 'none')
    );

    if (this.city && this.checkinDate && this.checkoutDate) {
      this.onSearch();
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 1200);
  }

  onSearch() {
    if (!this.validateForm()) {
      return;
    }
    const checkout = new Date(this.checkoutDate);
    checkout.setDate(checkout.getDate() - 1);
    const adjustedCheckoutDate = checkout.toISOString().substr(0, 10);
    const searchParams = {
      city: this.city,
      start_date: this.checkinDate,
      end_date: adjustedCheckoutDate,
      sort: this.sort
    };

    this.searchSubscription = this.searchHotelService.getAllHotels(searchParams).subscribe(
      (data: SearchHotel[]) => {
        console.log(data);

        // Group hotels by hotel_name and calculate rooms available
        const groupedHotels: { [key: string]: SearchHotel[] } = {};
        data.forEach(hotel => {
          if (!groupedHotels[hotel.hotel_name]) {
            groupedHotels[hotel.hotel_name] = [];
          }
          groupedHotels[hotel.hotel_name].push(hotel);
        });

        // Prepare result with roomsAvailable count
        this.result = Object.keys(groupedHotels).map(hotelName => ({
          hotel_name: hotelName,
          roomsAvailable: groupedHotels[hotelName].length,
          hotels: groupedHotels[hotelName]
        }));
        this.searcherdCheckInDate = this.checkinDate;
        this.searcherdCheckOutDate = this.checkoutDate;
        this.searcheCity = this.city;
      },
      (error: any) => {
        console.error('Error fetching hotels', error);
      }
    );
  }

  navigateToHotel(hotelId: number): void {
    this.searchHotelService.setSearchCheckInDate(this.searcherdCheckInDate);
    this.searchHotelService.setSearchCheckOutDate(this.searcherdCheckOutDate);
    this.router.navigate(['/hotel', hotelId]);
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onCheckinDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const checkinDate = new Date(input.value);
    checkinDate.setDate(checkinDate.getDate() + 1); // Add one day
    this.minCheckoutDate = checkinDate.toISOString().substr(0, 10);
    if (new Date(this.checkoutDate) <= checkinDate) {
      this.checkoutDate = this.minCheckoutDate; // Reset checkout date if it's invalid
    }
  }
}
