import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HotelsService } from '../../../services/hotels.service';
import { Hotel } from '../../../models/hotel';
import { HotelService } from '../../../services/hotel.service';

@Component({
  selector: 'app-ownersdetails',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './ownersdetails.component.html',
  styleUrl: './ownersdetails.component.css'
})

export class OwnersdetailsComponent implements OnInit {
  user: User | undefined;
  hotels: Hotel[] = [];
  isLoading: boolean = true;
  hotelsLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.fetchUserDetails(+userId);
      this.fetchAllHotels(+userId);
    }
  }

  private fetchUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (response: any) => {
        this.user = response.data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching user details', error);
      }
    );
  }

  private fetchAllHotels(ownerId: number): void {
    this.hotelService.getAllHotels().subscribe(
      (response: any) => {
        this.hotels = response.data.filter((hotel: Hotel) => hotel.owner_id === ownerId);
        this.hotelsLoading = false;
      },
      (error) => {
        this.hotelsLoading = false;
        console.error('Error fetching hotels', error);
      }
    );
  }
}
