import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router:Router) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  handleLoginSuccess(credentials: any): void {
    localStorage.setItem('userId', credentials.user.id);
    localStorage.setItem('userRole', credentials.user.role);
    localStorage.setItem('token', credentials.token);
  }

  logout(): Observable<void> {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');

    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('userRole');
    return user ? user : null;
  }

  setprofile(){
    const role=localStorage.getItem('userRole');
      if(role === 'owner'){
        this.router.navigate(['/owner/profile']);
      }else if(role === 'admin'){
        this.router.navigate(['/admin-dashboard/profile']);
      }else if (role === 'guest'){
        this.router.navigate(['/user/profile'])
      }
  }
  isGuest(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'guest';
  }

  isOwner(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'owner';
  }

}

