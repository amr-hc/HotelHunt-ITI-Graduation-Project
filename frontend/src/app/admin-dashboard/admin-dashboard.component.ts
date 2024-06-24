import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet,RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
