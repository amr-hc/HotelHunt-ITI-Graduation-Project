import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://127.0.0.1:8000/api/payments';
  private apiBaseURL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${payment.id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  createPaymentForOwner(amount: number): Observable<any> {
    const url = `${this.apiBaseURL}/create-payment?value=${amount}`;
    return this.http.get<any>(url);
  }
  confirmPayment(token: string, payerID: string): Observable<any> {
    const params = new HttpParams()
      .set('token', token)
      .set('PayerID', payerID);

    const url = `${this.apiBaseURL}/success-payment`;

    return this.http.get<any>(url, { params });
  }
  getHotelPayments(): Observable<Payment[]> {
    const url = `${this.apiBaseURL}/payment/hotel`;
    return this.http.get<Payment[]>(url);
  }
}
