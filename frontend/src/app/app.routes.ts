import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AvailabilityComponent } from './availability/availability.component';
import { SearchHotelsComponent } from './user/search-hotels/search-hotels.component';
import { HotelComponent } from './components/hotel/hotel.component';

export const routes: Routes = [
  {path: 'register', component: RegisterComponent },
  { path: 'availability', component: AvailabilityComponent, },
  { path: 'search', component: SearchHotelsComponent },
  { path: 'hotel/:id' , component:HotelComponent}
];
