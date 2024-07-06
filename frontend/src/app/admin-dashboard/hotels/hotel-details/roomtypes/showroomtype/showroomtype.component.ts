import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomType } from '../../../../../models/roomtype';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomtypeService } from '../../../../../services/roomtype.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-showroomtype',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './showroomtype.component.html',
  styleUrls: ['./showroomtype.component.css']
})
export class ShowroomtypeComponent implements OnInit, OnDestroy {
  roomType: RoomType | undefined;
  roomId: any;
  hotelId: any;
  isLoading = false;
  message = '';
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private roomtypeService: RoomtypeService
  ) { }

  ngOnInit(): void {
    const routeSub = this.route.paramMap.subscribe(params => {
      this.roomId = params.get('roomId');
      this.hotelId = params.get('id');
      if (this.roomId) {
        this.loadRoomTypeDetails(this.roomId);
      }
    });
    this.subscriptions.add(routeSub);
  }

  loadRoomTypeDetails(id: any): void {
    this.isLoading = true;
    const roomTypeSub = this.roomtypeService.getById(id).subscribe(
      (data: any) => {
        this.roomType = data;
        this.isLoading = false;
        if (!this.roomType) {
          this.message = 'Room type not found.';
        }
        
      },
      (error) => {
        console.error('Error loading room type details', error);
        this.isLoading = false;
        this.message = 'Error loading room type details.';
      }
    );
    this.subscriptions.add(roomTypeSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
