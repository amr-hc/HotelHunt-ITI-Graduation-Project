import { Component, OnInit } from '@angular/core';
import { RoomType } from '../../../../../models/roomtype';
import { ActivatedRoute } from '@angular/router';
import { RoomtypeService } from '../../../../../services/roomtype.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-showroomtype',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './showroomtype.component.html',
  styleUrl: './showroomtype.component.css'
})
export class ShowroomtypeComponent implements OnInit {
  roomType: RoomType | undefined;
  roomId: any;

  constructor(
    private route: ActivatedRoute,
    private roomtypeService: RoomtypeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.roomId = params.get('roomId');
      if (this.roomId) {
        this.loadRoomTypeDetails(this.roomId);
      }
    });
  }

  loadRoomTypeDetails(id: any): void {
    this.roomtypeService.getById(id).subscribe(
      (data: any) => {
        this.roomType = data; // Assuming API returns the whole room type object
      },
      (error) => {
        console.error('Error loading room type details', error);
        // Handle error if needed, e.g., show error message
      }
    );
  }
}
