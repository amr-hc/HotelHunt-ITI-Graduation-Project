import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../../models/hotel';
import { HotelsService } from '../../../services/hotels.service';
import { HotelService } from '../../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-listhotels',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './listhotels.component.html',
  styleUrl: './listhotels.component.css'
})
export class ListhotelsComponent implements OnInit {
  topRatedHotels: Hotel[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentPage: number =1;

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.getAllTopRatedHotels();
  }

  getAllTopRatedHotels(): void {
    this.hotelService.getAllHotels().subscribe(
      (response: any) => {
        this.isLoading = false;
        this.topRatedHotels = response.data.filter((hotel: Hotel) => hotel.isFeatured == true);
        console.log(this.topRatedHotels);
        if (this.topRatedHotels.length === 0) {
          this.errorMessage = 'No top-rated hotels found.';
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to fetch top-rated hotels.';
        console.error('Error fetching hotels:', error);
      }
    );
  }
}
