import { BookingDetails2 } from "./bookingDetails";

export class Booking {
  constructor(
    public id: number,
    public user_id: number,
    public user_name:string,
    public duration: number,
    public status: string,
    public hotel: string,
    public total_price:number,
    public check_in: string,
    public check_out: string,
    public book_details: BookingDetails2[],
    public grouped_details?: BookingDetails2[] 

  ) {}
}
