import { BookingDetails } from "./booking-details";

export class Booking {
  constructor(
    public id: number,
    public user_id: number,
    public duration: number,
    public status: string,
    public book_details: BookingDetails[]
  ) {}
}
