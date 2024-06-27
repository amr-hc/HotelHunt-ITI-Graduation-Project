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
      const code = params['code'];
      const scope = params['scope'];

      // Debugging logs
      console.log('Received query parameters:', { code, scope });

      if (code && scope) {
        this.getUserData(code, scope);
      } else {
        console.error('Missing parameters in the callback URL');
      }
    });
  }

  getUserData(code: string, scope: string): void {
    const apiUrl = `http://localhost:8000/api/auth/google/callback`;
    const urlWithParams = `${apiUrl}?code=${code}&scope=${scope}`;

    console.log('Sending GET request to backend:', urlWithParams);

    this.http.get(urlWithParams).subscribe({
      next: (response: any) => {
        console.log('Successfully fetched user data:', response);

        const userData = response.user;
        const token = response.token;
        const id = userData.id;
        const role = userData.role;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', id.toString());
        localStorage.setItem('userRole', role);

        this.redirectBasedOnRole(role);
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
      name: userData.fname,
    };

    console.log('Sending POST request to login:', payload);

    this.http.post(loginUrl, payload).subscribe({
      next: (response: any) => {
        console.log('Successfully logged in:', response);
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Error logging in:', error);
      }
    });
  }
  redirectBasedOnRole(role: string): void {
    switch(role) {
      case 'guest':
        this.router.navigate(['/home']);
        break;
      case 'owner':
        this.router.navigate(['/owner/hotel']);
        break;
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        console.error('Unknown user role:', role);
        this.router.navigate(['/home']);
    }
  }
}
