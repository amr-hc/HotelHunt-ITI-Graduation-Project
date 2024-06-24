import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HotelImagesService {
  private apiUrl = 'http://127.0.0.1:8000/api/hotels/1/images';

  constructor() { }
}
