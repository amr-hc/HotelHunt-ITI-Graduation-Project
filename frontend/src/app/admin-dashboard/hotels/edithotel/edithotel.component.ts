import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Hotel } from '../../../models/hotel';
import { HotelsService } from '../../../services/hotels.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../services/location.service';
import { CityService } from '../../../services/city.service';

@Component({
  selector: 'app-edithotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './edithotel.component.html',
  styleUrl: './edithotel.component.css',
})
export class EdithotelComponent {
  editForm: FormGroup;
  hotelId: number | null = null;
  hotel: Hotel | null = null;
  formSubmitted: boolean = false;
  selectedFile: File | null = null;
  errorMessage = '';
  countries: any[] = [];
  cities: string[] = [];
  showAddCityInput = false;
  newCity = '';

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private cityService: CityService
  ) {
    this.editForm = this.fb.group({
      id: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9]+(?:[ '-][a-zA-Z0-9]+)*$/),
        ],
      ],
      country: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(255)]],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
          Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'\-_]*$/),
        ],
      ],
      status: [''],
      description: [
        '',
        [
          Validators.minLength(8),
          Validators.maxLength(255),
          Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s,'\-_]*$/),
        ],
      ],
      star_rating: ['', Validators.required],
      image: [''],
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
    this.locationService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.editForm.valid) {
      const formData = new FormData();
      Object.keys(this.editForm.controls).forEach((key) => {
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
          this.router.navigate(['/admin-dashboard/hotels/' + this.hotelId]);
        },
        (error) => {
          console.log(error);
          if (error.status === 422 && error.error.errors) {
            this.errorMessage = '';
            Object.keys(error.error.errors).forEach((field) => {
              const fieldErrors = error.error.errors[field];
              if (Array.isArray(fieldErrors)) {
                fieldErrors.forEach((errorText) => {
                  this.errorMessage += `${errorText}\n`;
                });
              }
            });
          } else {
            this.errorMessage = 'Failed to edit hotel. Please try again.';
          }
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

  onCountryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCountryName = selectElement.value;
    const selectedCountry = this.countries.find(
      (c) => c.name.common === selectedCountryName
    );
    if (selectedCountry) {
      this.cityService
        .getCities(selectedCountry.cca2)
        .subscribe((data: any) => {
          this.cities = data.data.map((city: any) => city.name);
        });
    }
  }

  onCityChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCity = selectElement.value;
    if (selectedCity === 'Other') {
      this.showAddCityInput = true;
    } else {
      this.showAddCityInput = false;
      this.editForm.patchValue({ city: selectedCity });
    }
  }

  addNewCity() {
    if (this.newCity.trim()) {
      this.cities.push(this.newCity.trim());
      this.editForm.patchValue({ city: this.newCity.trim() });
      this.newCity = '';
      this.showAddCityInput = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin-dashboard/hotels']);
  }
}
