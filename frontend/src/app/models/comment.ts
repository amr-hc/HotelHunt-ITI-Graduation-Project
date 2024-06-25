export class Comment {
  constructor(
    public id: number,
    public hotel_id: number,
    public user_id: number,
    public content: string,
    public created_at:string,
    public updated_at:string
  ) { }
}

export class UserComment {
  constructor(
    public user_id: number,
    public hotel_id: number,
    public content: string,
  ) { }
}
