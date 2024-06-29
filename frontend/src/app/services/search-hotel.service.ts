import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { SearchHotel } from '../models/searchHotel';

@Injectable({
  providedIn: 'root'
})
export class SearchHotelService {
  private apiUrl = 'http://127.0.0.1:8000/api/search/';
  private searchedCitySubject = new BehaviorSubject<string | null>(null);
  searchedCity$ = this.searchedCitySubject.asObservable();
  private searchedCheckInDateSubject = new BehaviorSubject<string | null>(null);
  searchedCheckInDate$ = this.searchedCheckInDateSubject.asObservable();
  private searchedCheckOutDateSubject = new BehaviorSubject<string | null>(null);
  searchedCheckOutDate$ = this.searchedCheckOutDateSubject.asObservable();
  private sortBySubject = new BehaviorSubject<string | null>(null);
  sortBy$ = this.sortBySubject.asObservable();
  constructor(private http: HttpClient) { }

  getAllHotels(searchedHotel: { city: string; start_date: string; end_date: string; sort?: string }): Observable<SearchHotel[]> {
    return this.http.post<{ data: SearchHotel[] }>(this.apiUrl, searchedHotel).pipe(
      map(response => response.data)
    );
  }
  setSearchCity(city: string): void {
    this.searchedCitySubject.next(city);
  }

  setSearchCheckInDate(date: string): void {
    this.searchedCheckInDateSubject.next(date);
  }

  setSearchCheckOutDate(date: string): void {
    this.searchedCheckOutDateSubject.next(date);
  }

  setSearchSortBy(sortBy: string): void {
    this.sortBySubject.next(sortBy);
  }
}
