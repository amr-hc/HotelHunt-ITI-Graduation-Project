import { Component } from '@angular/core';
import { RoomtypeService } from '../../services/roomtype.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
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

  constructor(private serv: RoomtypeService, private activeRoute: ActivatedRoute, private router: Router) { // Inject Router
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.serv.getById(this.id).subscribe(
      (data: any) => {
        this.hotel = data;
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  update() {
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
