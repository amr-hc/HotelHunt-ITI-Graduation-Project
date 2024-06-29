import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchHotelService } from '../../../services/search-hotel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit, OnDestroy {
  city: string = '';
  checkinDate: string = '';
  checkoutDate: string = '';
  sort: string = 'none';
  cityError: string = '';
  checkinDateError: string = '';
  checkoutDateError: string = '';
  dateError: string = '';
  constructor(private searcHotelService: SearchHotelService, private router: Router) { }
  validateForm(): boolean {
    let isValid = true;

    if (!this.city) {
      this.cityError = 'City is required';
      isValid = false;
    } else {
      this.cityError = '';
    }

    if (!this.checkinDate) {
      this.checkinDateError = 'Check-in date is required';
      isValid = false;
    } else {
      this.checkinDateError = '';
    }

    if (!this.checkoutDate) {
      this.checkoutDateError = 'Check-out date is required';
      isValid = false;
    } else {
      this.checkoutDateError = '';
    }
    if (this.checkinDate && this.checkoutDate) {
      const checkin = new Date(this.checkinDate);
      const checkout = new Date(this.checkoutDate);

      if (checkin > checkout) {
        this.dateError = 'Check-in date cannot be later than check-out date';
        isValid = false;
      } else {
        this.dateError = '';
      }
    }

    return isValid;
  }
  ngOnInit(): void {
    const today = new Date().toISOString().substr(0, 10); // Get today's date in yyyy-mm-dd format
    this.checkinDate = today;
    this.checkoutDate = today;
    this.city = 'cairo';
  }
  onSearch() {
    console.log(this.city, this.checkinDate, this.checkoutDate, this.sort);
    if (!this.validateForm()) {
      return;
    }
    this.searcHotelService.setSearchCheckInDate(this.checkinDate);
    this.searcHotelService.setSearchCheckOutDate(this.checkoutDate);
    this.searcHotelService.setSearchCity(this.city);
    this.searcHotelService.setSearchSortBy(this.sort);
    this.router.navigate(['/search']);

  }
  ngOnDestroy(): void {
  }

}
