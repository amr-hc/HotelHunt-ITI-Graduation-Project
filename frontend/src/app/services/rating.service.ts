import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Rating, UserRating } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://127.0.0.1:8000/api/rates/'
  constructor(private http: HttpClient) { }

  getUserRating(hotel_id : number|null, user_id: number|null): Observable<Rating> {
    // return this.http.get<Rating>(this.apiUrl + hotel_id + '/' + user_id);
    return this.http.get<Rating>(`${this.apiUrl}${hotel_id}/${user_id}`);
  }
  createUserRating(userRating: UserRating): Observable<any> {
    return this.http.post<any>(this.apiUrl, userRating);
  }
  updateUserRating(hotel_id: number|null, userRating: UserRating): Observable<any> {
    return this.http.put<any>(this.apiUrl+hotel_id, userRating);
  }
  getRatingforLoginUser(hotel_id: number|null): Observable<Rating> {
    return this.http.get<Rating>(this.apiUrl + 'hotel/mine/'+ hotel_id);
  }
}


