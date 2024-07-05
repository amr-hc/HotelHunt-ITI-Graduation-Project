import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hotel } from '../../../models/hotel';
import { HotelService } from '../../../services/hotel.service';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Payment } from '../../../models/payment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addpayment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addpayment.component.html',
  styleUrl: './addpayment.component.css',
})
export class AddpaymentComponent implements OnInit, OnDestroy {
  addPaymentForm: FormGroup;
  hotels: Hotel[] = [];
  formSubmitted = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.addPaymentForm = this.fb.group({
      hotel_id: ['', Validators.required],
      amount: [
        '',
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(999999.0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    const hotelsSubscription = this.hotelService.getAllHotels().subscribe(response => {
      this.hotels = response.data;
    });
    this.subscriptions.add(hotelsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.addPaymentForm.valid) {
      const newPayment: Payment = this.addPaymentForm.value;
      const createPaymentSubscription = this.paymentService.createPayment(newPayment).subscribe(response => {
        this.addPaymentForm.reset();
        this.formSubmitted = false;
        this.router.navigate(['/admin-dashboard/payments']);
      });
      this.subscriptions.add(createPaymentSubscription);
    }
  }
}
