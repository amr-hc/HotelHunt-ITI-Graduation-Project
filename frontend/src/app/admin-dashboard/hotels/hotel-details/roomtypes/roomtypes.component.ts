import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomtypeService } from '../../../../services/roomtype.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomType } from '../../../../models/roomtype';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roomtypes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './roomtypes.component.html',
  styleUrl: './roomtypes.component.css'
})
export class RoomtypesComponent implements OnInit, OnDestroy {
  message = '';
  roomTypes: RoomType[] = [];
  hotelId: number | null = null;
  isLoading = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private roomTypeService: RoomtypeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.paramMap.subscribe(params => {
      this.hotelId = Number(params.get('id'));
      if (this.hotelId) {
        this.loadRoomTypes(this.hotelId);
      }
    });
    this.subscriptions.add(routeSub);
  }

  loadRoomTypes(hotelId: number): void {
    this.isLoading = true;
    const roomTypesSub = this.roomTypeService.getAllRoomsByHotel(hotelId).subscribe(
      (data) => {
        this.roomTypes = data;
        this.isLoading = false;
        if (this.roomTypes.length === 0) {
          this.message = 'No room types found.';
        }
      },
      (error) => {
        console.error('Error fetching room types:', error);
        this.isLoading = false;
        this.message = 'Error fetching room types.';
      }
    );
    this.subscriptions.add(roomTypesSub);
  }

  confirmDelete(roomTypeId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this room type!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRoomType(roomTypeId);
      }
    });
  }

  deleteRoomType(roomTypeId: number): void {
    const deleteSub = this.roomTypeService.delete(roomTypeId).subscribe(
      () => {
        Swal.fire(
          'Deleted!',
          'Room type has been deleted.',
          'success'
        );
        // Reload room types after deletion
        if (this.hotelId) {
          this.loadRoomTypes(this.hotelId);
        }
      },
      (error) => {
        console.error('Error deleting room type:', error);
        Swal.fire(
          'Error!',
          'Failed to delete room type.',
          'error'
        );
      }
    );
    this.subscriptions.add(deleteSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
