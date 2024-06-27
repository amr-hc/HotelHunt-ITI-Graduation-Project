import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private apiUrl='http://127.0.0.1:8000/api/hotels';

  constructor(private http: HttpClient) { }

  // registerHotel(hotelData:any):Observable<any>{
  //   return this.http.post(this.apiUrl,hotelData);
  // }

  registerHotel(hotelData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, hotelData);
  }
}
