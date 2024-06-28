import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHotel } from '../../models/searchHotel';
import { SearchHotelService } from '../../services/search-hotel.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutComponent } from '../../layout/layout.component';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-search-hotels',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,LayoutComponent,HeaderComponent],
  templateUrl: './search-hotels.component.html',
  styleUrl: './search-hotels.component.css'
})
export class SearchHotelsComponent implements OnInit, OnDestroy {
  city: string = '';
  checkinDate: string = '';
  checkoutDate: string = '';
  sort: string = 'none';
  result: { hotel_name: string, roomsAvailable: number, hotels: SearchHotel[] }[] = [];
  imagePath ="http://127.0.0.1:8000/storage/"
  private searchSubscription: Subscription | null = null;
  isLoading: boolean = false;
  averageRating: number = 0;

  constructor(private searchHotelService: SearchHotelService) { }

  ngOnInit(): void {
    const today = new Date().toISOString().substr(0, 10); // Get today's date in yyyy-mm-dd format
    this.checkinDate = today;
    this.checkoutDate = today;
    this.city = 'cairo';
    // this.onSearch();
  }

  onSearch() {
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
  averageRateAsNumber(average_rate: string): number {
    return parseFloat(average_rate); // You can also use Number(average_rate)
  }
  ngOnDestroy(): void {
    // Clean up the subscription if needed
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
