import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl= 'http://127.0.0.1:8000/api/contacts';

  constructor(private http:HttpClient) { }

  sendMessage(contactData:any):Observable<any>{
    return this.http.post(this.apiUrl, contactData);
  }

}
