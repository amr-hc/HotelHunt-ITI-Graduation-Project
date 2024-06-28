import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private geoDbUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
  private rapidApiHost = 'wft-geo-db.p.rapidapi.com';
  private rapidApiKey = 'e6d720b9cemsh9c59aba7b02dcf4p118769jsnf7e8aae7d0ae'; 

  constructor(private http: HttpClient) {}

  getCities(countryCode: string): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-host': this.rapidApiHost,
      'x-rapidapi-key': this.rapidApiKey
    });
    const params = {
      countryIds: countryCode,
      limit: '10'
    };
    return this.http.get(this.geoDbUrl, { headers, params });
  }
}
