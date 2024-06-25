import { Component } from '@angular/core';
import { RoomtypeService } from '../../services/roomtype.service';
import { RoomType } from '../../models/roomtype';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent {
  hotel = new RoomType();
  message = '';

  constructor(private serv: RoomtypeService, private router: Router) {} // Inject Router

  create() {
    
    // Validate the fields before making the API call
    if (!this.hotel.name || !isNaN(Number(this.hotel.name))) {
      this.message = 'Type must be a string.';
      return;
    }
    if (isNaN(Number(this.hotel.price)) || this.hotel.price <= 0) {
      this.message = 'Price must be a valid positive number.';
      return;
    }
    if (!this.hotel.description || this.hotel.description.length < 10) {
      this.message = 'Description must be at least 10 characters long.';
      return;
    }
    if (isNaN(Number(this.hotel.capacity)) || this.hotel.capacity <= 0) {
      this.message = 'Capacity must be a valid positive number.';
      return;
    }


    this.serv.post(this.hotel).subscribe(
      (data: any) => {
        console.log(data);
        this.message = 'Create Room Type Successfully!';
        setTimeout(() => {
          this.message = '';
          
          this.router.navigate(['/list']); 
        }, 1000);
      },
      (error) => {
        console.error('Error creating room type:', error);
        // Display the first error message from the backend
        if (error.error && error.error.hotel_id) {
          this.message = error.error.hotel_id[0]; // Assuming the error is returned in this format
        } else {
          this.message = 'The selected hotel id is invalid. Please try again.';
        }
      }
    );
  }
}
