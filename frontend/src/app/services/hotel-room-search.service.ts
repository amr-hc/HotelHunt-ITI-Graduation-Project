import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HotelRoomSearch } from '../models/hotel-room-search';

@Injectable({
  providedIn: 'root'
})
export class HotelRoomSearchService {
  private apiUrl = 'http://127.0.0.1:8000/api/search/hotel';

  constructor(private http: HttpClient) { }
  getAllHotelRooms(searchedHotelRoom: { hotel_id: number|null; start_date: string; end_date: string; }): Observable<HotelRoomSearch[]> {
    return this.http.post<HotelRoomSearch[]>(this.apiUrl, searchedHotelRoom);

  }
}
