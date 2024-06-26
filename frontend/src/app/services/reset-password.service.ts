import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiURL = "http://127.0.0.1:8000/api/forgot";

  constructor(private http:HttpClient) { }

  sendResetEmail(email: string): Observable<any> {
    
    const body = {
      email: email
    };

    return this.http.post<any>(this.apiURL, body);
  }
}

