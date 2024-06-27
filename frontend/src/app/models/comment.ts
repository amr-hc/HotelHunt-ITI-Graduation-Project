export class Comment {
  constructor(
    public id: number,
    public content: string,
    public created_at:string,
    public user_id: number,
    public user_name: string,
    public hotel_id: number,
  ) { }
}

export class UserComment {
  constructor(
    public user_id: number|null,
    public hotel_id: number,
    public content: string,
  ) { }
}
