import { Component } from '@angular/core';
import { Hotel } from '../../../models/hotel';
import { HotelService } from '../../../services/hotel.service';
import { PaymentService } from '../../../services/payment.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Payment } from '../../../models/payment';

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
    private hotelService: HotelService,
    private paymentService: PaymentService,
    private router:Router
  ) {
    this.addPaymentForm = this.fb.group({
      hotel_id: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.hotelService.getAllHotels().subscribe(response => {
      this.hotels = response.data;
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.addPaymentForm.valid) {
      const newPayment: Payment = this.addPaymentForm.value;
      this.paymentService.createPayment(newPayment).subscribe(response => {
        this.addPaymentForm.reset();
        this.formSubmitted = false;
        this.router.navigate(['/admin-dashboard/payments']);
      });
    }
  }
}
