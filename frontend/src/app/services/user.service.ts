import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/users';
  private apiUrl2 = 'http://127.0.0.1:8000/api';


  constructor(private http:HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  editUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${user.id}?_method=PATCH`, user);
  }

  updateUser(formData: FormData): Observable<User> {
    const userId = formData.get('id');
    return this.http.post<User>(`${this.apiUrl}/${userId}?_method=PATCH`, formData);
  }

  addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(this.apiUrl, formData);
  }

  getOwnersWithoutHotels(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl2}/getownerswithouthotel`);
  }

  editVerification(id: number, data: Partial<User>): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/${id}?_method=PATCH`, data);
  }
  reVerify(data: any): Observable<any> {

    return this.http.post<any>(`${this.apiUrl2}/re-verify`, data);
  }

}
