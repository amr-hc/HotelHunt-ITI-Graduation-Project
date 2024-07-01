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
  styleUrls: ['./search-bar.component.css']
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
  today: string = '';
  minCheckoutDate: string = '';

  constructor(private searchHotelService: SearchHotelService, private router: Router) { }

  ngOnInit(): void {
    const today = new Date();
    this.today = today.toISOString().substr(0, 10);
    this.checkinDate = this.today;

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minCheckoutDate = tomorrow.toISOString().substr(0, 10);
    this.checkoutDate = this.minCheckoutDate;

    this.city = 'cairo';
  }

  onCheckinDateChange(event: any) {
    const checkinDate = new Date(event.target.value);
    const nextDay = new Date(checkinDate);
    nextDay.setDate(checkinDate.getDate() + 1);
    this.minCheckoutDate = nextDay.toISOString().substr(0, 10);

    if (new Date(this.checkoutDate) <= checkinDate) {
      this.checkoutDate = this.minCheckoutDate;
    }
  }

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
      const today = new Date(this.today);

      // Create a date object for tomorrow
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      if (checkin >= checkout) {
        this.dateError = 'Check-in date cannot be later than or the same as check-out date';
        isValid = false;
      } else if (checkin < today || checkout < tomorrow) {
        this.dateError = 'Check-in date cannot be in the past and check-out date must be at least tomorrow';
        isValid = false;
      } else {
        this.dateError = '';
      }
    }

    return isValid;
  }

  onSearch() {
    if (!this.validateForm()) {
      return;
    }
    this.searchHotelService.setSearchCheckInDate(this.checkinDate);
    this.searchHotelService.setSearchCheckOutDate(this.checkoutDate);
    this.searchHotelService.setSearchCity(this.city);
    this.searchHotelService.setSearchSortBy(this.sort);
    this.router.navigate(['/search']);
  }

  ngOnDestroy(): void { }
}
