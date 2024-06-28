import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SearchHotel } from '../models/searchHotel';

@Injectable({
  providedIn: 'root'
})
export class SearchHotelService {
  private apiUrl = 'http://127.0.0.1:8000/api/search/';
  constructor(private http: HttpClient) { }

  getAllHotels(searchedHotel: { city: string; start_date: string; end_date: string; sort?: string }): Observable<SearchHotel[]> {
    return this.http.post<{ data: SearchHotel[] }>(this.apiUrl, searchedHotel).pipe(
      map(response => response.data)
    );
  }
}
