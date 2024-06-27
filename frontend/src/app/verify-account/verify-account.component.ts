import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.css'
})
export class VerifyAccountComponent {
   constructor(private route: ActivatedRoute
    , private http: HttpClient) { }

  ngOnInit(): void {
    // Extract parameters from the URL
    this.route.params.subscribe(params => {
      const userId = params['id']; // Extract 'id' parameter
      const token = params['token']; // Extract 'token' parameter

      // Extract query parameters
      this.route.queryParams.subscribe(queryParams => {
        const expires = queryParams['expires'];
        const signature = queryParams['signature'];

        // Construct the API URL
        const apiUrl = `http://localhost:8000/api/verify/${userId}/${token}?expires=${expires}&signature=${signature}`;

        // Make the GET request
        this.verifyAccount(apiUrl);
      });
    });
  }

  verifyAccount(url: string): void {
    this.http.get(url).subscribe(response => {
      console.log(response);
      // Handle the response here
    }, error => {
      console.error('Error verifying account:', error);
      // Handle the error here
    });
  }

}
