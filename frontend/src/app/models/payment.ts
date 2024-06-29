export class Payment {
  constructor(
    public id: number,
    public amount: number,
    public hotel_id: number,
    public date: string,
    public hotel: string,
    public method: string,
  ) {}
}

