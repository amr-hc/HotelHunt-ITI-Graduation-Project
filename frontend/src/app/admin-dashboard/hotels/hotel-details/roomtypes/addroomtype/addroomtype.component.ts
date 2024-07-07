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
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9]+(?:[ '-][a-zA-Z0-9]+)*$/),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
          Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'.\-_]*$/),
        ],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(999999.0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      hotel_id: ['', Validators.required],
      capacity: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(12),
          Validators.pattern('^\\d+$'),
        ],
      ],
      photo: [null, [this.validateImageFile, Validators.required]],
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.roomTypeForm.patchValue({ photo: file });
      this.roomTypeForm.get('photo')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.roomTypeForm.valid) {
      const formData = new FormData();
      formData.append('name', this.roomTypeForm.get('name')?.value);
      formData.append(
        'description',
        this.roomTypeForm.get('description')?.value
      );
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
          this.router.navigate([
            `admin-dashboard/hotels/${this.hotelId}/rooms`,
          ]);
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

  validateImageFile(control: any) {
    const file = control.value;
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        return { invalidImageType: true };
      }
      if (file.size > 2048 * 1024) {
        return { invalidImageSize: true };
      }
    }
    return null;
  }
}
