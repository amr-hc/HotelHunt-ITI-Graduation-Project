import { BookingDetails } from "./booking-details";

export class Booking {
  constructor(
    public id: number,
    public user_id: number,
    public user_name:string,
    public duration: number,
    public status: string,
    public total_price:number,
    public book_details: BookingDetails[]
  ) {}
}
