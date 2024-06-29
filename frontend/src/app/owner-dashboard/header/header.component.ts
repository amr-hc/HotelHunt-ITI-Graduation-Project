import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ListComponent } from '../../roomtype/list/list.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule,RouterLink,ListComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isUsersAccordionOpen = false;
  isPaymentAccordionOpen = false;

  toggleUsersAccordion() {
    this.isUsersAccordionOpen = !this.isUsersAccordionOpen;
  }
  togglePaymentAccordion() {
    this.isPaymentAccordionOpen = !this.isPaymentAccordionOpen;
  }
}
