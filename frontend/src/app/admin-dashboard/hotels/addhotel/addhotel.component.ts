import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../models/user';
import { HotelService } from '../../../services/hotel.service';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Hotel } from '../../../models/hotel';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../services/location.service';
import { CityService } from '../../../services/city.service';
import { HotelsService } from '../../../services/hotels.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addhotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './addhotel.component.html',
  styleUrls: ['./addhotel.component.css'],
})
export class AddhotelComponent implements OnInit, OnDestroy {
  owners: User[] = [];
  noOwnersAvailable: boolean = false;
  registerForm: FormGroup;
  registrationError: string | null = null;
  countries: any[] = [];
  cities: string[] = [];
  showAddCityInput = false;
  newCity = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelsService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private locationService: LocationService,
    private cityService: CityService
  ) {
    this.registerForm = this.fb.group({
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
      owner_id: ['', Validators.required],
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
      image: [null, [this.validateImageFile, Validators.required]],
    });
  }

  ngOnInit(): void {
    const ownersSub = this.userService.getOwnersWithoutHotels().subscribe({
      next: (response: any) => {
        console.log('Response from getOwnersWithoutHotels:', response);
        if (response && response.data && Array.isArray(response.data)) {
          this.owners = response.data;
        } else {
          this.owners = [];
        }

        if (this.owners.length === 0) {
          this.noOwnersAvailable = true;
        }
      },
      error: (error) => {
        console.error('Error fetching owners', error);
        this.noOwnersAvailable = true;
      },
    });
    this.subscription.add(ownersSub);

    const countriesSub = this.locationService.getCountries().subscribe((data) => {
      this.countries = data;
    });
    this.subscription.add(countriesSub);
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.registerForm.patchValue({ image: file });
      this.registerForm.get('image')?.updateValueAndValidity();
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
      formData.append(
        'star_rating',
        this.registerForm.value.star_rating.toString()
      );
      if (this.registerForm.value.status) {
        formData.append('status', this.registerForm.value.status);
      }
      if (this.registerForm.value.image) {
        formData.append('image', this.registerForm.value.image);
      }

      const registerSub = this.hotelService.registerHotel(formData).subscribe(
        (res) => {
          console.log('Hotel registered successfully', res);
          this.router.navigate(['/admin-dashboard/hotels']);
        },
        (error) => {
          console.error('Registration failed', error);
          if (error.error && error.error.message) {
            this.registrationError = error.error.message;
          } else {
            this.registrationError =
              'Failed to register. Please try again later.';
          }
        }
      );
      this.subscription.add(registerSub);
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCountryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCountryName = selectElement.value;
    const selectedCountry = this.countries.find(
      (c) => c.name.common === selectedCountryName
    );
    if (selectedCountry) {
      const citiesSub = this.cityService
        .getCities(selectedCountry.cca2)
        .subscribe((data: any) => {
          this.cities = data.data.map((city: any) => city.name);
        });
      this.subscription.add(citiesSub);
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

  get role() {
    return this.registerForm.get('role');
  }

  shouldShowError(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control && control.touched && control.invalid;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
