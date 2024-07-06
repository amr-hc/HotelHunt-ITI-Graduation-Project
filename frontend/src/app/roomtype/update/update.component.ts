import { Component } from '@angular/core';
import { RoomtypeService } from '../../services/roomtype.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomType2 } from '../../models/roomtype2';

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
  hotel = new RoomType2();
  selectedFile: File | null = null;

  constructor(private serv: RoomtypeService, private activeRoute: ActivatedRoute, private router: Router) {
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.serv.getById(this.id).subscribe(
      (data: any) => {
        this.hotel = data;
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp'];
    const maxSize = 10 * 1024 * 1024; // 5 MB limit

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        this.message = 'Invalid file type. Please upload an image file (jpeg, png, jpg, gif, bmp).';
        this.selectedFile = null;
        return;
      }

      if (file.size > maxSize) {
        this.message = 'File size exceeds 10MB. Please upload a smaller image.';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.message = '';
    } else {
      this.selectedFile = null;
      this.message = 'Please upload a valid image file.';
    }
  }

  update() {
    if (!this.hotel.name || !isNaN(Number(this.hotel.name))) {
      this.message = 'Type must be a string.';
      return;
    }
    if (isNaN(Number(this.hotel.price)) || this.hotel.price <= 0) {
      this.message = 'Price must be a valid positive number.';
      return;
    }
    if (isNaN(Number(this.hotel.price)) || this.hotel.price > 100000) {
      this.message = 'Price cannot exceed 100,000';
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
      this.message = 'Capacity cannot be larger than 12';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.hotel.name);
    formData.append('price', this.hotel.price.toString());
    formData.append('description', this.hotel.description);
    formData.append('capacity', this.hotel.capacity.toString());
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.serv.put(this.id, formData).subscribe(
      (data: any) => {
        this.message = 'Update Room Type Successfully';
        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/owner/list']);
        }, 1000);
      },
      (error) => {
        console.error('Error updating room type:', error);
        this.message = 'The selected hotel id is invalid. Please try again.';
      }
    );
  }
}
