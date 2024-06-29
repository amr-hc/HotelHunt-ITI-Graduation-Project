import { Routes } from "@angular/router";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { BookingComponent } from "./booking/booking.component";
import { BookDetailsComponent } from "./booking/book-details/book-details.component";
import { HotelOwnerComponent } from "./hotel-owner/hotel-owner.component";
import { HotelEditComponent } from "./hotel-owner/hotel-edit/hotel-edit.component";
import { AddImageComponent } from "./hotel-owner/add-image/add-image.component";
import { OwnerDashboardComponent } from "./owner-dashboard/owner-dashboard.component";
import { AvailabilityComponent } from "../../availability/availability.component";
import { ListComponent } from "../../roomtype/list/list.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { ProfileComponent } from "./profile/profile.component";
import { EditComponent } from "./profile/edit/edit.component";
import { AddComponent } from "../../roomtype/add/add.component";
import { ShowComponent } from "../../roomtype/show/show.component";
import { UpdateComponent } from "../../roomtype/update/update.component";
import { AddpaymentComponent } from "./payment/addpayment/addpayment.component";

export const ownerRoutes : Routes = [
  {path: '', component: OwnerDashboardComponent,
    children: [
      {path: '', component: WelcomeComponent},
   {path:'booking' , component: BookingComponent},
   {path:'booking/:id' , component: BookDetailsComponent},
   {path: 'hotel', component:HotelOwnerComponent},
   {path: 'hotel/:id', component:HotelEditComponent},
   {path: 'hotel/:id/addImage',component: AddImageComponent },
   { path: 'availability/:id', component: AvailabilityComponent},
   {path : "list" , component : ListComponent},
   {path: "show/:id",component:ShowComponent},
   {path: "update/:id",component:UpdateComponent},
   {path: "add", component:AddComponent},
   {path: 'profile', component:ProfileComponent},
   {path: 'profile/edit/:id', component:EditComponent},
   {path: 'payment/add', component:AddpaymentComponent},
    ]

  }
]
