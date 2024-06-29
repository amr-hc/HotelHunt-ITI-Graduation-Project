import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Hotel } from '../../../models/hotel';
import { HotelsService } from '../../../services/hotels.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edithotel',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './edithotel.component.html',
  styleUrl: './edithotel.component.css'
})
export class EdithotelComponent {
  editForm: FormGroup;
  hotelId: number | null = null;
  hotel: Hotel | null = null;
  formSubmitted: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      country: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(255)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      status: [''],
      description: [''],
      star_rating: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.hotelId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.hotelId) {
      this.hotelService.getHotelById(this.hotelId).subscribe(
        (response: any) => {
          this.hotel = response.data;
          console.log(this.hotel);
          if (this.hotel) {
            this.editForm.patchValue(this.hotel);
            this.editForm.get('image')?.setValue(this.hotel.image);
          }
        },
        (error) => {
          console.error('Error fetching hotel details', error);
        }
      );
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.editForm.valid) {
      const formData = new FormData();
      Object.keys(this.editForm.controls).forEach(key => {
        if (key !== 'image' || this.selectedFile) {
          formData.append(key, this.editForm.get(key)?.value);
        }
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      // Log FormData content for debugging
      console.log('Submitting the following FormData:');
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      this.hotelService.editHotel(formData).subscribe(
        (response) => {
          console.log('hotel updated successfully', response);
          this.router.navigate(['/admin-dashboard/hotels/'+ this.hotelId]);
        },
        (error) => {
          console.error('Error updating hotel', error);
        }
      );
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.isImageFile(file)) {
        this.selectedFile = file;
        this.editForm.get('image')?.setValue(file);
        console.log('Selected file:', file);
      } else {
        console.error('The selected file is not an image.');
        this.selectedFile = null;
        this.editForm.get('image')?.setErrors({ invalidFileType: true });
      }
    }
  }

  isImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  onCancel(): void {
    this.router.navigate(['/admin-dashboard/hotels']);
  }

}
