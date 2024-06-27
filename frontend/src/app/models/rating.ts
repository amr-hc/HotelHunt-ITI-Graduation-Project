export class Rating {
  constructor(
    public id: number,
    public rate: number,
    public user_id: number,
    public user: string,
    public hotel_id: number,
    public hotel_name: string
  ){}
}
export class UserRating {
  constructor(
    public rate: number,
    public user_id: number|null,
    public hotel_id: number|null,
  ){}
}
