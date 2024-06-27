import { AddImageComponent } from './components/Owner-Dashboard/hotel-owner/add-image/add-image.component';
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

import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';

import { BookingComponent } from './components/Owner-Dashboard/booking/booking.component';
import { UserProfileComponent } from './user/profile/profile.component';
import { BookDetailsComponent } from './components/Owner-Dashboard/booking/book-details/book-details.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { HotelOwnerComponent } from './components/Owner-Dashboard/hotel-owner/hotel-owner.component';
import { HotelEditComponent } from './components/Owner-Dashboard/hotel-owner/hotel-edit/hotel-edit.component';
import { SidebarComponent } from './components/Owner-Dashboard/sidebar/sidebar.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ActivatedComponent } from './login/activated/activated.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { HotellistComponent } from './components/hotellist/hotellist.component';



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {path: 'register', component: RegisterComponent },
  { path: 'availability/:id', component: AvailabilityComponent},
  {path: 'register/hotel',component: RegisterHotelComponent },
  { path: 'search', component: SearchHotelsComponent },
  { path: 'hotel/:id' , component: HotelComponent},
  { path: 'login', component: LoginComponent },
  {path: 'reset', component: ResetPasswordComponent},
  {path: 'forget-password', component:ForgetPasswordComponent},
  {path: 'verify/:id/:token',component:VerifyAccountComponent},
  {path : "list" , component : ListComponent},
  {path : "show/:id" , component : ShowComponent },
  {path : "add" , component : AddComponent },
  {path : "update/:id" , component : UpdateComponent },
  {path : "user/profile/edit" , component : EditProfileComponent },
  {path : "login/google" , component : ActivatedComponent },

  { path:'admin-dashboard',     loadChildren: () =>
    import('./admin-dashboard/admin-dashboard-routes').then((m) => m.adminRoutes)},
    {path : "home" , component : HomeComponent },
  {path : "about" , component : AboutComponent },
   {path : "contact" , component :ContactComponent },

  {path : "user/profile" , component : UserProfileComponent },


  { path:'admin-dashboard',     loadChildren: () =>
    import('./admin-dashboard/admin-dashboard-routes').then((m) => m.adminRoutes)},
    {path: 'owner', loadChildren:()=>import("./components/Owner-Dashboard/owner.routes").then(o=>o.ownerRoutes)},
  
  {path : "hotelList" , component : HotellistComponent},

  //  {path:'owner', component:SidebarComponent},
  //  {path:'owner/booking' , component: BookingComponent},
  //  {path:'owner/booking/:id' , component: BookDetailsComponent},
  //  {path: 'owner/hotel', component:HotelOwnerComponent},
  //  {path: 'owner/hotel/:id', component:HotelEditComponent},
  //  {path: 'owner/hotel/:id/addImage',component: AddImageComponent },

];
