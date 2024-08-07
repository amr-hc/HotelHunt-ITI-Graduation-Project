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
  selectedFile: File | null = null;

  constructor(private serv: RoomtypeService, private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png','image/jpg', 'image/gif', 'image/bmp'];

    if (file && allowedTypes.includes(file.type)) {
      this.selectedFile = file;
      this.message = '';
    } else {
      this.selectedFile = null;
      this.message = 'Please upload a valid image file (jpeg, png, gif,jpg, bmp).';
    }
  }

  create() {
    // Validate the fields before making the API call
    if (!this.hotel.name || /^\d+$/.test(this.hotel.name)) {
      this.message = 'Type must be a string.';
      return;
    }
    if (isNaN(Number(this.hotel.price)) || this.hotel.price <= 0) {
      this.message = 'Price must be a valid positive number.';
      return;
    }
    if (isNaN(Number(this.hotel.price)) || this.hotel.price > 100000) {
      this.message = 'Price can not exceed 100,000';
      return;
    }
    if (!this.hotel.description || this.hotel.description.length < 8) {
      this.message = 'Description must be at least 8 characters long.';
      return;
    }
    if (isNaN(Number(this.hotel.capacity)) || this.hotel.capacity <= 0) {
      this.message = 'Capacity must be a valid positive number.';
      return;
    }
    if (isNaN(Number(this.hotel.capacity)) || this.hotel.capacity > 12) {
      this.message = 'Capacity can not be larger than 12';
      return;
    }
    if (!this.selectedFile) {
      this.message = 'Please select an image file.';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.hotel.name);
    formData.append('price', this.hotel.price.toString());
    formData.append('description', this.hotel.description);
    formData.append('capacity', this.hotel.capacity.toString());
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.serv.post(formData).subscribe(
      (data: any) => {
        this.message = 'Create Room Type Successfully!';
        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/owner/list']);
        }, 1000);
      },
      (error) => {
        if (error.error && error.error.hotel_id) {
          this.message = error.error.hotel_id[0];
        } else {
          this.message = 'An error occurred. Please try again.';
        }
      }
    );
  }
}
