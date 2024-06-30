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

@Component({
  selector: 'app-search-hotels',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,LayoutComponent,HeaderComponent,NgxPaginationModule],
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
  imagePath ="http://127.0.0.1:8000/storage/"
  private searchSubscription: Subscription | null = null;
  isLoading: boolean = true;
  averageRating: number = 0;
  currentPage: number = 1;
  cityError: string = '';
  checkinDateError: string = '';
  checkoutDateError: string = '';
  dateError: string = '';
  private subscriptions: Subscription[] = [];


  constructor(private searchHotelService: SearchHotelService,private router: Router) { }
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

      if (checkin > checkout) {
        this.dateError = 'Check-in date cannot be later than check-out date';
        isValid = false;
      } else {
        this.dateError = '';
      }
    }

    return isValid;
  }
  ngOnInit(): void {
    const today = new Date().toISOString().substr(0, 10); // Get today's date in yyyy-mm-dd format
    this.subscriptions.push(
      this.searchHotelService.searchedCity$.subscribe(city => this.city = city || 'cairo'),
      this.searchHotelService.searchedCheckInDate$.subscribe(date => this.checkinDate = date || today),
      this.searchHotelService.searchedCheckOutDate$.subscribe(date => this.checkoutDate = date || today),
      this.searchHotelService.sortBy$.subscribe(sort => this.sort = sort || 'none')
    );
    // this.isLoading = true;
    // Trigger search on init if all parameters are available
    if (this.city && this.checkinDate && this.checkoutDate) {
      this.onSearch();
      // this.isLoading = false;
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 300);


    // const today = new Date().toISOString().substr(0, 10); // Get today's date in yyyy-mm-dd format
    // this.checkinDate = today;
    // this.checkoutDate = today;
    // this.city = 'cairo';
    // // this.onSearch();
  }

  onSearch() {
    if (!this.validateForm()) {
      return;
    }
    const searchParams = {
      city: this.city,
      start_date: this.checkinDate,
      end_date: this.checkoutDate,
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
        // this.isLoading = true;

      },
      (error: any) => {
        console.error('Error fetching hotels', error);
      }
    );

    // this.isLoading = true;
  }
  navigateToHotel(hotelId: number): void {
    this.searchHotelService.setSearchCheckInDate(this.checkinDate);
    this.searchHotelService.setSearchCheckOutDate(this.checkoutDate);
    this.router.navigate(['/hotel', hotelId]);
  }
  ngOnDestroy(): void {
    // Clean up the subscription if needed
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

  }
}
