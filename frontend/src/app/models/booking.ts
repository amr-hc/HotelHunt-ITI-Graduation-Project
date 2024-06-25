import { BookingDetails2 } from "./bookingDetails";

export class Booking {
  constructor(
    public id: number,
    public user_id: number,
    public user_name:string,
    public duration: number,
    public status: string,
    public total_price:number,
    public book_details: BookingDetails2[]
  ) {}
}
