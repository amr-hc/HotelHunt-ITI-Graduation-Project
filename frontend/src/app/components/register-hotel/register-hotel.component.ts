import { Component, OnInit } from '@angular/core';
import { HotelsService } from '../../services/hotels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-register-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-hotel.component.html',
  styleUrls: ['./register-hotel.component.css'],
})
export class RegisterHotelComponent implements OnInit {
  hotelData = {
    name: '',
    country: '',
    city: '',
    address: '',
    owner_id: '',
    description: '',
    star_rating: 1,
  };
  selectedFile: File | null = null;
  registrationError: string | null = null;
  countries: any[] = [];
  cities: string[] = [];
  showAddCityInput = false;
  newCity = '';


  constructor(
    private hotelService: HotelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locationService:LocationService,
    private cityService:CityService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.hotelData.owner_id = params['owner_id'];
    });

    this.locationService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onRegisterHotel() {
    const formData = new FormData();
    formData.append('name', this.hotelData.name);
    formData.append('country', this.hotelData.country);
    formData.append('city', this.hotelData.city);
    formData.append('address', this.hotelData.address);
    formData.append('owner_id', this.hotelData.owner_id);
    formData.append('description', this.hotelData.description);
    formData.append('star_rating', this.hotelData.star_rating.toString());
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.hotelService.registerHotel(formData).subscribe(
      (res) => {
        console.log('Hotel registered successfully', res);
        this.router.navigate(['/login']);
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
  }

  setRating(rating: number) {
    this.hotelData.star_rating = rating;
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
      this.hotelData.city = selectedCity;
    }
  }

  addNewCity() {
    if (this.newCity.trim()) {
      this.cities.push(this.newCity.trim());
      this.hotelData.city = this.newCity.trim();
      this.newCity = '';
      this.showAddCityInput = false;
    }
  }
}
