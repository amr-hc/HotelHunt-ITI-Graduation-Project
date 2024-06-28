import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`); 
  }
}
