// show-availability.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Availability {
  id: number;
  stock: number;
  date: string;
  room_type_id: number;
  room_type: string;
  hotel_id: number;
  hotel_name: string;
}

interface CalendarDay {
  date: Date;
  stock: number;
  room_type?: string;
  hotel_name?: string;
}

@Component({
  selector: 'app-show-availability',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-availability.component.html',
  styleUrls: ['./show-availability.component.css']
})
export class ShowAvailabilityComponent implements OnInit {
  availabilityData: Availability[] = [];
  calendarDays: CalendarDay[] = [];
  currentMonthValue: string = '';
  months: { value: string, label: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setupMonthOptions();
    this.fetchAvailability();
  }

  setupMonthOptions(): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const date = new Date(currentYear, currentMonth + monthOffset, 1);
      const monthLabel = date.toLocaleString('default', { month: 'long' });
      const monthValue = `${date.getFullYear()}-${date.getMonth() + 1}`;
      this.months.push({ value: monthValue, label: monthLabel });

      if (monthOffset === 0) {
        this.currentMonthValue = monthValue;
      }
    }
  }

  fetchAvailability(): void {
    this.onMonthSelect(this.currentMonthValue); // Directly call onMonthSelect with currentMonthValue
  }

  onMonthSelect(eventOrValue: Event | string): void {
    let monthValue: string;
    if (typeof eventOrValue === 'string') {
      monthValue = eventOrValue; // Handle case when directly called with a string
    } else {
      monthValue = (eventOrValue.target as HTMLSelectElement).value; // Handle case when called from event
    }

    const [year, month] = monthValue.split('-').map(Number);
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const daysArray: CalendarDay[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateString = date.toISOString().split('T')[0];
      const availabilityForDay = this.availabilityData.find(item => item.date === dateString);

      if (availabilityForDay) {
        daysArray.push({
          date: new Date(availabilityForDay.date),
          stock: availabilityForDay.stock,
          room_type: availabilityForDay.room_type,
          hotel_name: availabilityForDay.hotel_name
        });
      } else {
        daysArray.push({ date: new Date(dateString), stock: 0 });
      }
    }

    this.calendarDays = daysArray;
  }
}
