import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-activated',
  templateUrl: './activated.component.html',
  styleUrls: ['./activated.component.css']
})
export class ActivatedComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Capture the query parameters
    this.route.queryParams.subscribe(params => {
      const state = params['state'];
      const code = params['code'];
      const scope = params['scope'];

      // Debugging logs
      console.log('Received query parameters:', { state, code, scope });

      if (state && code && scope) {
        this.getUserData(state, code, scope);
      } else {
        console.error('Missing parameters in the callback URL');
      }
    });
  }

  getUserData(state: string, code: string, scope: string): void {
    const apiUrl = `http://localhost:8000/api/auth/google/callback`;

    const urlWithParams = `${apiUrl}?state=${state}&code=${code}&scope=${scope}`;

    console.log('Sending GET request to backend:', urlWithParams);

    this.http.get(urlWithParams).subscribe({
      next: (response: any) => {
        console.log('Successfully fetched user data:', response);

        const userData = response.data;

        this.loginUser(userData);
      },
      error: (error: any) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  loginUser(userData: any): void {
    const loginUrl = `http://localhost:8000/api/login`;

    const payload = {
      email: userData.email,
      name: userData.name,
    };

    // Debugging logs
    console.log('Sending POST request to login:', payload);

    this.http.post(loginUrl, payload).subscribe({
      next: (response: any) => {
        console.log('Successfully logged in:', response);


        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Error logging in:', error);
        // Additional error handling
      }
    });
  }
}
