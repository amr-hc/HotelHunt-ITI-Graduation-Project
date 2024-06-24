import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { HotelsComponent } from './hotels/hotels.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'hotels', component:HotelsComponent  },
      { path: 'users', component:UsersComponent  },
      { path: 'payment', component:PaymentComponent  },
      { path: 'profile', component:ProfileComponent  },
    ],
  },
];