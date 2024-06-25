import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isUsersAccordionOpen = false;
  isPaymentAccordionOpen = false;

  toggleUsersAccordion() {
    this.isUsersAccordionOpen = !this.isUsersAccordionOpen;
  }
  togglePaymentAccordion() {
    this.isPaymentAccordionOpen = !this.isPaymentAccordionOpen;
  }
}
