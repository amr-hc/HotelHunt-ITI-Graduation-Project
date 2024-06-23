import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHotel } from '../../models/searchHotel';
import { SearchHotelService } from '../../services/search-hotel.service';

@Component({
  selector: 'app-search-hotels',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './search-hotels.component.html',
  styleUrl: './search-hotels.component.css'
})
export class SearchHotelsComponent {
  city: string = '';
  checkinDate: string = '';
  checkoutDate: string = '';
  result: { hotel_name: string, roomsAvailable: number, hotels: SearchHotel[] }[] = [];

  constructor(private searchHotelService: SearchHotelService) { }

  onSearch() {
    const searchParams = {
      city: this.city,
      start_date: this.checkinDate,
      end_date: this.checkoutDate
    };

    this.searchHotelService.getAllHotels(searchParams).subscribe(
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
}
