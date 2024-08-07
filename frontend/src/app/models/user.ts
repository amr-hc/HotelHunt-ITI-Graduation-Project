export class User {
  constructor(
    public id: number,
    public fname: string,
    public lname: string,
    public email: string,
    public phone: string,
    public address: string,
    public role: 'admin' | 'owner' | 'guest',
    public age: number,
    public photo: string,
    public email_verified_at?: any,
    public hotel?: string
  ) {}
}
