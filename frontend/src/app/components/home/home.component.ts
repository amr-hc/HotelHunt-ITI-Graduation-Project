import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { SliderComponent } from '../../layouts/slider/slider.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ListhotelsComponent } from './listhotels/listhotels.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,SliderComponent,FooterComponent,WelcomeComponent,ListhotelsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
