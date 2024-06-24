export class User {
  constructor(
    public id: number,
    public fname: string,
    public lname: string,
    public email: string,
    public city: string,
    public address: string,
    public photo: string,
    public phone: number,
    public age: number,
  ) {}
}
