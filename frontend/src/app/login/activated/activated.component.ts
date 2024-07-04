import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-activated',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activated.component.html',
  styleUrls: ['./activated.component.css']
})
export class ActivatedComponent implements OnInit {
  registrationError: string | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const scope = params['scope'];

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

    this.loading = true;

    this.http.get(urlWithParams).subscribe({
      next: (response: any) => {
        const userData = response.user;
        const token = response.token;
        const id = userData.id;
        const role = userData.role;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', id.toString());
        localStorage.setItem('userRole', role);

        this.redirectBasedOnRole(role);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching user data:', error);

        if (error.status === 404) {
          this.registrationError = 'You do not have an account. Please register.'; // Set custom error message
          this.router.navigate(['/register'], { queryParams: { error: this.registrationError } });
        } else {
          this.registrationError = 'An unexpected error occurred. Please try again.';
          this.router.navigate(['/register'], { queryParams: { error: this.registrationError } });
        }
        console.log("reee"+ this.registrationError); // Add log to see if the error message is being set
        this.loading = false;
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

  register(): void {
    this.router.navigate(['/register']);
  }


}
