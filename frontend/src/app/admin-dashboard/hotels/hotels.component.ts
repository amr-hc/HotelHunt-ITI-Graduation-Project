import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { HotelService } from '../../services/hotel.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit{
  hotels: Hotel[] = [];

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.hotelService.getAllHotels().subscribe(response => {
      this.hotels = response.data;
    });
  }

  saveStatus(hotel: Hotel): void {
    this.hotelService.updateHotelStatus(hotel.id, hotel.status).subscribe(updatedHotel => {
      console.log('Hotel status updated:', updatedHotel);
    });
  }
}
