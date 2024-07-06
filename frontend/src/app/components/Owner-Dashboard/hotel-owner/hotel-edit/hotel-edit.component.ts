import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../../services/hotel.service';
import { Hotel } from '../../../../models/hotel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './hotel-edit.component.html',
  styleUrl: './hotel-edit.component.css'
})
export class HotelEditComponent implements OnInit {
  hotel: Hotel | null = null;
  hotelForm: FormGroup;
  selectedFile: File | null = null;
  imageError: string | null = null;

  constructor(
    private activateRoute: ActivatedRoute,
    private hotelService: HotelService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.hotelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      status: ['', Validators.required],
      description: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    const id = Number(this.activateRoute.snapshot.paramMap.get('id'));
    this.hotelService.getHotelById(id).subscribe((response: any) => {
      this.hotel = response.data;
      this.populateForm();
    });
  }

  populateForm(): void {
    if (this.hotel) {
      this.hotelForm.patchValue({
        name: this.hotel.name,
        city: this.hotel.city,
        country: this.hotel.country,
        address: this.hotel.address,
        status: this.hotel.status,
        description: this.hotel.description
      });
    }
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (this.validateImage(file)) {
        this.selectedFile = file;
        this.imageError = null;
      } else {
        this.selectedFile = null;
      }
    }
  }
  validateImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif, image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      this.imageError = 'Only JPEG, PNG, GIF and JPG formats are allowed.';
      return false;
    }

    if (file.size > maxSize) {
      this.imageError = 'Image size should not exceed 2MB.';
      return false;
    }

    return true;
  }

  save(): void {
    if (this.hotelForm.valid && this.hotel) {
      const formData = new FormData();
      formData.append('name', this.hotelForm.get('name')?.value);
      formData.append('city', this.hotelForm.get('city')?.value);
      formData.append('country', this.hotelForm.get('country')?.value);
      formData.append('address', this.hotelForm.get('address')?.value);
      formData.append('status', this.hotelForm.get('status')?.value);
      formData.append('description', this.hotelForm.get('description')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.hotelService.updateHotel(formData, this.hotel.id).subscribe(
        response => {
          console.log('Hotel updated successfully:', response.message);
          this.router.navigate(['/owner/hotel']);
        },
        error => {
          console.error('Error updating hotel:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
