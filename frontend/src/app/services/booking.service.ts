import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingData } from '../models/booking-data';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://127.0.0.1:8000/api/booking/';

  constructor(private http: HttpClient) { }

  bookingRoom(bookingData: BookingData): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
  }
}
