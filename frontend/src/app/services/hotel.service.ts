import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel';
import { HotelImage } from '../models/hotelImage';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  id: number =0;
  name: string ='' ;
  city: string ='';

  private apiUrl = 'http://127.0.0.1:8000/api/hotels/';
  private ownerApiUrl = 'http://127.0.0.1:8000/api/owner/';

  constructor(private http: HttpClient) { }

  getHotelById(id: number): Observable<{ data: Hotel }> {
    return this.http.get<{ data: Hotel }>(`${this.apiUrl}${id}`);
  }

  getHotelImages(id: number): Observable<HotelImage[]> {
    return this.http.get<HotelImage[]>(`${this.apiUrl}${id}/images`);
  }

  //get all hotels
  getAllHotels(): Observable<{ data: Hotel[] }> {
    return this.http.get<{ data: Hotel[] }>(this.apiUrl);
  }

  //update hotel status
  updateHotelStatus(id: number, status: 'active' | 'inactive' | 'suspend'): Observable<Hotel> {
    return this.http.patch<Hotel>(`${this.apiUrl}${id}/`, { status });
  }

  //delete hotel
  deleteHotel(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  getHotelForOwner(ownerId: number): Observable<{data: Hotel[]}>{

    return this.http.get<{data: Hotel[]}>(`${this.ownerApiUrl}${ownerId}/hotels`);
  }

  updateHotel(hotelData: any, id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}${id}`, hotelData);
  }
  addHotelImages(id: number, images: FileList): Observable<HotelImage[]> {
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      formData.append('images[]', images[i], images[i].name);
    }

    //7const headers = new HttpHeaders();
    // headers.set('Authorization', 'Bearer ' + token); // Uncomment and modify as needed

    return this.http.post<HotelImage[]>(`${this.apiUrl}${id}/images`, formData);
  }
}
