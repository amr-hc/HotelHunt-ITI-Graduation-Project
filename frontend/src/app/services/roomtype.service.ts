import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomType } from '../models/roomtype';

@Injectable({
  providedIn: 'root'
})
export class RoomtypeService {
  private url = "http://127.0.0.1:8000/api/roomtype";

  constructor(private http: HttpClient) {}

  get(): Observable<any> {
    return this.http.get(this.url + "/owner");
  }

  getById(id: any): Observable<any> {
    return this.http.get(this.url + `/${id}`);
  }

  post(object: FormData): Observable<any> {
    return this.http.post(this.url, object);
  }

  put(id: any, formData: FormData): Observable<any> {
    const patchUrl = `${this.url}/${id}?_method=patch`;
    return this.http.post(patchUrl, formData);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(this.url + `/${id}`);
  }
}
