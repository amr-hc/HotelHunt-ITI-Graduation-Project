import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AvailabilityService } from '../services/availability.service';
import { CommonModule } from '@angular/common';
import { CreateAvailabilityComponent } from './create-availability/create-availability.component';

 

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CreateAvailabilityComponent],
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent {



}
