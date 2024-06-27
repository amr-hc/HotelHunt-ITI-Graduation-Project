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

  getUserRating(id: number|undefined): Observable<Rating> {
    return this.http.get<{ data: Rating }> (this.apiUrl + id).pipe(
      map(response => response.data)
    )
  }
  createUserRating(userRating: UserRating): Observable<any> {
    return this.http.post<any>(this.apiUrl, userRating);
  }
  updateUserRating(id: number, userRating: UserRating): Observable<any> {
    return this.http.put<any>(this.apiUrl+id, userRating);
  }
}


