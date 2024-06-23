import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = 'http://127.0.0.1:8000/api/availability/';

  constructor(private http: HttpClient) {}

  checkAvailability(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
