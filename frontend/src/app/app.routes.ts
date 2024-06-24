import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AvailabilityComponent } from './availability/availability.component';
import { RegisterHotelComponent } from './components/register-hotel/register-hotel.component';
import { SearchHotelsComponent } from './user/search-hotels/search-hotels.component';
import { LoginComponent } from './login/login.component';
import { HotelComponent } from './components/hotel/hotel.component';
import { ListComponent } from './roomtype/list/list.component';
import { ShowComponent } from './roomtype/show/show.component';
import { AddComponent } from './roomtype/add/add.component';
import { UpdateComponent } from './roomtype/update/update.component';
import { BookingComponent } from './components/Owner-Dashboard/booking/booking.component';

export const routes: Routes = [
  {path: 'register', component: RegisterComponent },
  { path: 'availability', component: AvailabilityComponent},
  {path: 'register/hotel',component: RegisterHotelComponent },
  { path: 'search', component: SearchHotelsComponent },
  { path: 'hotel/:id' , component: HotelComponent},
  { path: 'login', component: LoginComponent },
  {path : "list" , component : ListComponent},
  {path : "show/:id" , component : ShowComponent },
  {path : "add" , component : AddComponent },
  {path : "update/:id" , component : UpdateComponent },


  { path:'admin-dashboard',     loadChildren: () =>
    import('./admin-dashboard/admin-dashboard-routes').then((m) => m.adminRoutes)},



   {path:'owner/booking' , component: BookingComponent}
];
