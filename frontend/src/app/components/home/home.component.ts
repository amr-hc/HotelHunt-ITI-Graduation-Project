import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { SliderComponent } from '../../layouts/slider/slider.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ListhotelsComponent } from './listhotels/listhotels.component';
import { NearhotelsComponent } from './nearhotelscity/nearhotels.component';
import { NearhotelscountryComponent } from './nearhotelscountry/nearhotelscountry.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,SliderComponent,FooterComponent,WelcomeComponent,ListhotelsComponent,NearhotelsComponent,NearhotelscountryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
