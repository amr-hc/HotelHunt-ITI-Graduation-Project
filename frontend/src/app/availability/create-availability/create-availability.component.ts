// create-availability.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-availability',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-availability.component.html',
  styleUrls: ['./create-availability.component.css']
})
export class CreateAvailabilityComponent {
  responseMessage: string | null = null;

  constructor(private http: HttpClient) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const totalRooms = formData.get('total_rooms') as string;
    const date = formData.get('date') as string;
    const roomTypeId = formData.get('room_type_id') as string;

    const availabilityData = {
      total_rooms: +totalRooms,
      date: date,
      room_type_id: +roomTypeId
    };

    this.http.post('http://127.0.0.1:8000/api/availability/', availabilityData)
      .subscribe({
        next: (response) => {
          this.responseMessage = 'Availability created successfully!';
        },
        error: (error) => {
          this.responseMessage = 'Failed to create availability.';
          console.error('There was an error!', error);
        }
      });
  }
}
