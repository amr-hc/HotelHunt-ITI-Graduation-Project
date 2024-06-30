import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoomtypeService } from '../../../../../services/roomtype.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addroomtype',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './addroomtype.component.html',
  styleUrl: './addroomtype.component.css',
})
export class AddroomtypeComponent implements OnInit {
  roomTypeForm: FormGroup;
  selectedFile: File | null = null;
  hotelId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private roomtypeService: RoomtypeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roomTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      hotel_id: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      photo: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.hotelId = Number(id);
        if (!isNaN(this.hotelId)) {
          this.roomTypeForm.patchValue({ hotel_id: this.hotelId });
        }
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.roomTypeForm.patchValue({
        photo: this.selectedFile,
      });
    }
  }

  onSubmit(): void {
    if (this.roomTypeForm.valid) {
      const formData = new FormData();
      formData.append('name', this.roomTypeForm.get('name')?.value);
      formData.append('description', this.roomTypeForm.get('description')?.value);
      formData.append('price', this.roomTypeForm.get('price')?.value);
      formData.append('capacity', this.roomTypeForm.get('capacity')?.value);
      if (this.hotelId) {
        formData.append('hotel_id', this.hotelId.toString());
      }
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      this.roomtypeService.post(formData).subscribe(
        (response) => {
          console.log('Room type added successfully', response);
          this.router.navigate([`admin-dashboard/hotels/${this.hotelId}/rooms`]);
        },
        (error) => {
          console.error('Error adding room type', error);
        }
      );
    } else {
      console.warn('Form is invalid');
      this.roomTypeForm.markAllAsTouched();
    }
  }
}
