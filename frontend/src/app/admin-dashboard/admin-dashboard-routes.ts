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
import { BookingDetailsComponent } from './bookings/bookingdetails/bookingdetails.component';
import { AdduserComponent } from './users/adduser/adduser.component';
import { AddownerComponent } from './owners/addowner/addowner.component';
import { EdituserComponent } from './users/edituser/edituser.component';
import { EditownerComponent } from './owners/editowner/editowner.component';
import { AddhotelComponent } from './hotels/addhotel/addhotel.component';
import { EdithotelComponent } from './hotels/edithotel/edithotel.component';
import { ImagesComponent } from './hotels/hotel-details/images/images.component';
import { RoomtypesComponent } from './hotels/hotel-details/roomtypes/roomtypes.component';
import { CommentsComponent } from './hotels/hotel-details/comments/comments.component';
import { AddroomtypeComponent } from './hotels/hotel-details/roomtypes/addroomtype/addroomtype.component';
import { ShowroomtypeComponent } from './hotels/hotel-details/roomtypes/showroomtype/showroomtype.component';
import { EditroomtypeComponent } from './hotels/hotel-details/roomtypes/editroomtype/editroomtype.component';




export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', component:WelcomeComponent  },
      { path: 'hotels', component:HotelsComponent  },
      { path: 'hotels/add', component:AddhotelComponent  },
      { path: 'hotels/edit/:id', component:EdithotelComponent  },
      { path: 'hotels/:id', component: HotelDetailsComponent },
      { path: 'hotels/:id/images', component: ImagesComponent },
      { path: 'hotels/:id/comments', component: CommentsComponent },
      { path: 'hotels/:id/rooms', component: RoomtypesComponent },
      { path: 'hotels/:id/rooms/add', component: AddroomtypeComponent },
      { path: 'hotels/:id/rooms/:roomId', component: ShowroomtypeComponent },
      { path: 'hotels/:id/rooms/:roomId/edit', component: EditroomtypeComponent },
      { path: 'users', component:UsersComponent  },
      { path: 'users/add', component:AdduserComponent  },
      { path: 'users/edit/:id', component:EdituserComponent  },
      { path: 'users/details/:id', component:UsersdetailsComponent  },
      { path: 'owners', component:OwnersComponent  },
      { path: 'owners/add', component:AddownerComponent  },
      { path: 'owners/edit/:id', component:EditownerComponent  },
      { path: 'owners/details/:id', component:OwnersdetailsComponent  },
      { path: 'payments', component:PaymentComponent  },
      { path: 'payments/add', component:AddpaymentComponent  },
      { path: 'profile', component:ProfileComponent  },
      { path: 'profile/edit/:id', component:EditComponent  },
      { path: 'bookings', component:BookingsComponent  },
      { path: 'bookings/details/:id', component:BookingDetailsComponent  },
    ],
  },
];
