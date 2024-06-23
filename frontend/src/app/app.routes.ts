import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AvailabilityComponent } from './availability/availability.component';

export const routes: Routes = [
  {path: 'register', component: RegisterComponent },
  {path: 'availability',component: AvailabilityComponent,},
];
