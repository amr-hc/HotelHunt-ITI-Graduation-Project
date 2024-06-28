import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../../models/hotel';
import { HotelsService } from '../../../services/hotels.service';
import { HotelService } from '../../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-nearhotels',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './nearhotels.component.html',
  styleUrl: './nearhotels.component.css'
})
export class NearhotelsComponent {

  showComponent: boolean = false;
  topRatedHotels: Hotel[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentPage: number =1;
  city : string ='';

  constructor(private hotelService: HotelService,private http: HttpClient) { }



  getAllTopRatedHotels(): void {
    this.hotelService.getHotelsByCity(this.city).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.topRatedHotels = response;
        console.log(this.topRatedHotels);
        if (this.topRatedHotels.length === 0) {
          this.errorMessage = 'No hotels in your city.';
          this.showComponent=false;
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to fetch top-rated hotels.';
        console.error('Error fetching hotels:', error);
      }
    );
  }

  ngOnInit() {
    this.getLocation();
    
    
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => this.showPosition(position),
        error => this.showError(error)
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position: GeolocationPosition) {
    this.showComponent= true;
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("Latitude: " + latitude + ", Longitude: " + longitude);
    this.getCity(latitude, longitude);
  }

  showError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
 
    }
  }

  getCity(latitude: number, longitude: number) {
    console.log(latitude,longitude);
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    this.http.get<any>(url).subscribe(
      (data :any)  => {
        this.city = this.cleanEnglish(data.city) || "country not found";
        console.log("gps city: " + this.city);
        this.setCookie("city", this.city, 5);
        this.getAllTopRatedHotels();
        
      },
      (error :any) => console.error('Error:', error)
    );
  }

  setCookie(cookieName :string, cookieValue :any, expirationDays :number) {
    var d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  }

  cleanEnglish(text: string): string {
    const map: { [key: string]: string } = {
        'ḩ': 'h',
        'ā': 'a',
        'á': 'a',
        'í': 'i',
        'ū': 'u',
        'č': 'ch',
        'š': 'sh',
        'ž': 'zh',
        'ʼ': '',
    };

    return text.replace(/[ḩāáíūčšžʼ]/g, (match: string) => map[match] || match);
  }

  

}
