import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HotelService } from '../../../services/hotel.service';
import { User } from '../../../models/user';
import { Hotel } from '../../../models/hotel';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  users: User[] = [];
  hotels: Hotel[]=[];
  totalHotels: number = 0;
  totalGuestUsers: number = 0;

  constructor(private userService: UserService, private hotelService: HotelService) { }

  ngOnInit(): void {
    this.getAllHotels();
    this.getAllGuestUsers();
  }

  getAllHotels(): void {
    this.hotelService.getAllHotels().subscribe((response:any) => {
      this.hotels=response.data;
      this.totalHotels = this.hotels.filter(hotel => hotel.status === 'active').length;
    });
  }

  getAllGuestUsers(): void {
    this.userService.getAllUsers().subscribe((response:any) => {
      this.users = response.data;
      this.totalGuestUsers = this.users.filter(user => user.role === 'guest').length;
    });
  }

}
