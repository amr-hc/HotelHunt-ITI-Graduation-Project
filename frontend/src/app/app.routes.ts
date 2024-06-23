import { Routes } from '@angular/router';
import { AvailabilityComponent } from './availability/availability.component';
import { SearchHotelsComponent } from './user/search-hotels/search-hotels.component';

export const routes: Routes = [

    {
        path: 'availability',
        component: AvailabilityComponent,
  },
  {
    path: 'searchhotels',
    component:SearchHotelsComponent
  }
];
