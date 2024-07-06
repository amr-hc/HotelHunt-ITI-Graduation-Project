import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../../models/hotel';
import { HotelsService } from '../../../services/hotels.service';
import { HotelService } from '../../../services/hotel.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nearhotelscountry',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,RouterModule],
  templateUrl: './nearhotelscountry.component.html',
  styleUrl: './nearhotelscountry.component.css'
})
export class NearhotelscountryComponent {
  showComponent: boolean = true;
  topRatedHotels: Hotel[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  currentPage: number =1;
  country : string ='Egypt';

  constructor(private hotelService: HotelService,private http: HttpClient) { }



  ngOnInit() {
    this.getCountryFromIp();
  }

  getCountryFromIp(): void {
    this.http.get('https://api.bigdatacloud.net/data/client-ip')
      .subscribe((ipData: any) => {
        const ipAddress = ipData.ipString;

        this.http.get(`https://ipapi.co/${ipAddress}/json/`)
          .subscribe((geoData: any) => {
            this.country = geoData.country_name;

            this.getAllTopRatedHotels();
          }, error => {
            console.error('Error fetching country:', error);
          });
      }, error => {
        console.error('Error fetching IP address:', error);
      });
  }

  getAllTopRatedHotels(): void {
    this.hotelService.getHotelsBycountry(this.country).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.topRatedHotels = response;
        if (this.topRatedHotels.length === 0) {
          this.errorMessage = 'No hotels found in your country.';
        }
      },
      (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to fetch top-rated hotels.';
        console.error('Error fetching hotels:', error);
      }
    );
  }

  setCookie(cookieName: string, cookieValue: any, expirationDays: number) {
    const d = new Date();
    d.setTime(d.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  }


  
}
