import { RoomType } from "./roomtype";

export class Hotel {
  constructor(
    public id: number,
    public owner_id: number,
    public balance: number,
    public name: string,
    public address: string,
    public country: string,
    public image: string,
    public photo: string,
    public city: string,
    public status: 'active' | 'inactive',
    public star_rating: number,
    public average_rate: number,
    public description: string,
    public owner_name: string,
    public roomtypes: RoomType[]
  ){}
}
