import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import { HotelComponent } from './components/hotel/hotel.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SliderComponent } from './layouts/slider/slider.component';
import { FooterComponent } from './layouts/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RegisterComponent,HotelComponent,HeaderComponent,SliderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
