import { BookingDetails } from "./booking-details";

export class BookingData {
  constructor(
    public user_id: number|null,
    public duration: number,
    public status: string,
    public books_details: BookingDetails[]
  ) {}
}
