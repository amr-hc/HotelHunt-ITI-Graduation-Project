import { Component, OnInit, OnDestroy } from '@angular/core';
import { Payment } from '../../models/payment';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  payments: Payment[] = [];
  groupedPayments: { [key: string]: Payment[] } = {};
  hotels: string[] = [];
  selectedHotel: string | null = 'select';
  selectedMonth: string | null = 'select';
  isLoading: boolean = false;
  errorMessage: string | null = null;
  currentPage: number = 1;
  months: string[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.isLoading = true;
    const paymentSubscription = this.paymentService.getAllPayments().subscribe(
      (response: any) => {
        this.payments = response.data;
        // Sort payments by date in descending order
        this.payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.groupPaymentsByHotel();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching payments', error);
        this.errorMessage = 'Error fetching payments';
        this.isLoading = false;
      }
    );
    this.subscriptions.add(paymentSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private groupPaymentsByHotel(): void {
    this.groupedPayments = this.payments.reduce((acc, payment) => {
      if (!acc[payment.hotel]) {
        acc[payment.hotel] = [];
      }
      acc[payment.hotel].push(payment);
      return acc;
    }, {} as { [key: string]: Payment[] });

    this.hotels = Object.keys(this.groupedPayments);
    this.hotels.sort();

    for (const hotel in this.groupedPayments) {
      this.groupedPayments[hotel].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    this.initializeMonths();
  }

  private initializeMonths(): void {
    const monthsSet = new Set<string>();
    this.payments.forEach(payment => {
      const month = new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      monthsSet.add(month);
    });
    this.months = Array.from(monthsSet).sort();
  }

  onHotelChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedHotel = target.value;
  }

  onMonthChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedMonth = target.value;
  }

  clearSelection(): void {
    this.selectedHotel = 'select';
    this.selectedMonth = 'select';
  }

  hasSelection(): boolean {
    return this.selectedHotel !== 'select' || this.selectedMonth !== 'select';
  }

  deletePayment(id: number): void {
    Swal.fire({
      title: 'Delete Payment',
      text: 'Are you sure you want to delete this payment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteSubscription = this.paymentService.deletePayment(id).subscribe(
          () => {
            this.payments = this.payments.filter(payment => payment.id !== id);
            this.groupPaymentsByHotel();
            Swal.fire('Deleted!', 'Payment has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting payment', error);
            Swal.fire('Error!', 'Failed to delete payment.', 'error');
          }
        );
        this.subscriptions.add(deleteSubscription);
      }
    });
  }

  getFilteredPayments(): Payment[] {
    if (this.selectedHotel === 'select' && this.selectedMonth === 'select') {
      return [];
    }

    let filteredPayments = this.payments;

    if (this.selectedHotel !== 'select' && this.selectedHotel !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.hotel === this.selectedHotel);
    }

    if (this.selectedMonth !== 'select' && this.selectedMonth !== 'all') {
      filteredPayments = filteredPayments.filter(payment => {
        const paymentMonth = new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' });
        return paymentMonth === this.selectedMonth;
      });
    }

    // Sort the filtered payments by date in descending order
    filteredPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return filteredPayments;
  }
}
