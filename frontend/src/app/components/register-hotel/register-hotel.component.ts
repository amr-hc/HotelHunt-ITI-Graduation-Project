import { Component } from '@angular/core';

@Component({
  selector: 'app-register-hotel',
  standalone: true,
  imports: [],
  templateUrl: './register-hotel.component.html',
  styleUrl: './register-hotel.component.css'
})
export class RegisterHotelComponent {
hotelData={
  name: '',
  country: '',
  city: '',
  address: '',
  status: '',
  owner_id: '',
  description: '',
}
constructor( ){}
}
