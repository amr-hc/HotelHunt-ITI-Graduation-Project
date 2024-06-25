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



export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'hotels', component:HotelsComponent  },
      { path: 'hotels/:id', component: HotelDetailsComponent },
      { path: 'users', component:UsersComponent  },
      { path: 'users/details/:id', component:UsersdetailsComponent  },
      { path: 'owners/details/:id', component:OwnersdetailsComponent  },
      { path: 'owners', component:OwnersComponent  },
      { path: 'payment', component:PaymentComponent  },
      { path: 'profile', component:ProfileComponent  },
      { path: 'profile/edit/:id', component:EditComponent  },
    ],
  },
];
