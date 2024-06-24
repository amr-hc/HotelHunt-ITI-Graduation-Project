import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel';
import { HotelImage } from '../models/hotelImage';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  id: number =0;
  name: string ='' ;
  city: string ='';

  private apiUrl = 'http://127.0.0.1:8000/api/hotels/';

  constructor(private http: HttpClient) { }

  getHotelById(id: number): Observable<{ data: Hotel }> {
    return this.http.get<{ data: Hotel }>(`${this.apiUrl}${id}`);
  }
  getHotelImages(id: number): Observable<HotelImage[]> {
    return this.http.get<HotelImage[]>(`${this.apiUrl}${id}/images`);
  }
}
