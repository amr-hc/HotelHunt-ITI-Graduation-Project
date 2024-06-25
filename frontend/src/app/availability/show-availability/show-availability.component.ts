// show-availability.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

interface Availability {
  id: number;
  stock: number;
  date: string;
  room_type_id: number;
  total_rooms: number;
  room_type: string;
  hotel_id: number;
  hotel_name: string;
}

interface CalendarDay {
  id : number
  date: Date;
  stock: number;
  total_rooms: number;
  room_type?: string;
  hotel_name?: string;
}

@Component({
  selector: 'app-show-availability',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './show-availability.component.html',
  styleUrls: ['./show-availability.component.css']
})
export class ShowAvailabilityComponent implements OnInit {
  id: number|string | null=0;
  total_rooms: number=0;
  availabilityData: any[] = []; 
  calendarDays: CalendarDay[] = [];
  currentMonthValue: string = '';
  months: { value: string, label: string }[] = [];
  selectedDay: CalendarDay  = {
    id: 0,                   
    date: new Date(),         
    stock: 0,                 
    total_rooms: 0,           
    room_type: '',            
    hotel_name: ''            
  };
  isUpdateMode: boolean = false;



  constructor(private http: HttpClient,private route: ActivatedRoute) {

    
  }




  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id'); 
    });

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
    this.http.get<any>(`http://127.0.0.1:8000/api/availability/room/${this.id}`).subscribe(
      response => {
        this.availabilityData = response.data;
        this.onMonthSelect(this.currentMonthValue); 
      },
      error => {
        console.error('Error fetching availability:', error);
      }
    );
  }

  onMonthSelect(eventOrValue: Event | string): void {
    let monthValue: string;
    if (typeof eventOrValue === 'string') {
      monthValue = eventOrValue; 
    } else {
      monthValue = (eventOrValue.target as HTMLSelectElement).value; 
    }

    const [year, month] = monthValue.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const daysArray: CalendarDay[] = [];

    for (let day = 2; day-1 <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateString = date.toISOString().split('T')[0];
      const availabilityForDay = this.availabilityData.find(item => item.date === dateString);

      if (availabilityForDay) {
        daysArray.push({
          id : availabilityForDay.id,
          date: new Date(availabilityForDay.date),
          stock: availabilityForDay.stock,
          total_rooms: availabilityForDay.total_rooms,
          room_type: availabilityForDay.room_type,
          hotel_name: availabilityForDay.hotel_name
        });
      } else {
        daysArray.push({
          id:0,
          date: new Date(dateString),
          stock: 0, 
          total_rooms: 0, 
          room_type: 'N/A',
          hotel_name: 'N/A'
        });
      }
    }

    this.calendarDays = daysArray;
  }

  onDaySelect(day: CalendarDay): void {
    this.total_rooms=day.total_rooms;
    this.selectedDay = day ;
    this.isUpdateMode = day.id > 0;
  }




  onSubmitUpdate(): void {
    if (this.selectedDay) {
      const url = `http://127.0.0.1:8000/api/availability/${this.selectedDay.id}`;
      const payload = {
        stock: this.selectedDay.stock,
        total_rooms: this.selectedDay.total_rooms,
      };

      this.http.patch(url, payload).subscribe(
        response => {
          console.log('Availability updated successfully:', response);
        },
        error => {
          console.error('Error updating availability:', error);
       
        }
      );
    }
  }
  onSubmitCreate(): void {
    if (this.selectedDay) {
      const url = 'http://127.0.0.1:8000/api/availability/';
      const payload = {
        stock: this.selectedDay.total_rooms,
        total_rooms: this.selectedDay.total_rooms,
        date: this.selectedDay.date.toISOString().split('T')[0],
        room_type_id: this.id 
      };

      this.http.post(url, payload).subscribe(
        response => {
          console.log('Availability Created successfully:', response);
        },
        error => {
          console.error('Error updating availability:', error);
         
        }
      );
    }
  }


  onFormSubmit() {
    this.selectedDay.stock =(this.total_rooms-this.selectedDay.total_rooms)+this.selectedDay.stock;
    this.selectedDay.total_rooms =this.total_rooms;
    if (this.isUpdateMode) {
      this.onSubmitUpdate();
    } else {
      this.onSubmitCreate();
    }
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  }
}
