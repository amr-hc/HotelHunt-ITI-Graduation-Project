import { Component, OnInit } from '@angular/core';
import { HotelsService } from '../../services/hotels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-hotel',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register-hotel.component.html',
  styleUrl: './register-hotel.component.css',
})
export class RegisterHotelComponent{
  hotelData = {
    name: '',
    country: '',
    city: '',
    address: '',
    // status: '',
    owner_id: '',
    description: '',
    star_rating: 1,
  };
  registrationError: string | null = null;

  constructor(private hotelService: HotelsService, private router: Router, private activatedRoute:ActivatedRoute) {}



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.hotelData.owner_id = params['owner_id'];
    });
  }

  onRegisterHotel() {
    this.hotelService.registerHotel(this.hotelData).subscribe(
      (res) => {
        console.log('Hotel registered successfully', res);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration failed', error);
        if (error.error && error.error.message) {
          this.registrationError = error.error.message;
        } else {
          this.registrationError = 'Failed to register. Please try again later.';
        }
      }
    );
  }
  setRating(rating: number) {
    this.hotelData.star_rating = rating;
    // Optionally, you can update UI or perform other actions based on the selected rating
  }
}
