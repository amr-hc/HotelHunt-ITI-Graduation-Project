import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../layouts/header/header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet,RouterLink,HeaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
