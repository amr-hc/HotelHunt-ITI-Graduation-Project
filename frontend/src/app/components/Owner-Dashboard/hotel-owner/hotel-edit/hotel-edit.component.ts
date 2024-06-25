import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../../services/hotel.service';
import { Hotel } from '../../../../models/hotel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-edit',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './hotel-edit.component.html',
  styleUrl: './hotel-edit.component.css'
})
export class HotelEditComponent implements OnInit {
  hotel: Hotel | null = null;
  hotelForm: FormGroup;
  constructor(
    private activateRoute: ActivatedRoute,
    private hotelService: HotelService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.hotelForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      country: ['',Validators.required],
      address: ['', Validators.required],
      status: ['', Validators.required],
      description: ['']
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

  save(): void {
    if (this.hotelForm.valid && this.hotel) {
      const updatedHotel = {
        name: this.hotelForm.get('name')?.value,
        city: this.hotelForm.get('city')?.value,
        country: this.hotelForm.get('country')?.value,
        address: this.hotelForm.get('address')?.value,
        status: this.hotelForm.get('status')?.value,
        description: this.hotelForm.get('description')?.value
      };

      this.hotelService.updateHotel(updatedHotel, this.hotel.id).subscribe(
        response => {
          console.log('Hotel updated successfully:', response.message);
          this.router.navigate(['/owner/hotel']);
        },
        error => {
          console.error('Error updating hotel:', error);
        }
      );
    }
  }

  



}
