import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingData } from '../models/booking-data';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://127.0.0.1:8000/api/booking/';

  constructor(private http: HttpClient) { }

  bookingRoom(bookingData: BookingData): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
  }

  getAllBookings(): Observable<BookingData[]> {
    return this.http.get<{data: BookingData[]}>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}
