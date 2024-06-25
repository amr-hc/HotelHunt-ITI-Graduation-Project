import { Component, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HotelRoomSearchService } from '../../services/hotel-room-search.service';
import { HotelRoomSearch } from '../../models/hotel-room-search';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { BookingData } from '../../models/booking-data';
import { BookingDetails } from '../../models/booking-details';

@Component({
  selector: 'app-hotel-room-availability',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hotel-room-availability.component.html',
  styleUrls: ['./hotel-room-availability.component.css']
})
export class HotelRoomAvailabilityComponent implements OnDestroy {
  @Input() hotel_id: number | undefined;
  checkinDate: string = '';
  checkoutDate: string = '';
  rooms: HotelRoomSearch[] = [];
  selectedRooms: { [roomId: number]: number } = {};
  private searchSubscription: Subscription | null = null;
  private bookingSubscription: Subscription | null = null;

  constructor(private hotelRoomSearchService: HotelRoomSearchService,private bookingService: BookingService) { }

  onSearch() {
    const searchParams = {
      hotel_id: this.hotel_id,
      start_date: this.checkinDate,
      end_date: this.checkoutDate
    };

    this.searchSubscription = this.hotelRoomSearchService.getAllHotelRooms(searchParams).subscribe(
      (data: HotelRoomSearch[]) => {
        this.rooms = data;
        console.log(this.rooms);
      },
      (error: any) => {
        console.error('Error fetching hotel rooms', error);
      }
    );
  }
  getRoomOptions(stock: number): number[] {
    return Array.from({ length: stock + 1 }, (_, index) => index);
  }
  onRoomSelectionChange(roomId: number, event: any) {
    this.selectedRooms[roomId] = +event.target.value;
  }
  onReserve() {
    const bookingDetails: BookingDetails[] = [];

    this.rooms.forEach(room => {
      const quantity = this.selectedRooms[room.id] || 0;
      if (quantity > 0) {
        for (let i = 0; i < quantity; i++) {
          bookingDetails.push(new BookingDetails(room.id, this.checkinDate, Number(room.price)));
        }
      }
    });

    if (bookingDetails.length > 0) {
      const bookingData = new BookingData(1, 1, 'progress', bookingDetails);
      console.log(bookingData);

      this.bookingSubscription = this.bookingService.bookingRoom(bookingData).subscribe(
        response => {
          console.log('Booking successful', response);
        },
        error => {
          console.error('Booking failed', error);
        }
      );
    }
  }
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
  }
}
