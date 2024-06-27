import { Component } from '@angular/core';
import { Payment } from '../../models/payment';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  payments: Payment[] = [];
  currentPage: number =1;
  isLoading: boolean = false;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.paymentService.getAllPayments().subscribe(
      (response: any) => {
        this.payments = response.data.sort((a: Payment, b: Payment) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching payments', error);
        this.isLoading = false;
      }
    );
  }
}
