import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/rates/can/';

  constructor(private http: HttpClient) { }

  canRateOrComment(hotel_id: number|null): Observable<any> {
    return this.http.get<any>(this.apiUrl + hotel_id);
  }
}
