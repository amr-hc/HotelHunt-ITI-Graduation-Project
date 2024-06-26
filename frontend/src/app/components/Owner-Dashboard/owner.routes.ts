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

export const ownerRoutes : Routes = [
  {path: '', component: OwnerDashboardComponent,
    children: [
   {path:'booking' , component: BookingComponent},
   {path:'booking/:id' , component: BookDetailsComponent},
   {path: 'hotel', component:HotelOwnerComponent},
   {path: 'hotel/:id', component:HotelEditComponent},
   {path: 'hotel/:id/addImage',component: AddImageComponent },
   { path: 'availability/:id', component: AvailabilityComponent},
   {path : "list" , component : ListComponent},
    ]

  }
]