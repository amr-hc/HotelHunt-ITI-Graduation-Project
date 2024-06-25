import { BookingDetails } from "./booking-details";

export class BookingData {
  constructor(
    public user_id: number,
    public duration: number,
    public total_price: number,
    public status: string,
    public hotel: string,
    public book_details: BookingDetails[]
  ) {}
}
