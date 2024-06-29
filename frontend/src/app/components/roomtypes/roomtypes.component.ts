import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { HotelService } from './../../services/hotel.service';
import { RoomType2 } from './../../models/roomtype2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../layouts/footer/footer.component';
@Component({
  selector: 'app-roomtypes',
  standalone: true,
  imports: [HeaderComponent,CommonModule,FooterComponent],
  templateUrl: './roomtypes.component.html',
  styleUrl: './roomtypes.component.css'
})
export class RoomtypesComponent implements OnInit  {
  roomTypes: RoomType2[] = [];
  hotelId: number;
  rooms?:string;
  constructor(private route: ActivatedRoute, private hotelService: HotelService) {
    this.hotelId = this.route.snapshot.params['id'];
    // this.hotelId=this.active
  }

  ngOnInit(): void {
    this.hotelService.getHotelById(this.hotelId).subscribe((data:any) => {
      this.roomTypes = data.data.roomtypes;
      console.log(data.data.roomtypes)
    });
  }
}
