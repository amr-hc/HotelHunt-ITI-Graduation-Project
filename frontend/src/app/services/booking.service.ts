import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingData } from '../models/booking-data';
import { map } from 'rxjs/operators';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://127.0.0.1:8000/api/booking/';

  constructor(private http: HttpClient) { }

  bookingRoom(bookingData: BookingData): Observable<any> {
    return this.http.post(this.apiUrl, bookingData);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<{data: Booking[]}>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<{data: Booking}>(`${this.apiUrl}${id}`).pipe(
      map(response => response.data)
    );
  }

  getUserBookings(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}user-bookings/${userId}`);
  }

  updateStatus( status: string ,id: number,): Observable<any> {
    const url = `${this.apiUrl}${id}/status`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { status };

    return this.http.put(url, body, { headers }).pipe(
      map(response => {
        return response; // You can transform the response here if needed
      })
    );
  }
}
