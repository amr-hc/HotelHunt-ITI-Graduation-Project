import { Component, OnInit } from '@angular/core';
import { Payment } from '../../models/payment';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})

export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  groupedPayments: { [key: string]: Payment[] } = {};
  hotels: string[] = [];
  selectedHotel: string | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  currentPage: number = 1;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.paymentService.getAllPayments().subscribe(
      (response: any) => {
        this.payments = response.data;
        this.groupPaymentsByHotel();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching payments', error);
        this.errorMessage = 'Error fetching payments';
        this.isLoading = false;
      }
    );
  }

  private groupPaymentsByHotel(): void {
    this.groupedPayments = this.payments.reduce((acc, payment) => {
      if (!acc[payment.hotel]) {
        acc[payment.hotel] = [];
        this.hotels.push(payment.hotel); // Collect unique hotels
      }
      acc[payment.hotel].push(payment);
      return acc;
    }, {} as { [key: string]: Payment[] });

    // Sort hotels alphabetically
    this.hotels.sort();

    // Sort payments by date in descending order for each hotel
    for (const hotel in this.groupedPayments) {
      this.groupedPayments[hotel].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }

  onHotelChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.onSelectHotel(target.value);
  }

  onSelectHotel(selectedHotel: string | null): void {
    this.selectedHotel = selectedHotel;
  }

  clearSelection(): void {
    this.selectedHotel = null;
  }
}

