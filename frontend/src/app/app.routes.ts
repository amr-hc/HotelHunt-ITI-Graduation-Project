import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AvailabilityComponent } from './availability/availability.component';
import { RegisterHotelComponent } from './components/register-hotel/register-hotel.component';
import { SearchHotelsComponent } from './user/search-hotels/search-hotels.component';
import { LoginComponent } from './login/login.component';
import { HotelComponent } from './components/hotel/hotel.component';

export const routes: Routes = [
  {path: 'register', component: RegisterComponent },
  { path: 'availability', component: AvailabilityComponent},
  {path: 'register/hotel',component: RegisterHotelComponent },
  { path: 'search', component: SearchHotelsComponent },
  { path: 'hotel/:id' , component: HotelComponent}
  { path: 'login', component: LoginComponent },
];
