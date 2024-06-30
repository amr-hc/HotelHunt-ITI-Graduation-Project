import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelsService } from '../../services/hotels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { CityService } from '../../services/city.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-hotel',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './register-hotel.component.html',
  styleUrls: ['./register-hotel.component.css'],
})
export class RegisterHotelComponent implements OnInit {
  registerForm: FormGroup;
  registrationError: string | null = null;
  countries: any[] = [];
  cities: string[] = [];
  showAddCityInput = false;
  newCity = '';

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private cityService: CityService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      country: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(255)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      owner_id: ['', [Validators.required, Validators.max(100), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      status: [''], // Optional field based on Laravel rules
      description: [''], // Ensure description field is defined here
      star_rating: ['', Validators.required], // Ensure star_rating field is defined here
      image: [null, [this.validateImageFile]], // Custom validator for image
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.registerForm.patchValue({ owner_id: params['owner_id'] });
    });

    this.locationService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  validateImageFile(control: any) {
    const file = control.value;
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        return { invalidImageType: true };
      }
      if (file.size > 2048 * 1024) { // Convert to bytes
        return { invalidImageSize: true };
      }
    }
    return null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({ image: file });
    }
  }

  onRegisterHotel() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('name', this.registerForm.value.name);
      formData.append('country', this.registerForm.value.country);
      formData.append('city', this.registerForm.value.city);
      formData.append('address', this.registerForm.value.address);
      formData.append('owner_id', this.registerForm.value.owner_id);
      formData.append('description', this.registerForm.value.description);
      formData.append('star_rating', this.registerForm.value.star_rating.toString());
      if (this.registerForm.value.status) {
        formData.append('status', this.registerForm.value.status);
      }
      if (this.registerForm.value.image) {
        formData.append('image', this.registerForm.value.image);
      }

      this.hotelService.registerHotel(formData).subscribe(
        (res) => {
          console.log('Hotel registered successfully', res);
          this.router.navigate(['/owner']);
        },
        (error) => {
          console.error('Registration failed', error);
          if (error.error && error.error.message) {
            this.registrationError = error.error.message;
          } else {
            this.registrationError = 'Failed to register. Please try again later.';
          }
        }
      );
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCountryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCountryName = selectElement.value;
    const selectedCountry = this.countries.find(c => c.name.common === selectedCountryName);
    if (selectedCountry) {
      this.cityService.getCities(selectedCountry.cca2).subscribe((data: any) => {
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
      this.registerForm.patchValue({ city: selectedCity });
    }
  }

  addNewCity() {
    if (this.newCity.trim()) {
      this.cities.push(this.newCity.trim());
      this.registerForm.patchValue({ city: this.newCity.trim() });
      this.newCity = '';
      this.showAddCityInput = false;
    }
  }

  // Getter for role form control to use in template
  get role() {
    return this.registerForm.get('role');
  }

  shouldShowError(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control && control.touched && control.invalid;
  }
}
