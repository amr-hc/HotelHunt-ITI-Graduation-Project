import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { Payment } from '../../../models/payment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule, RouterLink],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  isLoading: boolean = true; // Track loading state
  errorMessage: string | null = null; // Store error messages

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true; // Start loading
    this.paymentService.getHotelPayments().subscribe(
      data => {
        this.payments = data;
        this.totalItems = data.length;
        console.log('Payments:', this.payments);
        this.isLoading = false; // Stop loading
      },
      error => {
        console.error('Error fetching payments', error);
        this.errorMessage = 'Error fetching payments. Please try again later.';
        this.isLoading = false; // Stop loading even on error
      }
    );
  }
}
