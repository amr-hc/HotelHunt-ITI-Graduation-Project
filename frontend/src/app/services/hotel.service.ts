import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Hotel } from '../models/hotel';
import { HotelImage } from '../models/hotelImage';
import { catchError } from 'rxjs/operators';
import {  of } from 'rxjs';

import { RoomType2 } from '../models/roomtype2';
@Injectable({
  providedIn: 'root'
})
export class HotelService {

  id: number =0;
  name: string ='' ;
  city: string ='';

  private apiUrl = 'http://127.0.0.1:8000/api/hotels/';
  private ownerApiUrl = 'http://127.0.0.1:8000/api/owner/';
  private hotelIdSubject = new BehaviorSubject<number | null>(null);
  hotelId$ = this.hotelIdSubject.asObservable();

  constructor(private http: HttpClient) { }

  getHotelById(id: number): Observable<{ data: Hotel }> {
    return this.http.get<{ data: Hotel }>(`${this.apiUrl}${id}`);
  }

  getHotelImages(id: number): Observable<HotelImage[]> {
    return this.http.get<HotelImage[]>(`${this.apiUrl}${id}/images`);
  }

  //get all hotels
  getAllHotels(): Observable<{ data: Hotel[] }> {
    return this.http.get<{ data: Hotel[] }>(this.apiUrl);
  }
  getHotelsBycountry(country : string): Observable<{ data: Hotel[] }> {
    return this.http.post< any >('http://127.0.0.1:8000/api/search/country',{country});
  }
  getHotelsByCity(city : string): Observable<{ data: Hotel[] }> {
    return this.http.post< any >('http://127.0.0.1:8000/api/search/city',{city});
  }

  //update hotel status
  updateHotelStatus(id: number, status: 'active' | 'inactive'): Observable<Hotel> {
    return this.http.patch<Hotel>(`${this.apiUrl}${id}/`, { status });
  }

  //delete hotel
  deleteHotel(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  getHotelForOwner(ownerId: number): Observable<{data: Hotel[]}> {
    return this.http.get<{data: Hotel[]}>(`${this.ownerApiUrl}${ownerId}/hotels`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of({ data: [] });
        }
        throw error;
      })
    );
  }

  updateHotel(hotelData: FormData, id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}${id}?_method=patch`, hotelData);
  }
  addHotelImages(id: number, images: FileList): Observable<HotelImage[]> {
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      formData.append('images[]', images[i], images[i].name);
    }

    return this.http.post<HotelImage[]>(`${this.apiUrl}${id}/images`, formData);
  }

  deleteHotelImage(imageId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}images/${imageId}`);
  }

  setHotelId(id: number): void {
    this.hotelIdSubject.next(id);
  }

  updateHotelFeaturedStatus(id: number, isFeatured: boolean): Observable<Hotel> {
    return this.http.patch<Hotel>(`${this.apiUrl}${id}/`, { isFeatured });
  }

  addHotel(hotelData: any): Observable<Hotel> {
    return this.http.post<Hotel>(this.apiUrl, hotelData);
  }

  editHotel(formData: FormData): Observable<Hotel> {
    const hotelId = formData.get('id');
    return this.http.post<Hotel>(`${this.apiUrl}${hotelId}?_method=PATCH`, formData);
  }
}
