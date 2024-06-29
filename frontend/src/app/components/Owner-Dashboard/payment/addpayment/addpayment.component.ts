import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../../models/hotel';
import { HotelService } from '../../../../services/hotel.service';
import { PaymentService } from '../../../../services/payment.service';
import { Payment } from '../../../../models/payment';

@Component({
  selector: 'app-addpayment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './addpayment.component.html',
  styleUrl: './addpayment.component.css',
})
export class AddpaymentComponent {
  addPaymentForm: FormGroup;
  hotels: Hotel[] = [];
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.addPaymentForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.addPaymentForm.valid) {
      const amount = this.addPaymentForm.value.amount;
      this.paymentService.createPaymentForOwner(amount).subscribe({
        next: (response) => {
          console.log('Payment link:', response.link);
          window.location.href = response.link; // Redirect to the payment link
        },
        error: (error) => {
          console.error('Error creating payment:', error);
        }
      });
    }
  }
}
