import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../layouts/header/header.component';
import { FooterComponent } from '../../../layouts/footer/footer.component';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [SidebarComponent,RouterLink,RouterOutlet,HeaderComponent, FooterComponent],
  templateUrl: './owner-dashboard.component.html',
  styleUrl: './owner-dashboard.component.css'
})
export class OwnerDashboardComponent {

}
