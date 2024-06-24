import { Component } from '@angular/core';
import { RoomtypeService } from '../../services/roomtype.service';
import { RoomType } from '../../models/roomtype';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent {
  id!: any;
  message = '';
  hotel = new RoomType();

  constructor(private serv: RoomtypeService, private activeRoute: ActivatedRoute, private router: Router) { // Inject Router
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.serv.getById(this.id).subscribe(
      (data: any) => {
        this.hotel = data;
      }
    );
  }

  update() {
    // Validate the fields before making the API call
    if (!this.hotel.name || !isNaN(Number(this.hotel.name))) {
      this.message = 'Type must be a string.';
      return;
    }
    if (isNaN(Number(this.hotel.hotel_id)) || this.hotel.hotel_id <= 0) {
      this.message = 'Hotel ID must be a valid positive number.';
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

    this.serv.put(this.id, this.hotel).subscribe(
      (data: any) => {
        this.message = 'Update Room Type Successfully';

        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/list']); // Navigate to list after update
        }, 1000);
      },
      (error) => {
        console.error('Error updating room type:', error);
        this.message = 'The selected hotel id is invalid. Please try again.';
      }
    );
  }
}
