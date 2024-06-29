import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { Hotel } from '../../../models/hotel';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.css'
})
export class HotelDetailsComponent implements OnInit {
  hotel: Hotel | undefined;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const hotelId = Number(params.get('id'));
      this.loadHotel(hotelId);
    });
  }

  loadHotel(hotelId: number): void {
    this.hotelService.getHotelById(hotelId).subscribe(
      (response: { data: Hotel }) => {
        this.hotel = response.data;
        console.log(this.hotel);
      },
      (error: any) => {
        console.error('Failed to fetch hotel details', error);
      }
    );
  }

}
