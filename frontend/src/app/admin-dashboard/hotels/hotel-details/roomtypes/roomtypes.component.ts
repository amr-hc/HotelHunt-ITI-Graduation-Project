import { Component, OnInit } from '@angular/core';
import { RoomtypeService } from '../../../../services/roomtype.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomType } from '../../../../models/roomtype';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roomtypes',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './roomtypes.component.html',
  styleUrl: './roomtypes.component.css'
})
export class RoomtypesComponent implements OnInit {
  message = '';
  roomTypes: RoomType[] = [];
  hotelId: number | null = null;

  constructor(
    private roomTypeService: RoomtypeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hotelId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.hotelId) {
      this.loadRoomTypes(this.hotelId);
    }
  }

  loadRoomTypes(hotelId: number): void {
    this.roomTypeService.getAllRoomsByHotel(hotelId).subscribe(
      (data) => {
        this.roomTypes = data;
        if (this.roomTypes.length === 0) {
          this.message = 'No room types found.';
        }
      },
      (error) => {
        console.error('Error fetching room types:', error);
        this.message = 'Error fetching room types.';
      }
    );
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
    this.roomTypeService.delete(roomTypeId).subscribe(
      () => {
        Swal.fire(
          'Deleted!',
          'Room type has been deleted.',
          'success'
        );
        // Reload room types after deletion
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
          this.loadRoomTypes(id);
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
  }
}
