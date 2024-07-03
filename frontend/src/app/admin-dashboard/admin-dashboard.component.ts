import { Component, HostListener } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../layouts/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet,RouterLink,HeaderComponent,CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
