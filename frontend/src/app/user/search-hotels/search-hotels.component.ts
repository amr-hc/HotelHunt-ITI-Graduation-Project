import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHotel } from '../../models/searchHotel';
import { SearchHotelService } from '../../services/search-hotel.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-hotels',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './search-hotels.component.html',
  styleUrl: './search-hotels.component.css'
})
export class SearchHotelsComponent implements OnInit, OnDestroy {
  city: string = '';
  checkinDate: string = '';
  checkoutDate: string = '';
  result: { hotel_name: string, roomsAvailable: number, hotels: SearchHotel[] }[] = [];
  imagePath ="http://127.0.0.1:8000/storage/"
  private searchSubscription: Subscription | null = null;

  constructor(private searchHotelService: SearchHotelService) { }

  ngOnInit(): void {
  }

  onSearch() {
    const searchParams = {
      city: this.city,
      start_date: this.checkinDate,
      end_date: this.checkoutDate
    };

    this.searchSubscription = this.searchHotelService.getAllHotels(searchParams).subscribe(
      (data: SearchHotel[]) => {
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
      },
      (error: any) => {
        console.error('Error fetching hotels', error);
      }
    );
  }
  ngOnDestroy(): void {
    // Clean up the subscription if needed
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
