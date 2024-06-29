import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.css'
})
export class VerifyAccountComponent {
   constructor(private route: ActivatedRoute
    , private http: HttpClient, private router:Router) { }

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
      localStorage.setItem("verified", new Date().toISOString());
      // Show SweetAlert on success
      Swal.fire({
        title: 'Email Verified!',
        text: 'Your email has been successfully verified.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect to home page
        this.router.navigate(['/home']);
      });
    }, error => {
      console.error('Error verifying account:', error);
      // Show error alert
      Swal.fire({
        title: 'Verification Failed',
        text: 'There was an error verifying your account. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    });
  }

}
