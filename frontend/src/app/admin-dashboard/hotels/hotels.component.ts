import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { HotelService } from '../../services/hotel.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,NgxPaginationModule],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css'
})
export class HotelsComponent implements OnInit{
  hotels: Hotel[] = [];
  currentPage: number =1;
  isLoading: boolean = true;


  constructor(private hotelService: HotelService,private userService: UserService,private router: Router) { }

  ngOnInit(): void {
    this.hotelService.getAllHotels().subscribe(response => {
      this.hotels = response.data;
      this.loadOwnerNames();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.error('Error loading hotels:', error);
    });
  }

  loadOwnerNames(): void {
    const ownerRequests = this.hotels.map(hotel => this.userService.getUserById(hotel.owner_id));
    forkJoin(ownerRequests).subscribe(responses => {
      responses.forEach((user, index) => {
        this.hotels[index].owner_name = user.fname;
      });
    }, error => {
      console.error('Error loading owner names:', error);
    });
  }

  viewHotelDetails(id: number): void {
    this.router.navigate(['admin-dashboard/hotels', id]);
  }

  confirmDeleteHotel(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this hotel!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteHotel(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your hotel is safe :)', 'info');
      }
    });
  }

  deleteHotel(id: number): void {
    this.hotelService.deleteHotel(id).subscribe(() => {
      this.hotels = this.hotels.filter(hotel => hotel.id !== id);
      Swal.fire('Deleted!', 'Your hotel has been deleted.', 'success');
    }, error => {
      Swal.fire('Error!', 'Failed to delete hotel.', 'error');
      console.error('Error deleting hotel:', error);
    });
  }

  updateHotelStatus(hotel: Hotel): void {
    const newStatus = hotel.status;
    this.hotelService.updateHotelStatus(hotel.id, newStatus).subscribe(updatedHotel => {

      console.log('Hotel status updated:', updatedHotel);
    });
  }


}
