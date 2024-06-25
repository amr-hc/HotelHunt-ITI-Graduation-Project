import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { FooterComponent } from '../../layouts/footer/footer.component';
import { SliderComponent } from '../../layouts/slider/slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,SliderComponent,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
