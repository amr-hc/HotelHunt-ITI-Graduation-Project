import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { HotelService } from '../../services/hotel.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxPaginationModule],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css'],
})
export class HotelsComponent implements OnInit, OnDestroy {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  isLoading: boolean = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private hotelService: HotelService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const hotelsSub = this.hotelService.getAllHotels().subscribe(
      (response) => {
        this.hotels = response.data;
        this.filteredHotels = this.hotels;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading hotels:', error);
      }
    );
    this.subscription.add(hotelsSub);
  }

  filterHotels(): void {
    this.filteredHotels = this.hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewHotelDetails(id: number): void {
    this.router.navigate(['admin-dashboard/hotels', id]);
  }

  editHotelDetails(id: number): void {
    this.router.navigate(['admin-dashboard/hotels/edit', id]);
  }

  confirmDeleteHotel(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this hotel!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteHotel(id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your hotel is safe :)', 'info');
      }
    });
  }

  deleteHotel(id: number): void {
    const deleteSub = this.hotelService.deleteHotel(id).subscribe(
      () => {
        this.hotels = this.hotels.filter((hotel) => hotel.id !== id);
        this.filterHotels();
        Swal.fire('Deleted!', 'Your hotel has been deleted.', 'success');
      },
      (error) => {
        Swal.fire('Error!', 'Failed to delete hotel.', 'error');
        console.error('Error deleting hotel:', error);
      }
    );
    this.subscription.add(deleteSub);
  }

  updateHotelStatus(hotel: Hotel): void {
    const statusSub = this.hotelService.updateHotelStatus(hotel.id, hotel.status).subscribe(
      (updatedHotel) => {
        console.log('Hotel status updated:', updatedHotel);
      }
    );
    this.subscription.add(statusSub);
  }

  isFeatureLimitReached(): boolean {
    return this.hotels.filter(h => h.isFeatured).length >= 3;
  }

  toggleFeatured(hotel: Hotel): void {
    if (!hotel.isFeatured && this.isFeatureLimitReached()) {
      hotel.isFeatured = false;
      return;
    }

    hotel.isFeatured = !hotel.isFeatured;
    const featuredSub = this.hotelService.updateHotelFeaturedStatus(hotel.id, hotel.isFeatured).subscribe(
      () => {
        console.log('Hotel featured status updated:', hotel);
      },
      (error) => {
        console.error('Error updating featured status:', error);
        hotel.isFeatured = !hotel.isFeatured;
      }
    );
    this.subscription.add(featuredSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
