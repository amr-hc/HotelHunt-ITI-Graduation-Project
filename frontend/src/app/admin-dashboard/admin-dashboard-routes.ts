import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { HotelsComponent } from './hotels/hotels.component';
import { HotelDetailsComponent } from './hotels/hotel-details/hotel-details.component';
import { OwnersComponent } from './owners/owners.component';
import { UsersdetailsComponent } from './users/usersdetails/usersdetails.component';
import { OwnersdetailsComponent } from './owners/ownersdetails/ownersdetails.component';
import { EditComponent } from './profile/edit/edit.component';
import { BookingsComponent } from './bookings/bookings.component';
import { AddpaymentComponent } from './payment/addpayment/addpayment.component';
import { BookDetailsComponent } from '../components/Owner-Dashboard/booking/book-details/book-details.component';
import { WelcomeComponent } from './welcome/welcome.component';



export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', component:WelcomeComponent  },
      { path: 'hotels', component:HotelsComponent  },
      { path: 'hotels/:id', component: HotelDetailsComponent },
      { path: 'users', component:UsersComponent  },
      { path: 'users/details/:id', component:UsersdetailsComponent  },
      { path: 'owners', component:OwnersComponent  },
      { path: 'owners/details/:id', component:OwnersdetailsComponent  },
      { path: 'payments', component:PaymentComponent  },
      { path: 'payments/add', component:AddpaymentComponent  },
      { path: 'profile', component:ProfileComponent  },
      { path: 'profile/edit/:id', component:EditComponent  },
      { path: 'bookings', component:BookingsComponent  },
      { path: 'bookings/details/:id', component:BookDetailsComponent  },
    ],
  },
];
