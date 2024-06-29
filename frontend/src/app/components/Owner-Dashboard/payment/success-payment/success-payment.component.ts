import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-success-payment',
  standalone: true,
  imports: [],
  templateUrl: './success-payment.component.html',
  styleUrl: './success-payment.component.css'
})
export class SuccessPaymentComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private paymentService: PaymentService,private router:Router){}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      const payerID = params['PayerID'];

      if (token && payerID) {
        this.confirmPayment(token, payerID);
      } else {
        console.error('Missing token or PayerID in query parameters');
      }
    });
  }

  confirmPayment(token: string, payerID: string): void {
    this.paymentService.confirmPayment(token, payerID).subscribe({
      next: (response) => {
        console.log('Payment confirmation response:', response);
        // Display SweetAlert2 success message
        Swal.fire({
          title: 'Payment Successful!',
          text: 'Payment has been confirmed successfully. Thank you!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/owner/payment']);
      },
      error: (error) => {
        console.error('Error confirming payment:', error);
        // Display SweetAlert2 error message
        Swal.fire({
          title: 'Payment Failed',
          text: 'There was an error confirming your payment. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

}
